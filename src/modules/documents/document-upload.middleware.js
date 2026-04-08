import fs from 'fs';
import path from 'path';
import multer from 'multer';
import AppError from '../../core/errors/app-error.js';

const uploadDir = path.resolve('uploads/documents');
const maxDocumentSize = 5 * 1024 * 1024;

fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (request, file, callback) => {
    callback(null, uploadDir);
  },
  filename: (request, file, callback) => {
    const safeName = file.originalname.replace(/[^a-zA-Z0-9._-]/g, '_');
    const uniqueName = `${Date.now()}-${Math.round(
      Math.random() * 1e9
    )}-${safeName}`;
    callback(null, uniqueName);
  },
});

const fileFilter = (request, file, callback) => {
  if (file.mimetype !== 'application/pdf') {
    return callback(new AppError('Only PDF files are allowed', 400));
  }

  return callback(null, true);
};

const uploader = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: maxDocumentSize,
  },
}).single('document');

const uploadDocumentMiddleware = (request, response, next) => {
  uploader(request, response, (error) => {
    if (!error) {
      return next();
    }

    if (error instanceof AppError) {
      return next(error);
    }

    if (
      error instanceof multer.MulterError &&
      error.code === 'LIMIT_FILE_SIZE'
    ) {
      return next(
        new AppError('File size must be less than or equal to 5 MB', 400)
      );
    }

    return next(new AppError('Failed to upload document', 400));
  });
};

export default uploadDocumentMiddleware;
