import multer from "multer";

const storage = multer.diskStorage({
    filename:function(req, file,callback){
        callback(null, file.originalname)
    }
})
const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Only image files are allowed'), false);
    }
};

const upload = multer({storage, fileFilter})

export default upload;