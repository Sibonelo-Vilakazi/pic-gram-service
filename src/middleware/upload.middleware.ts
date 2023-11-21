
import * as multer from 'multer';
const imageStore = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, 'uploads')
    },
    filename:(req, file, callback) =>{
        const extension = file.originalname.substring(file.originalname.lastIndexOf('.')+ 1);
        callback(null, Date.now() + '.' + extension);
    }
});


export const upload = multer({storage: imageStore})