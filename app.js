const express = require('express');
const mongoose = require('mongoose'); // On importe mongoose pour interagir avec la base de données MongoDB
const path = require('path');// Path pour gérer les chemins d'accès aux fichiers du projet
require('dotenv').config();// dotenv est utilisé pour charger les variables d'environnement à partir du fichier .env
const cors = require('cors');//cors est utilisé pour permettre les requêtes Cross-Origin Resource Sharing (CORS)
const helmet = require('helmet'); //helmet est utilisé pour sécuriser l'application en configurant divers en-têtes HTTP 

const userRoutes = require('./routes/user');
const sauceRoutes = require('./routes/sauce');// On appelle nos deux routes user et sauce
// On établit la connexion à la base de données MongoDB
mongoose.connect('mongodb+srv://lordzeng:Madiop1957@cluster0.r2gbqli.mongodb.net/?retryWrites=true&w=majority',
  { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

const app = express(); // On stock le module express dans la variable app .
//Cela permet d'utiliser les fonctionnalités d'Express pour créer des routes et gérer les requêtes HTTP.

app.use(helmet({//On appmique helmet à l'app
  crossOriginResourcePolicy: false,// Pour pouvoir afficher les images sur le site 
})); 
app.use(cors()); // Sécurise en tête http


app.use((_req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*'); // Accepte des requêtes de toutes origines
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');// Les requêtes acceptées
  next();
});


app.use(express.json());//On  définit le format des données 
app.use('/images', express.static(path.join(__dirname, 'images'))); //On définit la route pour accéder aux fichiers statiques d'images.
app.use('/api/sauces', sauceRoutes); // les routes sauce et user
app.use('/api/auth', userRoutes);

module.exports = app;// On exporte l'application