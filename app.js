const express = require("express");
const bodyParser = require('body-parser');
const dotenv =  require("dotenv").config();
const passportConfig = require('./config/passport');
const multer = require("multer");
const jwt = require("jsonwebtoken")

const uploadController = require("./controllers/uploadController");

const app = express();
const upload = multer({ storage: multer.memoryStorage()});

app.set("port", process.env.PORT || 3000);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(passportConfig.passport.initialize());

app.post("/upload/image", passportConfig.isAuthenticated, upload.single("image"), uploadController.profileImg);
app.post("/renew", (req, res) => {
    res.send(jwt.sign({sub: "js"}, process.env.JWT_SECRET));
})

module.exports = app;
