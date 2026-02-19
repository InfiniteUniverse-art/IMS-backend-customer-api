import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Configuration for local storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = 'uploads/profiles';
        // Create directory if it doesn't exist
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        // Example: 170832456123-avatar.png
        const uniqueName = `${Date.now()}-${file.originalname}`;
        cb(null, uniqueName);
    }
});

// File filter to ensure only images are uploaded
const fileFilter = (req: any, file: any, cb: any) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type. Only JPEG, PNG and JPG are allowed.'), false);
    }
};

export const upload = multer({ 
    storage, 
    fileFilter,
    limits: { fileSize: 2 * 1024 * 1024 } // 2MB Limit
});