const express = require('express');
const router = express.Router();

// on importe la logique des routes
const saucesCtrl = require("../controllers/sauce");
// on appelle le middleware authentification qui protège les routes
const auth = require("../middleware/auth");
// on appelle multer pour l'ajout d'image
const multer = require("../middleware/multer-config");
//-------------------------------------------

//Les différentes routes sauce

// intercepte les requetes get 
router.get("/", auth, saucesCtrl.getAllSauce);
// intercepte les requetes get
router.get("/:id", auth, saucesCtrl.getOneSauce);
// intercepte requete post de creation de sauce
router.post("/", auth, multer, saucesCtrl.createSauce);
// intercepte les requetes put (modification/mise à jour)
router.put("/:id", auth, multer, saucesCtrl.updateSauce);
// intercepte les requetes delete
router.delete("/:id", auth, saucesCtrl.deleteSauce);
// intercepte requete post de like et dislike
router.post("/:id/like", auth, saucesCtrl.likeDislikeSauce);
//----------------------------------------------------------

module.exports = router;