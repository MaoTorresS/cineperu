
import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from '../utils/cloudinary';


const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'cineperu/portadas',
    format: async (_req: any, file: any) => {
      const ext = file.mimetype.split('/')[1];
      return ext === 'jpeg' ? 'jpg' : ext;
    },
    public_id: (_req: any, _file: any) => 'portada-' + Date.now(),
  } as any,
});

const upload = multer({ storage });

export default upload;
