// middleware/auth.js
const jwt = require('jsonwebtoken');// On vérifie si le token d'authentification est valide et correspond à l'utilisateur qui fait la demande.

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1]; // On extrait le token d'authentification de l'en-tête d'autorisation
    const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');// On vérifie 
    const userId = decodedToken.userId;//On compare l'ID du token décodé à UserID
    if (req.body.userId && req.body.userId !== userId) { // Si les id correspndent pas une erreur est levée
      throw 'Invalid user ID';
    } else {
      next();
    }
  } catch {
    res.status(401).json({
      error: new Error('Invalid request!')
    });
  }
};
//Si tout est ok on passe à next pour une prochaine fonction middleware