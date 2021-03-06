import React, { Component } from 'react';
import { Link, IndexLink } from 'react-router';

import _ from 'lodash';


class NavigationBar extends Component {
  render() {
    const {
      navigationLinks,
      currentForum
    } = this.props;

    if (navigationLinks) {

      return (
        <section className="w-100 navigation-bar">
          <ul className="d-flex justify-content-center">
            {navigationLinks.map(link => {
              if (link.id === 0) {
                return (
                  <li className={currentForum === link.slug ? 'active' : ''} key={_.uniqueId('navLink_')}>
                    <IndexLink


                      to='/'
                    >
                      Home
                  </IndexLink>
                  </li>
                );
              }

              return (
                <li className={currentForum === link.slug ? 'active' : ''} key={_.uniqueId('navLink_')}>
                  <Link


                    to={link.link}
                  >
                    {link.name}
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>

      );
    }

    return null;
  }
}

NavigationBar.defaultProps = {
  navigationLinks: [
    {
      id: 0,
      name: 'General',
      link: '/',
    },
  ],
};

/* NavigationBar.propTypes = {
  navigationLinks: React.PropTypes.array,
}; */

export default NavigationBar;
