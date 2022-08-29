import express from 'express';
import FilesUploadController from '../controllers/uploading';
import {multerUpload} from '../utils/multer'

const Router = express.Router();
const FilesUploadRoutes = new FilesUploadController();


Router.post("/upload_profile_img", multerUpload.single("profile_img"),FilesUploadRoutes.uploadClientProfileImg);

export default Router;