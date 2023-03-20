const express = require("express");

const bcrypt = require("bcrypt");
const db = require("../data/database");

const router = express.Router();

router.get("/login", function (req, res) {
    res.render("login");
});

router.post("/login", async function (req, res) {
    const userData = {
        email: req.body["user-email"],
        password: req.body["user-password"],
    };

    try {
        const matchingUser = await db.getDb().collection("users").findOne({
            email: userData.email,
        });

        if (matchingUser) {
            const arePasswordsEqual = await bcrypt.compare(
                userData.password,
                matchingUser.password
            );

            if (!arePasswordsEqual) {
                console.log("Could not log in user: passwords don't match.");
                return res.redirect("/");
            }

            //authenticated
            console.log("User authenticated");
            res.status(200).redirect("/");
        } else {
            res.status(404).send("User not found");
        }
    } catch (error) {
        console.log(error);
        res.status(500).render("500");
    }

    return;
});

router.get("/signup", function (req, res) {
    res.render("signup");
});

router.post("/signup", async function (req, res) {
    const userReqName = req.body["user-name"];
    const userReqEmail = req.body["user-email"];
    const userReqConfirmEmail = req.body["user-confirm-email"];
    const userReqPassword = req.body["user-password"];
    const userReqConfirmPassword = req.body["user-confirm-password"];

    if (
        !userReqEmail ||
        !userReqConfirmEmail ||
        userReqEmail != userReqConfirmEmail ||
        !userReqPassword ||
        !userReqConfirmPassword ||
        userReqPassword !== userReqConfirmPassword ||
        userReqEmail.length < 5 ||
        userReqPassword.length < 8 ||
        !userReqEmail.includes("@") ||
        !userReqEmail.includes(".")
    ) {
        console.log("User data contain one or more errors or mismatches.");
        return res.status(400).render("400", { previousRoute: "/signup" });
    }

    const hashPass = await bcrypt.hash(userReqPassword, 11);
    const hashConfirmPass = await bcrypt.hash(userReqConfirmPassword, 11);

    const userData = {
        name: userReqName,
        email: userReqEmail,
        confirmEmail: userReqConfirmEmail,
        password: hashPass,
        confirmPassword: hashConfirmPass,
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
