const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const app = express();
const  serveIndex = require('serve-index')

// Constants
const PORT = 3000;
const HOST = '0.0.0.0';

app.use('/static', express.static(path.join(__dirname, 'public')))

app.use('/uploadedfiles', express.static(path.join(__dirname, 'uploads')), serveIndex('uploads', {'icons': true}))

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname +'/views' +'/index.html'));
});

var storage = multer.diskStorage({
    destination: function (req, file, callback) {
        var dir = './uploads';
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir);
        }
        callback(null, dir);
    },
    filename: function (req, file, callback) {
        callback(null, file.originalname);
    }
});
const upload = multer({ storage: storage }).array('files', 12);

app.post('/upload', function (req, res, next) {
    upload(req, res, function (err) {
        if (err) {
            return res.err('Upload Failed');
        }
        res.json({'status':true,'msg':'Upload Success'});
    });
})

app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);
