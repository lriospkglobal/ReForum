// forum controllers
const getAllForums = require('./controller').getAllForums;
const getDiscussions = require('./controller').getDiscussions;
const { getImageFromGridFs, base64encode } = require('../helpers');
const fs = require('fs');
/**
 * forum apis
 */
const forumAPI = (app, client) => {
  // get forum mosaic tile
  app.get('/api/forum/tile', (req, res) => {
    getImageFromGridFs({ filename: req.query.tileFileName }, 'reforum', req.query.forumId, client, req.query.forumId).then(img => {
      const base64 = base64encode(img.savedFsFilename)
      fs.unlinkSync(img.savedFsFilename)

      return res.send({ base64 })

    }).catch(err => res.send(err))
  });

  //get past mosaics from forum
  app.get('/api/forum/:forum_id/past-mosaics', (req, res) => {
    const db = client.db('reforum');
    db.collection('previous' + req.params.forum_id + '.files').find({}).toArray(function (err, result) {
      if (err) throw err;
      if (result.length) {
        const allPromises = []
        result.forEach((object) => {

          allPromises.push(
            getImageFromGridFs({ filename: object.filename }, 'reforum', 'previous' + req.params.forum_id, client, req.params.forum_id)
          )


        });
        Promise.all(allPromises).then(values => {

          /* Add base64 mosaic */
          values.forEach((value, index) => {

            result[index]['base64'] = base64encode(value.savedFsFilename)
            fs.unlinkSync(value.savedFsFilename)

          })

          return res.send(result);
        });
      } else res.send([]);


    })

  })
  // get all forums
  app.get('/api/forum', (req, res) => {
    getAllForums().then(
      (result) => {
        const allPromises = []
        result.forEach((forum) => {
          if (forum.mosaic) {
            allPromises.push(
              getImageFromGridFs({ filename: forum.mosaic.filename }, 'reforum', 'mosaics', client, forum._id)
            )
          }

        });
        Promise.all(allPromises).then(values => {

          /* Add base64 mosaic */
          values.forEach(value => {
            for (let i = 0; i < result.length; i++) {

              if (result[i]._id === value.forumId) {
                result[i]['mosaic']['base64'] = base64encode(value.savedFsFilename)
                fs.unlinkSync(value.savedFsFilename)
                break;
              }
            }



          })

          return res.send(result);
        });


      },
      (error) => { res.send(error); }
    );
  });

  // get discussions of a forum
  app.get('/api/forum/:forum_id/discussions', (req, res) => {
    getDiscussions(client, req.params.forum_id, false, req.query.sorting_method).then(
      (result) => { res.send(result); },
      (error) => { res.send([]); }
    );
  });

  // get pinned discussions of a forum
  app.get('/api/forum/:forum_id/pinned_discussions', (req, res) => {
    getDiscussions(client, req.params.forum_id, true).then(
      (result) => { res.send(result); },
      (error) => { res.send([]); }
    );
  });
};

module.exports = forumAPI;
