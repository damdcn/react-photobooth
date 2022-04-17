const express = require("express");
const fs = require('fs');
const multer = require("multer");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
        const ext = file.originalname.split('.').pop();
        cb(null, `image-${Date.now()}.${ext}`)
    }
})
const upload = multer({ storage: storage })

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const cors = (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*')
    if (req.method === "OPTIONS") {
        res.setHeader('Access-Control-Allow-Headers', 'Accept, Content-Type')
    }
}

app.post("/upload_base64", upload.single('imageb'), (req, res) => {
    cors(req, res)

    const base64Data = req.body.imageb.replace(/^data:image\/jpeg;base64,/, "");
    const fileName = `image-${Date.now()}.png`

    fs.writeFile(`uploads/${fileName}`, base64Data, 'base64', function(err) {
        console.log(err);
    });

    res.json({
        filename: fileName
    });
});

app.post("/upload_image", upload.single('image'), (req, res) => {
    res.end();
});

app.get("/image/:filename", (req, res) => {
    cors(req, res);

    const fileName = req.params.filename;

    res.sendFile(`${__dirname}/uploads/${fileName}`);
});

app.listen(5000, () => {
    console.log(`Server started...`);
});