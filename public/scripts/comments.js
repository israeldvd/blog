const loadCommentsBtnElem = document.getElementById("load-comments-btn");
const commentsUListElem = document.getElementById("comments-board");
const newCommentFormElem = document.querySelector("#new-comment");
const commentsCountTexts = document.querySelectorAll(".comments-count");

function updateCommentsCountBy(increment) {
    for (counterText of commentsCountTexts) {
        counterText.innerText = +counterText.innerText + increment;
    }
}
function createCommentItem(commentData) {
    const commentElement = document.createElement("li");

    commentElement.innerHTML = `
            <article class="comment-item">
                <h3>
                    ${commentData.title}
                </h3>
                <p>
                    ${commentData.message}
                </p>
            </article>`;

    return commentElement;
}

function createCommentsList(comments) {
    const commentsListElement = document.createElement("ul");
    commentsListElement.id = "comments-list";

    for (const comment of comments) {
        commentsListElement.appendChild(createCommentItem(comment));
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

function appendCommentToUi(comment) {
    // given a list of comments present
    const commentsList =
        document.getElementById("comments-list") ||
        commentsUListElem.querySelector("ul") ||
        commentsUListElem.querySelector("ol");

    // append new comment to this list
    if (commentsList) {
        commentsList.appendChild(createCommentItem(comment));
    }

    updateCommentsCountBy(1);
}

async function addNewComment(event) {
    event.preventDefault();

    const titleElement = event.target.querySelector("#title");
    const messageElement = event.target.querySelector("#message");

    const enteredTitle = titleElement.value;
    const enteredMessage = messageElement.value;

    const postId = event.target.dataset.postid;

    // store comment data
    const comment = {
        title: enteredTitle,
        message: enteredMessage,
    };

    // erase the input field
    for (const inputElem of [titleElement, messageElement]) {
        inputElem.value = "";
    }

    // send a POST request to store the comments
    const response = await fetch(`/posts/${postId}/comments`, {
        method: "POST",
        body: JSON.stringify(comment),
        headers: {
            "Content-Type": "application/json",
        },
    });

    if (response.ok) {
        // no query of comments was made
        if (!commentsCountTexts.length > 0) {
            document.querySelector("#comments-board > p").textContent =
                "You have the first comment. Update the page to see it.";
        }

        appendCommentToUi(comment);
    } else alert("Could not save the comment right now.");
}

loadCommentsBtnElem?.addEventListener("click", fetchComments);
newCommentFormElem.addEventListener("submit", addNewComment);
