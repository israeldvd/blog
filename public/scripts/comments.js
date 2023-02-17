const loadCommentsBtnElem = document.getElementById("load-comments-btn");
// const commentsListElem = document.getElementById("comments-list");

async function fetchComments() {
    const postId = loadCommentsBtnElem.dataset.postid;
    const response = await fetch(`/posts/${postId}/comments`);
    const responseData = await response.json();
    console.log(responseData);
}

loadCommentsBtnElem?.addEventListener("click", fetchComments);
