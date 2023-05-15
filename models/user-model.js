const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');// On appelle unique-validator pour éviter les doublons dans la base de données

const userSchema = mongoose.Schema({//  On définit le schéma d'utilisateur
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

userSchema.plugin(uniqueValidator, { message: '{PATH} doit être unique.' }); //Garantir que l'e-mail de l'utilisateur est unique. Si un e-mail en double est détecté, le plugin renvoie une erreur.

module.exports = mongoose.model('User', userSchema);