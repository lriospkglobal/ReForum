// forum controllers
const getAllForums = require('./controller').getAllForums;
const getDiscussions = require('./controller').getDiscussions;
const mongodb = require('mongodb');
const { getImageFromGridFs, base64encode } = require('../helpers');
const fs = require('fs');
const Forum = require('./model');
/**
 * forum apis
 */
const forumAPI = (app, client) => {
  // get forum mosaic tile
  app.get('/api/forum/tile', (req, res) => {
    const db = client.db('reforum');
    const bucket = new mongodb.GridFSBucket(db, {
      chunkSizeBytes: 1024,
      bucketName: req.query.forumId
    });
    const readstream = bucket.createReadStream(req.query.tileFileName);
    readstream.on('data', (chunk) => {
      res.send(chunk.toString('base64'));
    })

    /* bucket.find({ filename: req.query.tileFileName }).toArray((err, files) => {
      if (err) return res.status(500).send(err)




      //bucket.openDownloadStreamByName(req.query.tileFileName).pipe(res)
    }) */


    /* getImageFromGridFs({ filename: req.query.tileFileName }, 'reforum', req.query.forumId, client, req.query.forumId).then(img => {
      //const base64 = base64encode(img.savedFsFilename)
      //fs.unlinkSync(img.savedFsFilename)

      return res.send({ img })

    }).catch(err => res.send(err)) */
  });

  //get past mosaics from forum
  app.get('/api/forum/:forum_id/past-mosaics', (req, res) => {

    Forum
      .findOne({ _id: req.params.forum_id }, { _id: 0, mosaic_progress_steps: 1 })
      .exec((error, result) => {
        if (error) return res.send([])
        const steps = result.mosaic_progress_steps

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

              return res.send(
                {
                  steps,
                  previousMosaics: result.filter(el => steps.includes(el.nTiles))
                }
              );
            });
          } else res.send({ steps, previousMosaics: [] });


        })
      });





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


  // update forum
  app.put('/api/forum/:forum_id/update', (req, res) => {
    Forum.findByIdAndUpdate({ _id: req.body.forum_id }, req.body.toUpdate).then(document => res.send(document)).catch(err => res.status(500).send(err))
  });
};

module.exports = forumAPI;
