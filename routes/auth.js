const express = require("express");

const bcrypt = require("bcrypt");
const db = require("../data/database");

const router = express.Router();

router.get("/signup", function (req, res) {
    res.render("signup");
});

router.post("/signup", async function (req, res) {
    const hashPass = await bcrypt.hash(req.body["user-password"], 11);

    const userData = {
        name: req.body["user-name"],
        email: req.body["user-email"],
        password: hashPass,
    };

    try {
        const result = await db.getDb().collection("users").insertOne(userData);
        if (result.acknowledged) {
            res.redirect("/login");
        } else {
            res.status(503).send("Service Unavailable");
        }
    } catch (error) {
        console.log(error);
        res.status(500).render("500");
    }
});

module.exports = router;
