import React, { Component } from 'react';



class Profile extends Component {
  render() {
    const {
      name,
      gitHandler,
      location,
      avatarUrl,
    } = this.props;

    return (
      <div >
        <div >
          <img  src={avatarUrl} alt={`${name} avatar`} />
        </div>
        <div >
          <div >{ name }</div>
          <div ><i ></i> { gitHandler }</div>
          <div >{ location }</div>
        </div>
      </div>
    );
  }
}

Profile.defaultProps = {
  name: 'Hello World',
  gitHandler: 'helloWorld',
  location: 'Somewhere in the world',
  avatarUrl: 'https://google.com',
};

/* Profile.propTypes = {
  name: React.PropTypes.string,
  gitHandler: React.PropTypes.string,
  location: React.PropTypes.string,
  avatarUrl: React.PropTypes.string,
}; */

export default Profile;
