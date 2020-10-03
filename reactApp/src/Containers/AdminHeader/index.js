import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Navbar } from 'react-bootstrap';
// components for AdminHeader
import UserMenu from '../../Components/Header/UserMenu';
import Logo from '../../App/img/logo.png'
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
      <header className="admin-header">
        <Navbar className="flex-wrap" variant="dark">

          <div className="d-flex w-100 justify-content-between">
            <Navbar.Brand href="/">
              <img
                src={Logo}
                width="auto"
                height="40"

                alt="logo"
              />
            </Navbar.Brand>
            <UserMenu
              signedIn={authenticated}
              userName={name || username}
              gitHandler={username}
              avatar={avatarUrl}
            />
          </div>






          {/* <NavigationBar
            navigationLinks={this.renderNavLinks()}
          /> */}
        </Navbar>
      </header>

    );
  }
}

export default connect(
  (state) => {
    return {
      user: state.user,
      forums: state.app.forums,
    };
  }
)(AdminHeader);
