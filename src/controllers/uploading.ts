import { Request, Response } from "express";
import {UploadMetadata} from 'firebase/storage'
import {ref, uploadBytes, listAll, deleteObject, getDownloadURL} from 'firebase/storage'
import firebaseStorage from '../services/firebase'

export default class FilesUploadController {
    uploadClientProfileImg = async (req: Request, res: Response) => {
        // the file will be upladed
        const file = req.file;
        const imgRef = ref(firebaseStorage, file?.originalname);
        const metaType = {contentType: file?.mimetype, name: file?.originalname} as UploadMetadata;
        await uploadBytes(imgRef, file?.buffer!, metaType)
        .then((snapshot) => {
            getDownloadURL(ref(firebaseStorage, file?.originalname))
            .then(url => res.send(url))
            .catch(err => console.log(err))
        })
        .catch(err => console.log(err.message))
    }
}