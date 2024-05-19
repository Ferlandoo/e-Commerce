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

function fileFilter(request, file, callback) {
  const filetypes = /jpe?g|png|webp/;
  const mimetypes = /image\/jpe?g|image\/png|image\/webp/;

  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = mimetypes.test(file.mimetype);

  if (extname && mimetype) {
    callback(null, true);
  } else {
    callback(new Error('Images only!'), false);
  }
}

const upload = multer({ storage, fileFilter });
const uploadSingleImage = upload.single('image');

router.post('/', (request, response) => {
  uploadSingleImage(request, response, function (error) {
    if (error) {
      response.status(400).send({ message: error.message });
    }

    response.status(200).send({
      message: 'Image uploaded successfully',
      image: `/${request.file.path}`,
    });
  });
});

export default router;
