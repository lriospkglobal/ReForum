const _ = require('lodash');
const asyncEach = require('async/each');
const shortid = require('shortid');
const axios = require('axios');
// controllers
const getAllOpinions = require('../opinion/controller').getAllOpinions;

// models
const User = require('./model');
const Discussion = require('../discussion/model');
const Opinion = require('../opinion/model');

/**
 * get user doc by user id
 * @param  {ObjectId} user_id
 * @return {promise}
 */
const getUser = (user_id) => {
  return new Promise((resolve, reject) => {
    User.findOne({ _id: user_id }, (error, user) => {
      if (error) { console.log(error); reject(error); }
      else if (!user) reject(null);
      else resolve(user);
    });
  });
};

/**
 * sign in/up user via github provided info
 * this will signin the user if user existed
 * or will create a new user using git infos
 * @param  {Object} gitProfile    profile information provided by github
 * @return {promise}              user doc
 */

const signInViaGithub = (username) => {
  return new Promise((resolve, reject) => {
    // find if user exist on db
    User.findOne({ username }, (error, user) => {
      if (error) { console.log(error); reject(error); }
      else {



        // user existed on db
        if (user) {
          resolve(user);

        }

        // user doesn't exists on db
        else {
          
          // check if it is the first user (adam/eve) :-p
          // assign him/her as the admin
          User.count({}, (err, count) => {
            console.log('usercount: ' + count);

            let assignAdmin = false;
            if (count === 0) assignAdmin = true;
            axios.get('https://randomuser.me/api/').then(res => {

              // create a new user
              const newUser = new User({
                name: username,
                username: username,
                avatarUrl: res.data.results[0].picture.large,
                email: username,
                role: assignAdmin ? 'admin' : 'user',
                github: {
                  id: shortid.generate(),
                  url: '',
                  company: 'AARP',
                  location: '',
                  hireable: true,
                  bio: '',
                  followers: 1,
                  following: 1,
                },
              });

              // save the user and resolve the user doc
              newUser.save((error) => {
                if (error) { console.log(error); reject(error); }
                else {

                  resolve(newUser);
                }
              });
            }).catch(err => reject(err))


          });
        }
      }
    });

  });
};


/**
 * get the full profile of a user
 * @param  {String} username
 * @return {Promise}
 */
const getFullProfile = (username) => {

  return new Promise((resolve, reject) => {
    User
      .findOne({ username })
      .lean()
      .exec((error, result) => {
        if (error) { console.log(error); reject(error); }
        else if (!result) reject('not_found');
        else {
          // we got the user, now we need all discussions by the user
          Discussion
            .find({ user_id: result._id })
            .populate('forum')
            .lean()
            .exec((error, discussions) => {
              if (error) { console.log(error); reject(error); }
              else {
                // we got the discussions by the user
                // we need to add opinion count to each discussion
                asyncEach(discussions, (eachDiscussion, callback) => {
                  getAllOpinions(eachDiscussion._id).then(
                    (opinions) => {
                      // add opinion count to discussion doc
                      eachDiscussion.opinion_count = opinions ? opinions.length : 0;
                      callback();
                    },
                    (error) => { console.error(error); callback(error); }
                  );
                }, (error) => {
                  if (error) { console.log(error); reject(error); }
                  else {
                    result.discussions = discussions;
                    resolve(result);
                  }
                });
              }
            });
        }
      });
  });
};

module.exports = {
  signInViaGithub,
  getUser,
  getFullProfile,
};
