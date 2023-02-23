const loadCommentsBtnElem = document.getElementById("load-comments-btn");
const commentsUListElem = document.getElementById("comments-board");
const newCommentFormElem = document.querySelector("#new-comment");

function createCommentsList(comments) {
    const commentsListElement = document.createElement("ul");
    commentsListElement.id = "comments-list";

    for (const comment of comments) {
        const commentElement = document.createElement("li");
        commentElement.innerHTML = `
            <article class="comment-item">
                <h3>
                    ${comment.title}
                </h3>
                <p>
                    ${comment.message}
                </p>
            </article>`;
        commentsListElement.appendChild(commentElement);
    }

    return commentsListElement;
}

async function fetchComments() {
    const postId = loadCommentsBtnElem.dataset.postid;
    const response = await fetch(`/posts/${postId}/comments`);
    const responseData = await response.json();

    commentsUListElem.innerHTML = "";
    commentsUListElem.appendChild(createCommentsList(responseData.comments));
}

async function addNewComment(event) {
    event.preventDefault();
    const enteredTitle = event.target.querySelector("#title").value;
    const enteredMessage = event.target.querySelector("#message").value;
    const postId = event.target.dataset.postid;

    const comment = {
        title: enteredTitle,
        message: enteredMessage,
    };

    const response = await fetch(`/posts/${postId}/comments`, {
        method: "POST",
        body: JSON.stringify(comment),
        headers: {
            "Content-Type": "application/json",
        },
    });

    if (response.ok) fetchComments();
}

loadCommentsBtnElem?.addEventListener("click", fetchComments);
newCommentFormElem.addEventListener("submit", addNewComment);
