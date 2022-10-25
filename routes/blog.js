const express = require("express");
const mongodb = require("mongodb");

const db = require("../data/database");

const ObjectId = mongodb.ObjectId;

const router = express.Router();

router.get("/", function (req, res) {
    res.redirect("/posts");
});

router.get("/posts", async function (req, res) {
    const posts = await db
        .getDb()
        .collection("posts")
        .find({})
        .project({ title: 1, summary: 1, "author.name": 1 })
        .toArray();

    res.render("posts-list", { posts: posts });
});

router.post("/posts", async function (req, res) {
    const authorId = req.body.author;
    let authorObjectId;

    try {
        authorObjectId = new ObjectId(authorId);
    } catch (error) {
        //return res.status(404).render("404");
        console.log(console.log(`Could not find id.\n${error.message}`));
        return next(error);
    }

    const author = await db
        .getDb()
        .collection("authors")
        .findOne({ _id: authorObjectId });

    const newPost = {
        title: req.body.title,
        summary: req.body.summary,
        body: req.body.content,
        createdAt: new Date(),
        author: {
            id: authorObjectId,
            name: author.name,
            email: author.email,
        },
    };

    const result = await db.getDb().collection("posts").insertOne(newPost);
    console.log(result);

    res.redirect("/posts");
});

router.get("/new-post", async function (req, res) {
    const authors = await db.getDb().collection("authors").find().toArray();
    res.render("create-post", { authors: authors });
});

router.get("/authors", async function (req, res) {
    const authors = await db.getDb().collection("authors").find().toArray();
    res.render("authors", { authors: authors });
});

router.post("/authors", async function (req, res) {
    const newAuthor = {
        name: req.body["author-name"],
    };

    const authorsCollection = await db.getDb().collection("authors");
    const count = await authorsCollection.countDocuments({
        name: newAuthor.name,
    });

    if (count === 0) {
        authorsCollection.insertOne(newAuthor);
        res.redirect("/authors");
    } else {
        console.log("There is already an autor with this name");
        res.status(500).render("500");
    }
});

router.get("/posts/:id", async function (req, res, next) {
    const authorID = req.params.id;
    let authorObjectId;

    try {
        authorObjectId = new ObjectId(authorID);
    } catch (error) {
        //return res.status(404).render("404");
        console.log("Could not find id.\n" + error.message);
        return next(error);
    }

    const foundPost = await db
        .getDb()
        .collection("posts")
        .findOne({ _id: authorObjectId }, { projection: { summary: 0 } });

    if (!foundPost) {
        return res.status(404).render("404");
    }

    foundPost.humanReadableDate = foundPost.createdAt.toLocaleDateString(
        "en-US",
        {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
        }
    );

    foundPost.createdAt = foundPost.createdAt.toISOString();

    res.render("post-detail", { post: foundPost });
});

router.get("/posts/:id/edit", async function (req, res, next) {
    const authorId = req.params.id;
    let authorObjectId;

    try {
        authorObjectId = new ObjectId(authorId);
    } catch (error) {
        //return res.status(404).render("404");
        console.log(console.log(`Could not find id.\n${error.message}`));
        return next(error);
    }

    const foundPost = await db
        .getDb()
        .collection("posts")
        .findOne(
            { _id: authorObjectId },
            { projection: { title: 1, summary: 1, body: 1 } }
        );

    if (!foundPost) {
        return res.status(404).render("404");
    }

    res.render("update-post", { post: foundPost });
});

router.post("/posts/:id/edit", async function (req, res, next) {
    const postId = new ObjectId(req.params.id);
    let postObjectId;

    try {
        postObjectId = new ObjectId(postId);
    } catch (error) {
        //return res.status(404).render("404");
        console.log(console.log(`Could not find id.\n${error.message}`));
        return next(error);
    }

    const result = await db
        .getDb()
        .collection("posts")
        .updateOne(
            { _id: postObjectId },
            {
                $set: {
                    title: req.body.title,
                    summary: req.body.summary,
                    body: req.body.content,
                    //date: new Date() //a data should be updated? -- it depends
                },
            }
        );

    res.redirect("/posts"); //see list of posts again, after updating
});

router.post("/posts/:id/delete", async function (req, res) {
    const postId = new ObjectId(req.params.id);
    const result = await db
        .getDb()
        .collection("posts")
        .deleteOne({ _id: postId });
    console.log(result);
    res.redirect("/posts");
});

module.exports = router;
