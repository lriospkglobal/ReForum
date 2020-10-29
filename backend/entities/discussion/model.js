/**
 * discussion model
 */
const mongoose = require('mongoose');

const discussionSchema = mongoose.Schema({
  forum_id: mongoose.Schema.ObjectId,
  forum: { type: mongoose.Schema.ObjectId, ref: 'forum' },
  discussion_slug: String,
  user_id: mongoose.Schema.ObjectId,
  user: { type: mongoose.Schema.ObjectId, ref: 'user' },
  date: Date,
  title: String,
  content: Object,
  favorites: Array,
  tags: Array,
  pinned: Boolean,
  tile_id: String,
  tile_base64: String,
  camera: String,
  photo_location: String,
  rights: Boolean,
  photo_date: Date,
  photo_time: String,
  setPinned: Boolean
});

module.exports = mongoose.model('discussion', discussionSchema);
