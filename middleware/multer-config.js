// middleware/multer-config.js
const multer = require('multer');

const MIME_TYPES = { //mapper les types MIME des images à leurs extensions de fichier correspondantes 
    "image/jpg": "jpg", //afin de pouvoir sauvegarder des images avec la bonne extension de fichier
    "image/jpeg": "jpg",
    "image/png": "png",
    "image/bmp": "bmp",
    "image/gif": "gif",
    "image/x-icon": "ico",
    "image/svg+xml": "svg",
    "image/tiff": "tif",
    "image/tif": "tif",
    "image/webp": "webp",
};
//On spécifie où les fichiers téléchargés doivent être enregistrés et comment les nommer.
const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, 'images');
  },
  filename: (req, file, callback) => {
    const name = file.originalname.split(' ').join('_');
    const extension = MIME_TYPES[file.mimetype];
    callback(null, name + Date.now() + '.' + extension);
  }
});
//On exporte l'objet Multer configuré pour télécharger un seul fichier à la fois en utilisant la méthode "single"
module.exports = multer({ storage: storage }).single('image');