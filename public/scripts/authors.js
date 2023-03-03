const deleteAuthorButtons = document.querySelectorAll(
    "#authors-list li button"
);

async function deleteAuthor(event) {
    event.stopPropagation();

    try {
        const action = `/authors/${event.target.dataset.authorId}`;

        const response = await fetch(action, {
            method: "DELETE",
            headers: { "Content-type": "application/json; charset=UTF-8" },
        });

        if (!response.ok) {
            alert("Something went wrong while deleting this author.");
            return;
        }
    } catch (error) {
        alert(
            "Could not send request to delete author. Please try again later."
        );
    }

    return;
}

for (const btn of deleteAuthorButtons) {
    btn.addEventListener("click", deleteAuthor);
}
