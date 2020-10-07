const asyncEach = require('async/each');
const { getImageFromGridFs, base64encode } = require('../helpers');
const fs = require('fs');
// models
const Forum = require('./model');
const Discussion = require('../discussion/model');

// controllers
const getAllOpinions = require('../opinion/controller').getAllOpinions;
const getUser = require('../user/controller').getUser;

/**
 * get all forums list
 * @type {Promise}
 */
const getAllForums = () => {
  return new Promise((resolve, reject) => {
    Forum
      .find({})
      .exec((error, results) => {
        if (error) { console.log(error); reject(error); }
        else if (!results) reject(null);
        else resolve(results);
      });
  });
};

/**
 * get discussions of a forum
 * @param  {ObjectId} forum_id
 * @param  {Boolean} pinned
 * @return {Promise}
 */
const getDiscussions = (client, forum_id, pinned, sorting_method = 'date') => {
  return new Promise((resolve, reject) => {
    // define sorthing method
    const sortWith = {};
    if (sorting_method === 'date') sortWith.date = -1;
    if (sorting_method === 'popularity') sortWith.favorites = -1;

    // match discussion id 
    Discussion
      .find({ forum_id: forum_id })
      .sort(sortWith)
      .populate('forum')
      .populate('user')
      .lean()
      .exec((error, discussions) => {
        if (error) { console.error(error); reject(error); }
        else if (!discussions) reject(null);
        else {
          // attach opinion count to each discussion
          asyncEach(discussions, (eachDiscussion, callback) => {
            // add opinion count
            getAllOpinions(eachDiscussion._id).then(
              (opinions) => {
                // add opinion count to discussion doc
                eachDiscussion.opinion_count = opinions ? opinions.length : 0;
                eachDiscussion.opinions = opinions ? opinions : [];
                // get individual tile
                return new Promise((resolve, reject) => {

                  getImageFromGridFs({ filename: eachDiscussion.tile_id }, 'reforum', forum_id, client, forum_id).then(img => {
                    const base64 = base64encode(img.savedFsFilename);
                    fs.unlinkSync(img.savedFsFilename);
                    eachDiscussion.base64 = base64;
                    resolve();

                  }).catch(err => reject(err))
                })

              },
              (error) => { console.error(error); callback(error); }
            ).then(() => callback());
          }, (error) => {
            if (error) { console.error(error); reject(error); }
            else resolve(discussions);
          });
        }
      });
  });
};

module.exports = {
  getAllForums,
  getDiscussions,
};
