import multer from 'multer';
import path from 'path';

// Configuración de almacenamiento para multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../../assets/portadas'));
  },
  filename: function (req, file, cb) {
    // Nombre único: fecha + original
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, 'portada-' + uniqueSuffix + ext);
  }
});

const upload = multer({ storage });

export default upload;
