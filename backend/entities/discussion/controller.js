const generateDiscussionSlug = require('../../utilities/tools').generateDiscussionSlug;
const getAllOpinions = require('../opinion/controller').getAllOpinions;
const getUser = require('../user/controller').getUser;
const { gridFsSave } = require('../helpers');
const Discussion = require('./model');
const Forum = require('../forum/model')
const Opinion = require('../opinion/model');
const axios = require('axios');

/**
 * get a single discussion
 * @param  {String} discussion_slug
 * @param  {String} discussion_id
 * @return {Promise}
 */
const getDiscussion = (discussion_slug, discussion_id) => {
  return new Promise((resolve, reject) => {
    let findObject = {};
    if (discussion_slug) findObject.discussion_slug = discussion_slug;
    if (discussion_id) findObject._id = discussion_id;

    Discussion
      .findOne(findObject)
      .populate('forum')
      .populate('user')
      .lean()
      .exec((error, result) => {
        if (error) { console.log(error); reject(error); }
        else if (!result) reject(null);
        else {
          // add opinions to the discussion object
          getAllOpinions(result._id).then(
            (opinions) => {
              result.opinions = opinions;              
              resolve(result);
            },
            (error) => { { console.log(error); reject(error); } }
          );
        }
      });
  });
};

/**
 * Create a new discussion
 * @param  {Object} discussion
 * @return {Promise}
 */
const createDiscussion = (discussion, client, file) => {
  return new Promise((resolve, reject) => {

    gridFsSave('reforum', discussion.forumId, file.buffer, file.fieldname + Date.now() + '.jpg', client)
      .then(obj => resolve(obj)).catch(err => reject(err))

  }).then(function (obj) {



    return new Promise((resolve, reject) => {
      const newDiscussion = new Discussion({
        forum_id: discussion.forumId,
        forum: discussion.forumId,
        user_id: discussion.userId,
        user: discussion.userId,
        discussion_slug: generateDiscussionSlug(discussion.title),
        date: new Date(),
        title: discussion.title,
        content: discussion.content,
        favorites: [],
        tags: discussion.tags,
        pinned: discussion.pinned,
        tile_id: obj.photoName,
        camera: discussion.camera,
        photo_location: discussion.photoLocation,
        rights: discussion.rights
      });

      newDiscussion.save((error) => {
        if (error) {
          console.log(error);
          reject(error);
        }

        resolve(newDiscussion);
      });

    });

  })

};

/**
 * toggle favorite status of discussion
 * @param  {ObjectId} discussion_id
 * @param  {ObjectId} user_id
 * @return {Promise}
 */
const toggleFavorite = (discussion_id, user_id) => {
  return new Promise((resolve, reject) => {
    Discussion.findById(discussion_id, (error, discussion) => {
      if (error) { console.log(error); reject(error); }
      else if (!discussion) reject(null);
      else {
        // add or remove favorite
        let matched = null;
        for (let i = 0; i < discussion.favorites.length; i++) {
          if (String(discussion.favorites[i]) === String(user_id)) {
            matched = i;
          }
        }

        if (matched === null) {
          discussion.favorites.push(user_id);
        } else {
          discussion.favorites = [
            ...discussion.favorites.slice(0, matched),
            ...discussion.favorites.slice(matched + 1, discussion.favorites.length),
          ];
        }

        discussion.save((error, updatedDiscussion) => {
          if (error) { console.log(error); reject(error); }
          resolve(updatedDiscussion);
        });
      }
    });
  });

};

const updateDiscussion = (forum_id, discussion_slug) => {
  // TODO: implement update feature
};

const deleteDiscussion = (discussion_slug, forumName, client, email) => {
  return new Promise((resolve, reject) => {
    // find the discussion id first
    //TODO: use one Discussion query 
    let buildNewMosaic = true;
    Discussion
      .findOne({ discussion_slug })
      .exec((error, discussion) => {
        if (error) { console.log(error); reject(error); }

        // get the discussion and forum id
        const discussion_id = discussion._id;
        const forum_id = discussion.forum_id;
        Discussion
          .find({ discussion_slug })
          .exec((error, discussions) => {
            if (error) {

              return reject(error);
            }

            /* if (discussions.length === 1) {
              buildNewMosaic = false;
              //delete bucket and mosaic if no discussions
              //TODO: fix this nested mess
              const db = client.db('reforum');
              db.collection(forum_id + ".files").drop(function (err, ok) {
                if (err) return reject(err);
                if (ok) {
                  db.collection(forum_id + ".chunks").drop(function (err, ok) {
                    if (err) return reject(err);
                    if (ok) {
                      Forum.findOneAndUpdate({ _id: forum_id }, { mosaic: null }, { upsert: true }, function (err, doc) {
                        if (err) return reject(err);
                        removeOpinions(discussion_id, discussion_slug, forum_id)
                      });

                    }

                  });

                }

              });
            } else { */
              removeOpinions(discussion_id, discussion_slug, forum_id)
            //}
          })

        function removeOpinions(discussion_id, discussion_slug, forum_id) {
          // remove any opinion regarding the discussion
          Opinion
            .remove({ discussion_id })
            .exec((error) => {
              if (error) { console.log(error); reject(error); }

              // remove the discussion
              else {
                Discussion
                  .remove({ discussion_slug })
                  .exec((error) => {
                    if (error) { console.log(error); reject(error); }
                    else {
                      /* if (buildNewMosaic) {
                        axios.post('http://localhost:5500/api-mosaic/build-mosaic?forumId=' + forum_id + '&tileSize=3&enlargement=1&quality=100&email=' + encodeURIComponent(email))
                          .then(message => console.log(message))
                      } */


                      resolve({ deleted: true });
                    }
                  });
              }
            });
        }

      });
  });
};

module.exports = {
  getDiscussion,
  createDiscussion,
  updateDiscussion,
  deleteDiscussion,
  toggleFavorite,
};
