/**
 * module dependencies for passport configuration
 */
const passport = require('passport');
const passportCustom = require('passport-custom');
const CustomStrategy = passportCustom.Strategy;

// controllers
const getUser = require('./entities/user/controller').getUser;
const signInViaGithub = require('./entities/user/controller').signInViaGithub;

/**
 * passport configuration
 */
const passportConfig = (app) => {
  passport.serializeUser((user, done) => {
    console.log('serealize')
    done(null, user._id);
  });

  passport.deserializeUser((id, done) => {
    console.log('deserealize')
    getUser(id).then(
      (user) => { done(null, user); },
      (error) => { done(error); }
    );
  });

  passport.use('custom', new CustomStrategy(
    function (req, done) {      
      signInViaGithub(req.query.user).then(
        (user) => {           
          req.user = user;
          done(null, user); },
        (error) => { console.log('something error occurs'); done(error); }
      );
    }
  ));


};

module.exports = passportConfig;
