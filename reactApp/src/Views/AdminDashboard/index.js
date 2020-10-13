import React, { Component } from 'react';
import { connect } from 'react-redux';

import { Table, Container, Image, Button, Tab, Tabs } from 'react-bootstrap';


import { getForums } from '../../App/actions'
import {
  getAdminDashboardInfo,
  createForum,
  deleteForum,
} from './actions';
import Counts from '../../Components/Dashboard/Counts';
import ForumBox from '../../Components/Dashboard/ForumBox';

class Dashboard extends Component {
  componentDidMount() {
    // get information needed for dashboard
    this.props.getAdminDashboardInfo();
  }

  render() {
    const {
      discussionCount,
      opinionCount,
      forumCount,
      userCount,
      forums,
    } = this.props.adminInfo.info;

    const {
      loadingInfo,
      creatingForum,
      creatingForumError,
      deletingForum,
      deletingForumError,
    } = this.props;

    const forumsArray = forums ? forums.map((forum) => {
      return { id: forum._id, name: forum.forum_name, slug: forum.forum_slug };
    }) : [];

    return (
      <Container className="admin-dashboard mb-4 pb-4">
        <div >

          <Tabs defaultActiveKey="new" >
            <Tab eventKey="new" title="New Mosaic">
              <section className="admin-dashboard__forum-box pt-4">
                <ForumBox
                  forums={forumsArray}
                  deletingForum={deletingForum}
                  deleteAction={(forumId) => { this.props.deleteForum(forumId); }}
                  creatingForum={creatingForum}
                  createAction={(forumObj, cb) => { this.props.createForum(forumObj, cb); }}
                />

                {creatingForumError && <div >{creatingForumError}</div>}
                {deletingForumError && <div >{deletingForumError}</div>}
              </section>
            </Tab>
            <Tab eventKey="dashboard" title="Dashboard">
              <section className="admin-dashboard_table-dashboard pt-2">

                <section className="my-4">
                  <strong className="text-uppercase">Directions:</strong> Edit, or archive a community photo mosaic below.
</section>

                <Table bordered>
                  <thead>
                    <tr>
                      <th>Photo</th>
                      <th>Mosaic Overview</th>
                      <th>Mentor</th>
                      <th>Mentor Bio</th>
                      <th>Archive</th>
                      <th>Edit / Review</th>
                    </tr>
                  </thead>
                  <tbody>

                    {forums && forums.map(forum => (
                      <tr key={forum._id}>
                        <td><Image fluid src={'data:image/jpeg;base64,' + forum.base64} /></td>
                        <td>
                          <p>{forum.forum_description ? forum.forum_description : ''}

                          </p>
                        </td>
                        <td>
                          <p>{forum.mentor_name ? forum.mentor_name : ''}</p>
                        </td>
                        <td>
                          <p>
                            {forum.mentor_biography ? forum.mentor_biography : ''}
                          </p>
                        </td>
                        <td className="text-center">
                          <input type="checkbox" />
                        </td>
                        <td>
                          <a className="btn-dark" href={`/${forum.forum_slug}`}><strong>Open</strong></a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
                {loadingInfo && <section className="py-3 d-flex justify-content-center">
                  <div className="spinner-grow" role="status">
                    <span className="sr-only">Loading...</span>
                  </div></section>}

              </section>
            </Tab>

          </Tabs>



        </div>
      </Container>
    );
  }
}

export default connect(
  (state) => {
    return {
      adminInfo: state.adminInfo,
      loadingInfo: state.adminInfo.loadingInfo,
      creatingForum: state.adminInfo.creatingForum,
      creatingForumError: state.adminInfo.creatingForumError,
      deletingForum: state.adminInfo.deletingForum,
      deletingForumError: state.adminInfo.deletingForumError,
    };
  },
  (dispatch) => {
    return {
      getAdminDashboardInfo: () => { dispatch(getAdminDashboardInfo()); },
      getForums: () => { dispatch(getForums()); },
      deleteForum: (forumId) => { dispatch(deleteForum(forumId)); },
      createForum: (forumObj, cb) => { dispatch(createForum(forumObj, cb)); },
    };
  }
)(Dashboard);
