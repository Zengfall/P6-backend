const Sauce = require("../models/sauce-model");// On appelle le model sauce
const fs = require('fs');// Ce module permet de lire, écrire, renommer, supprimer des fichiers, ainsi que de créer et manipuler des répertoires.

exports.getAllSauce = (req, res, next) => {// est utilisée pour récupérer toutes les sauces enregistrées dans la base de données et les renvoyer dans une réponse.
  Sauce.find()
    .then((sauces) => res.status(200).json(sauces))// Si tout est ok
    .catch((error) => res.status(404).json({ error }));// Sinon
};

exports.getOneSauce = (req, res, next) => {// Une sauce
  Sauce.findOne({ _id: req.params.id })
    .then(sauce => res.status(200).json(sauce))
    .catch(error => res.status(404).json({ error }));
}
// Créer une nouvelle sauce
exports.createSauce = (req, res, next) => {
  const sauceObject = JSON.parse(req.body.sauce)
  delete sauceObject._id;// On supprime l'id car créé automatiquement dans la BD
  const sauce = new Sauce({ // On crée un nouvel object sauce
    ...sauceObject,// Avec ces valeurs
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
    likes: 0,
    dislikes: 0,
    usersLiked: [' '],
    usersdisLiked: [' '],
  });
  sauce
    .save()
    .then(() => res.status(201).json({ message: "Sauce enregistrée" })) //Si tout est ok
    .catch((error) => res.status(400).json({ error }));//Sinon
};

exports.updateSauce = (req, res, next) => { //Modifier une sauce
  const sauceObject = req.file ?
  {// On vérifie si un nouveau fichier image est envoyé dans la requête
    ...JSON.parse(req.body.sauce),// Si ok on analyse l'objet JSON   et //Mise à jour l'URL de l'image de la sauce avec l'URL de base de l'application et le nom de fichier de la nouvelle image.
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`} : { ...req.body }
// On update la sauce correspondante dans la base de données
  Sauce.updateOne({ _id : req.params.id}, {...sauceObject, _id: req.params.id})
  .then(res.status(200).json({ message : "Sauce modifiée"})) 
  .catch(error => res.status(400).json({ error }))
};
// Supprimer une sauce 
exports.deleteSauce = (req, res, next) => {
  Sauce.findOne({ _id : req.params.id })// On recherche la sauce
  .then(sauce => {
    const filename = sauce.imageUrl.split("/images/")[1] //On extrait le nom de fichier image
    fs.unlink(`images/${filename}`, () => { // On supprime le fichier
      Sauce.deleteOne({_id : req.params.id})// On supprime la sauce
  .then(res.status(200).json({ message: "Sauce supprimée" }))
  .catch(error => res.status(400).json({ error }))
  
    })
  })
  .catch(error => res.status(500).json({ error }))
};
// Like et dislike
exports.likeDislikeSauce = (req, res, next) => {
  let like = req.body.like
  let userId = req.body.userId 
  let sauceId = req.params.id
  
  switch (like) {
    case 1 : // J'aime 
    // On ajoute l'userid à la liste ayant aimé par push et on incrémente le nombre de likes en utilisant l'opérateur "$inc"
        Sauce.updateOne({ _id: sauceId }, { $push: { usersLiked: userId }, $inc: { likes: +1 }})
          .then(() => res.status(200).json({ message: `J'aime` }))
          .catch((error) => res.status(400).json({ error }))
            
      break;

    case 0 :// Neutre
        Sauce.findOne({ _id: sauceId }) // On cherhce la sauce
           .then((sauce) => {// Si user a aimé ou pas précédemment 
            if (sauce.usersLiked.includes(userId)) { //SI oui on supprime userid du tableau et on décrémente le nombre de likes en utilisant l'opérateur "$pull" et "$inc"
              Sauce.updateOne({ _id: sauceId }, { $pull: { usersLiked: userId }, $inc: { likes: -1 }})
                .then(() => res.status(200).json({ message: `Neutre` }))
                .catch((error) => res.status(400).json({ error }))
            }//Sinon on supprime l'userId du tableau "usersDisliked" et décrémenter le nombre de dislikes de la même manière.
            if (sauce.usersDisliked.includes(userId)) { 
              Sauce.updateOne({ _id: sauceId }, { $pull: { usersDisliked: userId }, $inc: { dislikes: -1 }})
                .then(() => res.status(200).json({ message: `Neutre` }))
                .catch((error) => res.status(400).json({ error }))
            }
          })
          .catch((error) => res.status(404).json({ error }))
      break;

    case -1 : // je n'aime pas
    //On ajoute l'identifiant de l'utilisateur dans le tableau "usersDisliked" de la sauce et incrémenter le nombre de dislikes en utilisant l'opérateur "$push" et "$inc".
        Sauce.updateOne({ _id: sauceId }, { $push: { usersDisliked: userId }, $inc: { dislikes: +1 }})
          .then(() => { res.status(200).json({ message: `Je n'aime pas` }) })
          .catch((error) => res.status(400).json({ error }))
      break;
      
      default:
        console.log(error);
  }
};