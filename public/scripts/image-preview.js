const filePickerElement = document.getElementById("author-image");
const imagePreviewElement = document.getElementById("image-preview");

const showPreview = () => {
    const files = filePickerElement.files;

    if (!files || files.length === 0) {
        imagePreviewElement.style.display = "none";
        return;
    }

    imagePreviewElement.src = URL.createObjectURL(files[0]);
    imagePreviewElement.style.display = "block";
};

filePickerElement.addEventListener("change", showPreview);
