import path from 'path';
import express from 'express';
import multer from 'multer';

const router = express.Router();

const storage = multer.diskStorage({
  destination(request, file, callback) {
    callback(null, 'uploads/');
  },
  filename(request, file, callback) {
    callback(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
  },
});

function checkFileType(file, callback) {
  const filetypes = /jpg|jpeg|png/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (extname && mimetype) {
    callback(null, true);
  }
  else {
    callback(null, false);
  }
}

const upload = multer({
  storage,
  fileFilter(request, file, callback) {
    checkFileType(file, callback);
  },
});

router.post('/', upload.single('image'), (request, response) => {
  response.send({
    message: 'Image uploaded',
    image: `/${request.file.path}`
  });
}, (response) => {
  response.status(400).send({ message: 'Images Only!' });
});

export default router;
