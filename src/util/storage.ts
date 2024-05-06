import { diskStorage } from 'multer';
import { existsSync, mkdirSync } from 'fs';
import { join } from 'path';
import rootDir from './path';

// Ensure the 'images' directory exists, create it if it doesn't
const imageUploadDirectory = 'images';
if (!existsSync(imageUploadDirectory)) {
  mkdirSync(imageUploadDirectory);
}

const path = join(rootDir, 'images');

export const storage = diskStorage({
    destination: (req, file, callback) => {
      return callback(null, path); // Set the destination folder
    },
    filename: (req, file, callback) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        return callback(null, `${uniqueSuffix}-${file.originalname}`);
    },
  })

export const VALID_UPLOADS_MIME_TYPES = ['image/jpeg', 'image/png', 'image/jpg'];