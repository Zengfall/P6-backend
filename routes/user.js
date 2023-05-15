const express = require('express');
const router = express.Router();// On crée un objet de type Router qui sera utilisé pour définir les routes.


const UserController = require('../controllers/user');//On importe le contrôleur utilisateur qui sera utilisé pour gérer les requêtes.

router.post('/signup', UserController.signup);// Route pour l'inscription d'un nouvel utilisateur
router.post('/login', UserController.login);//pour la connexion d'un utilisateur existant.

module.exports = router;