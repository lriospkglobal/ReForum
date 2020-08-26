// controllers
const getAdminDashInfo = require('./controller').getAdminDashInfo;
const createForum = require('./controller').createForum;
const deleteForum = require('./controller').deleteForum;
const deleteUser = require('./controller').deleteUser;
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
        .then((obj) =>
          createForum({
            forum_name: title, forum_slug: slug, original_img_id: obj.id, base64: base64encodeBuffer(req.file.buffer), admin: {
              name: req.user.name, avatarUrl: req.user.avatarUrl
            }
          })
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
