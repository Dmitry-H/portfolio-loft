const express = require("express");
const router = express.Router();
const slides = require("../base/slides");
const blogposts = require("../base/blogposts");
const skills = require("../base/skills");
const userData = require("../base/user");

const bodyParser = require("body-parser");
const jsonParser = bodyParser.json();

const fs = require("fs");
const multiparty = require('multiparty');

const mailer = require("../mail/mail");

const nodemailer = require('nodemailer');

router.get("/", function(req, res) {
    console.log(req.session);
    res.render("index");
});

router.get("/about", function(req, res) {
    res.render("about", {skills: skills.get()});
});

router.get("/blog", function(req, res) {
    res.render("blog", {blogposts: blogposts.get()});
});

router.get("/my-works", function(req, res) {
    res.render("my-works", {slides: slides.get()});
});

router.get("/admin", function(req, res) {
    if (req.session.username === userData.getUserData().userName) {
        res.render("admin-skills", {skills: skills.get()});
    }
    else {
        res.render("error-403");
    }
});

router.get("/admin-blog", function(req, res) {
    if (req.session.username === userData.getUserData().userName) {
        res.render("admin-blog");
    }
    else {
        res.render("error-403");
    }
});

router.get("/admin-works", function(req, res) {
    if (req.session.username === userData.getUserData().userName) {
        res.render("admin-works");
    }
    else {
        res.render("error-403");
    }
});

router.post("/logon", jsonParser, function (request, response) {
    if(!request.body) return response.sendStatus(400);
    const userInfo = userData.getUserData();
    if (request.body.username === userInfo.userName && request.body.password === userInfo.password){
        request.session.username = userInfo.userName;
        response.json({status: "ok"});
    }
    else {
        response.json({status: "wrong password"});
    }
});

router.post("/updateskills", jsonParser, function (request, response) {
    if(!request.body) return response.sendStatus(400);
    skills.add(request.body);
    response.json({status: "ok"});
});

router.post("/newblogpost", jsonParser, function (request, response) {
    if(!request.body) return response.sendStatus(400);
    console.log(request.body);
    blogposts.add(request.body);
    response.json({status: "ok"});
});

router.post("/mail", jsonParser, function (request, response) {
    if(!request.body) return response.sendStatus(400);
    console.log(request.body);
    const title = "Уведомление с сайта портфолио";
    const message = `Имя отправителя: ${request.body.name}<br>
    Адрес отправителя: ${request.body.email}<br>
    Сообщение:<br>
    ${request.body.message}`;


    mailer.sendMail(title, message);
    response.json({status: "ok"});
});

router.post("/loadimg", function(req, res, next) {
    // создаем форму
    const form = new multiparty.Form();
    //здесь будет храниться путь с загружаемому файлу, его тип и размер
    const uploadFile = {uploadPath: '', type: '', size: 0};
    //максимальный размер файла
    const maxSize = 2 * 1024 * 1024; //2MB
    //поддерживаемые типы(в данном случае это картинки формата jpeg,jpg и png)
    const supportMimeTypes = ['image/jpg', 'image/jpeg', 'image/png'];
    //массив с ошибками произошедшими в ходе загрузки файла
    const errors = [];

    //если произошла ошибка
    form.on('error', function(err){
        if(fs.existsSync(uploadFile.path)) {
            //если загружаемый файл существует удаляем его
            fs.unlinkSync(uploadFile.path);
            console.log('error');
        }
    });

    form.on('close', function() {
        //если нет ошибок и все хорошо
        if(errors.length == 0) {
            //сообщаем что все хорошо
            res.send({status: 'ok', text: 'Success'});
        }
        else {
            if(fs.existsSync(uploadFile.path)) {
                //если загружаемый файл существует удаляем его
                fs.unlinkSync(uploadFile.path);
            }
            //сообщаем что все плохо и какие произошли ошибки
            res.send({status: 'bad', errors: errors});
        }
    });

    // парсим форму
    // form.parse(req);
    form.parse(req, function(err, fields, files) {
        const destPath = "./dist/img/userpics/" + files.uploadFile[0].originalFilename;
        const bdPath = "./img/userpics/" + files.uploadFile[0].originalFilename;
        const bdRecord = {
            name: fields.name[0],
            teck: fields.technologies[0],
            img: bdPath,
            link: fields.link[0]
        };

         fs.copyFile(files.uploadFile[0].path, destPath, function(err) {

         });

        slides.add(bdRecord);
    });

});

module.exports = router;