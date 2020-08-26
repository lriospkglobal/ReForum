import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';

import Header from '../Containers/Header';
import Footer from '../Components/Footer';
import './style/style.scss';
import { Container } from 'react-bootstrap';


import { getForums, updateCurrentForum, getUser } from './actions';

class AppContainer extends Component {
  componentDidMount() {
    const {
      params,
      updateCurrentForum,
      getForums,
      getUser,
    } = this.props;

    // get all forum list
    getForums();

    // check for authenticated user
    getUser();

    // set current forum based on route
    const currentForum = params.forum || '';
    updateCurrentForum(currentForum);
  }

  componentDidUpdate() {
    const {
      forums,
      params,
      currentForum,
      updateCurrentForum,
    } = this.props;

    let newCurrentForum = '';
    if (params.forum) newCurrentForum = params.forum;
    else if (forums && forums.length) newCurrentForum = forums[0].forum_slug;

    // update current forum if necessery
    if (newCurrentForum !== currentForum) updateCurrentForum(newCurrentForum);
  }

  render() {
    const { forums } = this.props;

    // render only if we get the forum lists
    if (forums) {
      return (
        <div>
          <Helmet ><title>Mosaic Forum</title></Helmet>


          <Header />
          <main>
            {this.props.children}
          </main>

          <Footer />
        </div>
      );
    }

    return (
      <Container >
        <div className="spinner-border" role="status">
          <span className="sr-only">Loading...</span>
        </div>
      </Container>
    );
  }
}

export default connect(
  (state) => {
    return {
      forums: state.app.forums,
      currentForum: state.app.currentForum,
    };
  },
  (dispatch) => {
    return {
      getForums: () => { dispatch(getForums()); },
      updateCurrentForum: (currentForum) => { dispatch(updateCurrentForum(currentForum)); },
      getUser: () => { dispatch(getUser()); },
    };
  }
)(AppContainer);
