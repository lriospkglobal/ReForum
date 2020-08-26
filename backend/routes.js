/**
 * module dependencies for routes configuration
 */
const path = require('path');
const express = require('express');

const userAPI = require('./entities/user/api');
const forumAPI = require('./entities/forum/api');
const discussionAPI = require('./entities/discussion/api');
const opinionAPI = require('./entities/opinion/api');
const adminAPI = require('./entities/admin/api');

/**
 * routes configurations
 */
const routesConfig = (app, client) => {

  // serve api endpoint
  app.get('/api', (req, res) => {
    res.send('Hello from API endpoint');
  });

  // apply user apis
  userAPI(app);

  // apply forum apis
  forumAPI(app, client);

  // apply discussion apis
  discussionAPI(app, client);

  // apply opinion apis
  opinionAPI(app);

  // apply admin apis
  adminAPI(app, client);

  app.use(express.static(path.join(__dirname, '../reactApp/build')));


  app.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname, '../reactApp/build', 'index.html'));
  });

};

module.exports = routesConfig;
