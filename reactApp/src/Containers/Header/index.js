import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Navbar } from 'react-bootstrap';
import Logo from '../../App/img/logo.png'



// components for Header
import UserMenu from '../../Components/Header/UserMenu';
import NavigationBar from '../../Components/Header/NavigationBar';


class Header extends Component {
  renderNavLinks() {
    const { forums } = this.props;

    if (forums) {
      return forums.map((forum) => {

        return {
          id: forum._id,
          name: forum.forum_name,
          link: `/${forum.forum_slug}`,
          slug: forum.forum_slug
        };
      });
    }

    return null;
  }

  render() {
    const {
      authenticated,
      name,
      username,
      avatarUrl,
    } = this.props.user;

    return (
      <header >
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

          <NavigationBar
            currentForum={this.props.currentForum} navigationLinks={this.renderNavLinks()}
          />
        </Navbar>
      </header>

    );
  }
}

export default connect(
  (state) => {
    return {
      currentForum: state.app.currentForum,
      user: state.user,
      forums: state.app.forums,
    };
  }
)(Header);
