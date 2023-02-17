const loadCommentsBtnElem = document.getElementById("load-comments-btn");
const commentsUListElem = document.getElementById("comments-list");

function createCommentsList(comments) {
    const commentsListElement = document.createElement("ul");

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

    commentsUListElem.innerHTML = '';
    commentsUListElem.appendChild(
        createCommentsList(responseData.comments)
    );
}

loadCommentsBtnElem?.addEventListener("click", fetchComments);
