const express = require("express");
const router = express.Router();

router.get("/", function(req, res) {
    res.render("index");
});

router.get("/about", function(req, res) {
    res.render("about");
});

router.get("/blog", function(req, res) {
    res.render("blog");
});

router.get("/my-works", function(req, res) {
    res.render("my-works");
});

router.get("/admin", function(req, res) {
    res.render("admin-skills");
});

router.get("/admin-blog", function(req, res) {
    res.render("admin-blog");
});

router.get("/admin-works", function(req, res) {
    res.render("admin-works");
});
module.exports = router;