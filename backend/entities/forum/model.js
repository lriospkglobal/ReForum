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
  admin: Object,
  forum_description: String,
  forum_directions: String,
  mentor_name: String,
  mentor_biography: String,
  mentor_base64: String,
  archived: Boolean


});

module.exports = mongoose.model('forum', forumSchema);
