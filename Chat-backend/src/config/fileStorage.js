const multer = require('multer');
const path = require('path');
const fs = require("fs");
const folderPath = path.resolve(__dirname, "../../uploads");
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        if (!fs.existsSync(folderPath))
            fs.mkdirSync(folderPath, { recursive: true })
        if (file)
            cb(null, "D:/Node Projects/Chat-backend/uploads")
    },
    filename: (req, file, cb) => {
        if (file)
            cb(null, `${Date.now()}-${file.originalname}`);
    }
})
module.exports = multer({ storage });