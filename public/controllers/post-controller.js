async function updatePost(event) {
    event.preventDefault();

    const postUpdatedData = {
        title: event.target.querySelector("#title").value,
        summary: event.target.querySelector("#summary").value,
        content: event.target.querySelector("#content").value,
    };

    try {
        const response = await fetch(`/posts/${event.target.dataset.postId}`, {
            method: "PATCH",
            body: JSON.stringify(postUpdatedData),
            headers: {
                "Content-Type": "application/json; charset=UTF-8",
            },
        });

        if (!response.ok) {
            alert("Something went wrong with updating this post!");
            return;
        }

        const responseData = await response.json();
        if (responseData.updated) {
            alert(responseData.message);
        } else if (
            !confirm(`${responseData.message} Go back to the list of posts?`)
        ) {
            return;
        }

        window.location.replace("/posts");
    } catch (error) {
        alert(
            "Could not send request to update this post. Please try again later."
        );
    }
}

async function deletePost(event) {
    event.stopPropagation();
    event.preventDefault();

    if (!confirm("You are trying to delete a post. Do you want to proceed?")) {
        return;
    }

    try {
        const response = await fetch(`/posts/${event.target.dataset.postId}`, {
            method: "DELETE",
            headers: {
                "Content-type": "application/json; charset=UTF-8",
            },
        });

        if (!response.ok) {
            alert("Something went wrong while deleting this post.");
            return;
        }

        const responseData = await response.json();
        alert(responseData.message);

        if (responseData.deleted) window.location.replace("/posts");
    } catch (error) {
        alert("Could not send request to delete post. Please try again later.");
    }

    return;
}

export { updatePost, deletePost };
