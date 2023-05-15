// On se connecte à MongoDB
const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://lordzeng:Madiop1957@cluster0.r2gbqli.mongodb.net/?retryWrites=true&w=majority',
  { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));