const multer = require('multer');
const path = require('path');

// Fungsi storage — tentukan folder dan nama file
const makeStorage = (folder) =>
  multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, `uploads/${folder}`);
    },
    filename: (req, file, cb) => {
      const ext = path.extname(file.originalname);
      const filename = `${folder}-${Date.now()}${ext}`;
      cb(null, filename);
    }
  });

// Filter — hanya izinkan gambar untuk foto profil
const imageFilter = (req, file, cb) => {
  const allowed = ['.jpg', '.jpeg', '.png', '.webp'];
  const ext = path.extname(file.originalname).toLowerCase();
  allowed.includes(ext)
    ? cb(null, true)
    : cb(new Error('Hanya file gambar yang diizinkan'), false);
};

// Filter — izinkan gambar dan PDF untuk bukti izin
const fileFilter = (req, file, cb) => {
  const allowed = ['.jpg', '.jpeg', '.png', '.pdf'];
  const ext = path.extname(file.originalname).toLowerCase();
  allowed.includes(ext)
    ? cb(null, true)
    : cb(new Error('Hanya file gambar atau PDF yang diizinkan'), false);
};

// Upload foto profil — max 2MB
const uploadProfile = multer({
  storage: makeStorage('profiles'),
  fileFilter: imageFilter,
  limits: { fileSize: 2 * 1024 * 1024 }
});

// Upload bukti izin — max 5MB
const uploadAttachment = multer({
  storage: makeStorage('attachments'),
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }
});

module.exports = { uploadProfile, uploadAttachment };
