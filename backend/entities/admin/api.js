// controllers
const getAdminDashInfo = require('./controller').getAdminDashInfo;
const createForum = require('./controller').createForum;
const deleteForum = require('./controller').deleteForum;
const deleteUser = require('./controller').deleteUser;
const archiveForum = require('./controller').archiveForum;
const deleteDiscussion = require('./controller').deleteDiscussion;
const { gridFsSave, base64encodeBuffer } = require('../helpers')
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
    else res.send({ error: 'You are not an admin' });
  });

  // archive a foroum
  app.post('/api/admin/archive', (req, res) => {
    if (!req.query.forumId || !req.query.archived) return res.send({ error: 'Missing params' })

    if (req.user && req.user.role === 'admin') {
      archiveForum(req.query.forumId, req.query.archived).then(doc => res.send(doc.archived)).catch(err => res.send(err))
    }
    else res.send({ error: 'You are not an admin' });
  });

  // create a forum
  app.post('/api/admin/create_forum', upload.single('mosaicImage'), (req, res) => {

    if (req.user && req.user.role === 'admin') {
      const {
        title,
        slug,
        newForumDescription,
        newForumDirections,
        mentorName,
        mentorBiography,
        uploadedBase64mentorImage,


      } = req.body;




      gridFsSave('reforum', 'mosaicImages', req.file.buffer, req.file.fieldname + Date.now() + '.jpg', client)
        .then((obj) =>
          createForum({
            forum_name: title, forum_slug: slug, original_img_id: obj.id, base64: base64encodeBuffer(req.file.buffer), admin: {
              name: req.user.name, avatarUrl: req.user.avatarUrl,
            },
            forum_description: newForumDescription,
            forum_directions: newForumDirections,
            mentor_name: mentorName,
            mentor_biography: mentorBiography,
            mentor_base64: uploadedBase64mentorImage
          })
        ).then(data => res.send(data)).catch(obj => res.status(500).json(obj));

    }
    else return res.send({ error: 'You are not an admin' });
  });

  // delete a forum
  app.post('/api/admin/delete_forum', (req, res) => {
    if (req.user && req.user.role === 'admin') {
      deleteForum(req.body).then(
        (data) => { res.send(data); },
        (error) => { res.send(error); }
      );
    }
    else res.send({ error: 'You are not an admin' });
  });

  // delete an user
  app.post('/api/admin/delete_user', (req, res) => {
    if (req.user && req.user.role === 'admin') {
      deleteUser(req.body).then(
        (data) => { res.send(data); },
        (error) => { res.send(error); }
      );
    }
    else res.send({ error: 'You are not an admin' });
  });

  // delete a discussion
  app.post('/api/admin/delete_discussion', (req, res) => {
    if (req.user && req.user.role === 'admin') {
      deleteDiscussion(req.body).then(
        (data) => { res.send(data); },
        (error) => { res.send(error); }
      );
    }
    else res.send({ error: 'You are not an admin' });
  });
};

module.exports = adminAPI;
