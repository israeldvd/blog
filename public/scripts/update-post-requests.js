import { updatePost } from "../controllers/post-controller.js";

const postInfoFormElem = document.getElementById("post-info-form");

postInfoFormElem.addEventListener("submit", updatePost);
