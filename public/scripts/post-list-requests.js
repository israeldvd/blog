import { deletePost } from "../controllers/post-controller.js";

const deletePostButtons = document.querySelectorAll(
    "#posts-list .post-item .post-actions form button"
);

for (const btn of deletePostButtons) {
    btn.addEventListener("click", deletePost);
}
