import { ErrorHandler } from '../ErrorMiddleware';
import multer from 'multer';
import fs from 'fs';

// Set max image size to 50MB
const MAX_SIZE = 1024 * 1024 * 50;

// Set upload path and file name
const storage = multer.diskStorage({
  destination(req, file, cb) {
    const organizationHash = req.headers.organizationhash;

    // Directory for file in storage
    const fileDir = `./storage/organization/${organizationHash}/file/`;

    // Check if folder exist if not creat one
    if (!fs.existsSync(fileDir)) {
      try {
        fs.mkdirSync(fileDir, { recursive: true });
      } catch (error) {
        throw new ErrorHandler(500, `Error from Create file dir: ${error}`);
      }
    }
    cb(null, fileDir);
  },
  filename(req, file, cb) {
    const userId = req.headers.userid;
    const organizationId = req.headers.organizationid;
    const fileOriginalName = file.originalname;

    // Remove all spaces
    const newFileOriginalName = fileOriginalName.replace(/\s+/g, '');

    const fileName = `${userId}_${organizationId}_${newFileOriginalName}`;

    // Save avatar temp name
    cb(null, fileName);
  },
});

// Check file type
const fileFilter = (req, file, cb) => {
  const allowedMimeType = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-excel',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'text/plain',
    'application/pdf',
  ];

  // Reject a file
  for (let i = 0; i < allowedMimeType.length; i++) {
    if (file.mimetype === allowedMimeType[i]) {
      cb(null, true);
    } else {
      cb(null, false);
    }
  }
};

// Set multer for file upload, rename and save
const upload = multer({ storage, limits: { fileSize: MAX_SIZE }, fileFilter });

export { upload };
