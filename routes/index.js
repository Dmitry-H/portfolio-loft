const express = require("express");
const router = express.Router();
const slides = require("../base/slides");
const blogposts = require("../base/blogposts");
const skills = require("../base/skills");

const bodyParser = require("body-parser");
const jsonParser = bodyParser.json();

const fs = require("fs");
const multiparty = require('multiparty');

const nodemailer = require('nodemailer');

router.get("/", function(req, res) {
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
    res.render("admin-skills", {skills: skills.get()});
});

router.get("/admin-blog", function(req, res) {
    res.render("admin-blog");
});

router.get("/admin-works", function(req, res) {
    res.render("admin-works");
});

router.post("/updateskills", jsonParser, function (request, response) {
    if(!request.body) return response.sendStatus(400);
    // console.log(request.body);
    skills.add(request.body);
    response.json({status: "ok"});
});

router.post("/newblogpost", jsonParser, function (request, response) {
    if(!request.body) return response.sendStatus(400);
    console.log(request.body);
    blogposts.add(request.body);
    // console.log(request);
    // response.json(`${request.body.userName} - ${request.body.userAge}`);
    response.json({status: "ok"});
});

router.post("/mail", jsonParser, function (request, response) {
    if(!request.body) return response.sendStatus(400);
    console.log(request.body);
    // console.log(request);
    // response.json(`${request.body.userName} - ${request.body.userAge}`);

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

    // при поступлении файла
    /*form.on('part', function(part) {
        console.log(part);

        //читаем его размер в байтах
        uploadFile.size = part.byteCount;
        //читаем его тип
        uploadFile.type = part.headers['content-type'];
        //путь для сохранения файла
        uploadFile.path = './dist/img/userpics/' + part.filename;

        //проверяем размер файла, он не должен быть больше максимального размера
        if(uploadFile.size > maxSize) {
            errors.push('File size is ' + uploadFile.size + '. Limit is' + (maxSize / 1024 / 1024) + 'MB.');
        }

        //проверяем является ли тип поддерживаемым
        if(supportMimeTypes.indexOf(uploadFile.type) == -1) {
            errors.push('Unsupported mimetype ' + uploadFile.type);
        }

        //если нет ошибок то создаем поток для записи файла
        if(errors.length == 0) {
            var out = fs.createWriteStream(uploadFile.path);
            part.pipe(out);
        }
        else {
            //пропускаем
            //вообще здесь нужно как-то остановить загрузку и перейти к onclose
            part.resume();
        }
    });*/

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


// console.log(skills);
module.exports = router;