/**
 * forum model
 */
const mongoose = require('mongoose');

const forumSchema = mongoose.Schema({
  forum_slug: String,
  forum_name: String,
  original_img_id: String,
  mosaic_img_id: String,
  mosaic: Object,
  coordinates: Array,
  base64: String,
  admin: Object

  
});

module.exports = mongoose.model('forum', forumSchema);
