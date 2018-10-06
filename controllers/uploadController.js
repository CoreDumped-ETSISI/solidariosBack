const sharp = require("sharp");
const crypto = require("crypto");
const dotenv =  require("dotenv").config();

const formats = process.env.ALLOWED_FILES;

let profileImg = async (req, res) => {
    let file = req.file;
    if(!file) return res.status(400).json({error: true, message: "File missing"});
    if(file.size > 2000000) return res.status(413).json({error: true, message: "File too big"});

    let fileName = crypto.randomBytes(20).toString('hex');
    let image = sharp(file.buffer);
    let metadata = await image.metadata();

    if (formats.indexOf(metadata.format) == -1) return res.status(400).json({error: true, message: "Image format not supported"})

    let process = await image.jpeg({
        quality: 75,
        chromaSubsampling: '4:4:4'
    }).toFile("../public/uploads" + fileName + ".jpeg");
    if(!process) return res.status(500).json({error: true, message: "Error while processing the image"})
    res.status(201).json({error: false});
}

module.exports = {
    profileImg
}
