import React, { Component } from 'react';
import { connect } from 'react-redux';

// components for AdminHeader
import UserMenu from '../../Components/Header/UserMenu';
import Logo from '../../Components/Header/Logo';
import NavigationBar from '../../Components/Header/NavigationBar';


class AdminHeader extends Component {
  renderNavLinks() {
    return [
      { name: 'Dashboard', link: '/admin' },
    ];
  }

  render() {
    const {
      authenticated,
      name,
      username,
      avatarUrl,
    } = this.props.user;

    return (
      <div >
        <div >
          <Logo />
          Welcome Admin
          <UserMenu
            signedIn={authenticated}
            userName={name || username}
            gitHandler={username}
            avatar={avatarUrl}
          />
        </div>
        <NavigationBar
          navigationLinks={this.renderNavLinks()}
        />
      </div>
    );
  }
}

export default connect(
  (state) => { return {
    user: state.user,
    forums: state.app.forums,
  }; }
)(AdminHeader);
