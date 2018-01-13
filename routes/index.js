const express = require("express");
const router = express.Router();
const slides = require("../base/slides");
const blogposts = require("../base/blogposts");

router.get("/", function(req, res) {
    res.render("index");
});

router.get("/about", function(req, res) {
    res.render("about");
});

router.get("/blog", function(req, res) {
    res.render("blog", {blogposts: blogposts});
});

router.get("/my-works", function(req, res) {
    res.render("my-works", {slides: slides});
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

// console.log(blogposts);
module.exports = router;