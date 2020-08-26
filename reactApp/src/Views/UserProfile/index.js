import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';




// components used in this view
import Profile from '../../Components/UserProfile/Profile';
import FeedBox from '../../Components/FeedBox';

// actions
import {
  fetchUserProfile,
} from './actions';

class UserProfile extends Component {
  componentDidMount() {
    const { fetchUserProfile } = this.props;
    const { username } = this.props.params;
    fetchUserProfile(username);
  }

  componentWillReceiveProps(newProps) {
    // fetch profile if different username
    const { username: oldUsername } = this.props.params;
    const { username: futureUsername } = newProps.params;

    // only update if different usernames
    if (oldUsername !== futureUsername) {
      const { fetchUserProfile } = this.props;
      fetchUserProfile(futureUsername);
    }
  }

  render() {
    const {
      fetchingProfile,
      profile,
      error,
    } = this.props;

    if (error) {
      return <div >{ error }</div>;
    }

    const {
      name,
      username,
      avatarUrl,
      github,
      discussions,
    } = profile;

    if (fetchingProfile) {
      return (
        <div >
          Loading users profile ...
        </div>
      );
    }

    return (
      <div >
        <Helmet><title>{`${name || username} | ReForum`}</title></Helmet>

        <div >
          <Profile
            name={name}
            gitHandler={username}
            location={github.location}
            avatarUrl={avatarUrl}
          />

          <FeedBox
            userProfile
            type='general'
            discussions={discussions}
          />
        </div>
      </div>
    );
  }
}

export default connect(
  (state) => { return {
    fetchingProfile: state.userProfile.fetchingProfile,
    profile: state.userProfile.profile,
    error: state.userProfile.error,
  }; },
  (dispatch) => { return {
    fetchUserProfile: (userSlug) => { dispatch(fetchUserProfile(userSlug)); },
  }; }
)(UserProfile);
