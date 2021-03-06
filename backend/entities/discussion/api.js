// discussion controllers
const getDiscussion = require('./controller').getDiscussion;
const createDiscussion = require('./controller').createDiscussion;
const toggleFavorite = require('./controller').toggleFavorite;
const deleteDiscussion = require('./controller').deleteDiscussion;
const axios = require('axios');
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
/**
 * discussion apis
 */
const discussionAPI = (app, client) => {
  // get signle discussion
  app.get('/api/discussion/:discussion_slug', (req, res) => {
    const { discussion_slug } = req.params;
    getDiscussion(discussion_slug).then(
      (result) => { res.send(result); },
      (error) => { res.send(error); }
    );
  });


  // toggle favorite to the discussion
  app.put('/api/discussion/toggleFavorite/:discussion_id', (req, res) => {
    const { discussion_id } = req.params;
    if (req.user) {
      // TODO: describe the toggle process with comments
      toggleFavorite(discussion_id, req.user._id).then(
        (result) => {
          getDiscussion(result.discussion_slug).then(
            (result) => { res.send(result); },
            (error) => { res.send({ discussionUpdated: false }); }
          );
        },
        (error) => { res.send({ discussionUpdated: false }); }
      );
    } else {
      res.send({ discussionUpdated: false });
    }
  });

  //create new mosaic
  app.post('/api/discussion/newMosaic', (req, res) => {
    return new Promise((resolve, reject) => {
      //return axios.post('http://localhost:5500/api-mosaic/build-mosaic?forumName=' + 
      return axios.post('http://mosaic-python-api.herokuapp.com/api-mosaic/build-mosaic?forumName=' +
        req.body.forumName + '&tileId=' + req.body.tileId + '&forumId=' + req.body.forumId +
        '&tileSize=3&enlargement=1&quality=100&email=' + encodeURIComponent(req.body.user.email) +
        '&discussionTitle=' + encodeURIComponent(req.body.discussionTitle))
        .then(req => {
          resolve(res.send(req.data.message))
        }).catch(err => console.error(err))
    })
  })
  // create a new discussion
  app.post('/api/discussion/newDiscussion', upload.single('tile'), (req, res) => {
    let tileId
    if (req.user) {
      createDiscussion(req.body, client, req.file).then(
        (result) => {
          tileId = result._doc.tile_id
          res.send(Object.assign({}, result._doc, { postCreated: true }));

        }

      ).catch(error => {
        console.log(error)
        res.send({ postCreated: false });

      });
      res.on('finish', () => {
        //return axios.post('http://localhost:3000/api/discussion/newMosaic', { forumId: req.body.forumId, user: req.user, tileId, forumName: req.body.forumName, discussionTitle: req.body.title })
        return axios.post('https://mosaic-forum.herokuapp.com/api/discussion/newMosaic', { forumId: req.body.forumId, user: req.user, tileId, forumName: req.body.forumName, discussionTitle: req.body.title })
          .then(() => console.log('Success!')).catch(err => console.error(err))
      });

    } else {
      res.send({ postCreated: false });
    }
  });

  // delete a discussion
  app.delete('/api/discussion/deleteDiscussion/:discussion_slug', (req, res) => {
    if (req.user) {
      deleteDiscussion(req.params.discussion_slug, req.query.forumName, client, req.user.email).then(
        (result) => {

          res.send({ deleted: true });
        },
        (error) => { res.send({ deleted: false }); }
      );
    } else {
      res.send({ deleted: false });
    }

  });
};

module.exports = discussionAPI;
