const User = require('./entities/user/model');
const shortid = require('shortid')
const createMentor = (client) => {
  User.findOne({ role: 'moderator' }, (err, mentor) => {
    if (err) console.error(err)
    if (!mentor) {

      const newUser = new User({
        name: 'moderator',
        username: 'moderator',
        avatarUrl: null,
        email: 'moderator@moderator.com',
        role: 'moderator',
        github: {
          id: shortid.generate(),
          url: '',
          company: 'AARP',
          location: '',
          hireable: true,
          bio: '',
          followers: 1,
          following: 1,
        },
      });

      // save the user and resolve the user doc
      newUser.save((error) => {
        if (error) { console.error(error); }
        else {
          console.log('Successfully created mentor')

        }
      })






    }
  })
}

module.exports = createMentor;