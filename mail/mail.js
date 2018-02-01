const mail = (function () {
    const nodemailer = require('nodemailer');
    const name = "testsend18";
    const email = "testsend18@gmail.com";
    const pass = "dkfjs7wj";

    transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: email,
            pass: pass
        }
    });

    function sendMail(title, message) {
        options = {
            from: name + " <" + email + ">",
            to: email,
            subject: title,
            html: message
        };

        transporter.sendMail(options, function(err, info) {
            if (err) {
                console.log(err);
                return err;
            }
            return console.log("Сообщение отправлено: " + info.response);
        });
    }

    return {
        sendMail: sendMail
    }

})();

module.exports = mail;