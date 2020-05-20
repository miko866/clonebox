import multer from 'multer';
import fs from 'fs';
import { ErrorHandler } from '../../middlewares/ErrorMiddleware';

// Set max image size to 50MB
const MAX_SIZE = 1024 * 1024 * 50;

// Set upload path and file name
const storage = multer.diskStorage({
  destination(req, file, cb) {
    // Temp dir
    const dir = `${process.cwd()}/src/temp/avatar/`;
    // Check if folder exist if not creat one
    if (!fs.existsSync(dir)) {
      try {
        fs.mkdirSync(dir, { recursive: true });
      } catch (error) {
        throw new ErrorHandler(500, `Error from AvatarMulterMiddleware create temp dir: ${error}`);
      }
    }

    cb(null, './src/temp/avatar');
  },

  filename(req, file, cb) {
    const userId = req.headers.userid;
    const organizationHash = req.headers.organizationhash;
    const fileOriginalName = file.originalname;

    // Remove all spaces
    const newFileOriginalName = fileOriginalName.replace(/\s+/g, '');

    const avatarTempName = `${userId}_${organizationHash}_${newFileOriginalName}`;

    // Save avatar temp name
    cb(null, avatarTempName);
  },
});

// Check file type
const fileFilter = (req, file, cb) => {
  // Reject a file
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/jpg' || file.mimetype === 'image/png') {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

// Set multer for file upload, rename and save
const upload = multer({ storage, limits: { fileSize: MAX_SIZE }, fileFilter });

export { upload };
