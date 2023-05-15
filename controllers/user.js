const bcrypt = require('bcrypt');// Pour le chiffrement des mots de passe des utilisateurs 
const jwt = require('jsonwebtoken');//Pour générer des jetons d'authentification pour les utilisateurs connectés.
const User = require('../models/user-model');// Pour définir la structure de données pour les utilisateurs.

// Créer un utilisateur
exports.signup = (req, res, next) => {
  bcrypt.hash(req.body.password, 10)
    .then(hash => {
      const user = new User({ // on crée un new user avec email et pswrd hash
        email: req.body.email,
        password: hash
      });
      user.save() // On sauvegarde ensuite dans BD
        .then(() => res.status(201).json({ message: 'Utilisateur créé !' })) 
        .catch(error => res.status(400).json({ error }));
    })
    .catch(error => res.status(500).json({ error }));
};

// Connecter un utilisateur
exports.login = (req, res, next) => {
  User.findOne({ email: req.body.email })// On cherche l'utilisateur correspondant à l'adresse email fournie dans la base de données à l'aide de la méthode findOne().
    .then(user => {
      if (!user) {
        return res.status(401).json({ error: 'Utilisateur non trouvé !' });// Si user n'est pas trouvé
      }
      bcrypt.compare(req.body.password, user.password)// Si user trouvé on compare les psword
        .then(valid => {
          if (!valid) {
            return res.status(401).json({ error: 'Mot de passe incorrect !' });// Psword incorrect
          }
          const token = jwt.sign(
            { userId: user._id }, // Si psword ok on génére un jeton d'authentification qui contient l'identifiant de l'utilisateur et une clé secrète aléatoire. Le jeton d'authentification est ensuite renvoyé dans la réponse.
            'RANDOM_TOKEN_SECRET',
            { expiresIn: '24h' });
          res.status(200).json({
            userId: user._id,
            token: token
          });
        })
        .catch(error => res.status(500).json({ error })); // Si une erreur se produit lors de l'authentification
    })
    .catch(error => res.status(500).json({ error }));
};



