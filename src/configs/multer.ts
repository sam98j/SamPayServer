import multer from 'multer';

// multer memeory storage
const memoStorage = multer.memoryStorage();
// multer uplaod
export const multerUpload = multer({ storage: memoStorage });
