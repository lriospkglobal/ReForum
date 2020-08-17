// modules for server
const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const MongoClient = require('mongodb').MongoClient;

// server configurations
const serverConfigs = require('./config/serverConfig');

// connect to database
mongoose.connect(serverConfigs.DBURL);

// initialize express
const app = express();

// apply express configs
MongoClient.connect(serverConfigs.DBURL, function (err, client) {
  if (err) throw err;
  require('./backend/express')(app, serverConfigs, client);
});

// fire up the server
app.listen(process.env.PORT || 5000, (error) => {
  if (error) throw error;
  console.log('Server running on port: ' + process.env.PORT || 5000);
});
