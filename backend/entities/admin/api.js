// controllers
const getAdminDashInfo = require('./controller').getAdminDashInfo;
const createForum = require('./controller').createForum;
const deleteForum = require('./controller').deleteForum;
const deleteUser = require('./controller').deleteUser;
const deleteDiscussion = require('./controller').deleteDiscussion;
//TODO use gridFsSave from helpers
function gridFsSave(dbName, bucketName, buffer, photoName, client) {
  return new Promise((resolve, reject) => {

    const db = client.db(dbName);

    // Covert buffer to Readable Stream
    const readablePhotoStream = new Readable();
    readablePhotoStream.push(buffer);
    readablePhotoStream.push(null);

    let bucket = new mongodb.GridFSBucket(db, {
      bucketName
    });

    let uploadStream = bucket.openUploadStream(photoName);
    let id = uploadStream.id;
    readablePhotoStream.pipe(uploadStream);

    uploadStream.on('error', () => {

      return reject({ message: "Error uploading file" });
    });

    uploadStream.on('finish', () => {

      return resolve(id);

    });
  })
}
const multer = require('multer');
const { Readable } = require('stream');
const mongodb = require('mongodb');
const storage = multer.memoryStorage()
const upload = multer({ storage: storage });

const adminAPI = (app, client) => {
  // get all info for admin dashboard
  app.get('/api/admin/admin_dashboard_info', (req, res) => {
    if (req.user && req.user.role === 'admin') {
      getAdminDashInfo().then(
        (data) => { res.send(data); },
        (error) => { res.send(error); }
      );
    }
    else res.send({ error: 'You are not admin buddy 😛' });
  });

  // create a forum
  app.post('/api/admin/create_forum', upload.single('img'), (req, res) => {

    if (req.user && req.user.role === 'admin') {
      const {
        title,
        slug
      } = req.body;



      gridFsSave('reforum', 'mosaicImages', req.file.buffer, req.file.fieldname + Date.now() + '.jpg', client)
        .then((id) =>
          createForum({ forum_name: title, forum_slug: slug, original_img_id: id })
        ).then(data => res.send(data)

        ).catch(obj => res.status(500).json(obj));

    }
    else return res.send({ error: 'You are not admin buddy 😛' });
  });

  // delete a forum
  app.post('/api/admin/delete_forum', (req, res) => {
    if (req.user && req.user.role === 'admin') {
      deleteForum(req.body).then(
        (data) => { res.send(data); },
        (error) => { res.send(error); }
      );
    }
    else res.send({ error: 'You are not admin buddy 😛' });
  });

  // delete an user
  app.post('/api/admin/delete_user', (req, res) => {
    if (req.user && req.user.role === 'admin') {
      deleteUser(req.body).then(
        (data) => { res.send(data); },
        (error) => { res.send(error); }
      );
    }
    else res.send({ error: 'You are not admin buddy 😛' });
  });

  // delete a discussion
  app.post('/api/admin/delete_discussion', (req, res) => {
    if (req.user && req.user.role === 'admin') {
      deleteDiscussion(req.body).then(
        (data) => { res.send(data); },
        (error) => { res.send(error); }
      );
    }
    else res.send({ error: 'You are not admin buddy 😛' });
  });
};

module.exports = adminAPI;
