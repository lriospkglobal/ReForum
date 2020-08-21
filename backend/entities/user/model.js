/**
 * user model
 */
const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  name: String,
  username: String,
  avatarUrl: String,
  email: String,
  role: { type: String, default: 'user' }, // ['admin', 'moderator', 'user']
  github: {
    id: String,
    url: String,
    company: String,
    location: String,
    bio: String,
    hireable: Boolean,
    followers: Number,
    following: Number,
  },
});

module.exports = mongoose.model('user', userSchema);
