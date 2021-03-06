import React, { Component } from 'react';
import { connect } from 'react-redux';

import { Table, Container, Image, Button, Tab, Tabs, Alert } from 'react-bootstrap';
import axios from 'axios';

import { getForums } from '../../App/actions'
import {
  getAdminDashboardInfo,
  createForum,
  deleteForum,
  updateForum
} from './actions';
import Counts from '../../Components/Dashboard/Counts';
import ForumBox from '../../Components/Dashboard/ForumBox';
import TextEdit from '../../Components/TextEdit/index';



class Dashboard extends Component {
  constructor(props) {
    super(props)
    this.state = {
      forums: [],
      key: 'new'
    }
  }
  componentDidMount() {
    // get information needed for dashboard
    this.props.getAdminDashboardInfo();
  }

  componentDidUpdate(prevProps) {
    const {

      forums,
    } = this.props.adminInfo.info;
    if (prevProps.adminInfo && forums) {
      if (prevProps.adminInfo.info.forums.length !== forums.length) {
        this.setState({ forums })
      }
    }




  }

  archive(forumId, index, forums, e) {
    const archive = e.target.checked
    forums[index].loading = true
    this.setState({ forums }, () => axios.post('/api/admin/archive?forumId=' + forumId + '&archived=' + archive, { withCredentials: true }).then(
      res => {
        forums[index].loading = false
        forums[index].archived = res.data
        this.setState({
          forums
        })
      }
    ).catch(err => console.error(err)))

  }
  changeForumAttribute = (value, attr, id) => {
    this.props.updateForum(id, { [attr]: value })

  }

  render() {
    const {
      discussionCount,
      opinionCount,
      forumCount,
      userCount,

    } = this.props.adminInfo.info;

    const {

      forums,
      key
    } = this.state;
    const {
      loadingInfo,
      creatingForum,
      creatingForumError,
      deletingForum,
      deletingForumError,
      role
    } = this.props;

    const forumsArray = forums ? forums.map((forum) => {
      return { id: forum._id, name: forum.forum_name, slug: forum.forum_slug };
    }) : [];

    return (
      <Container className="admin-dashboard mb-4 pb-4">
        <div >

          <Tabs defaultActiveKey="new"
            activeKey={key}
            onSelect={(key) => this.setState({ key })}
          >
            <Tab eventKey="new" title="New Mosaic">
              <section className="admin-dashboard__forum-box pt-4">
                <ForumBox
                  forums={forumsArray}
                  deletingForum={deletingForum}
                  deleteAction={(forumId) => { this.props.deleteForum(forumId); }}
                  creatingForum={creatingForum}
                  createAction={(forumObj, cb) => { this.props.createForum(forumObj, cb); }}
                />

                {creatingForumError &&
                  <Alert variant={'danger'}>
                    {creatingForumError}
                  </Alert>
                }
                {deletingForumError &&
                  <Alert variant={'success'}>
                    {deletingForumError}
                  </Alert>
                }
              </section>
            </Tab>
            <Tab eventKey="dashboard" title="Dashboard">
              <section className="admin-dashboard_table-dashboard pt-2">

                <section className="my-4">
                  <strong className="text-uppercase">Directions:</strong> Edit (double click on text, enter to save or esc to exit), or archive a community photo mosaic below.
</section>
                {(key === 'dashboard' && forums && forums.length > 0) &&
                  <Table bordered>
                    <thead>
                      <tr>
                        <th>Photo</th>
                        <th>Title</th>
                        <th>Mosaic Overview</th>
                        <th>Mentor</th>
                        <th>Mentor Bio</th>
                        <th>Archive</th>
                        <th>Edit / Review</th>
                      </tr>
                    </thead>
                    <tbody>

                      {forums.map((forum, index, forums) => (
                        <tr key={forum._id}>
                          <td><Image fluid src={'data:image/jpeg;base64,' + forum.base64} /></td>
                          <td>
                            <p>{forum.forum_name ?

                              < TextEdit text={forum.forum_name} id={forum._id} attr={'forum_name'} role={role} callback={this.changeForumAttribute} styleClass="" />
                              : ''}

                            </p>
                          </td>
                          <td>
                            <p>{forum.forum_description ?

                              < TextEdit text={forum.forum_description} id={forum._id} attr={'forum_description'} role={role} callback={this.changeForumAttribute} styleClass="" />
                              : ''}

                            </p>
                          </td>
                          <td>
                            <p>{forum.mentor_name ?

                              < TextEdit text={forum.mentor_name} id={forum._id} attr={'mentor_name'} role={role} callback={this.changeForumAttribute} styleClass="" />
                              : ''}</p>
                          </td>
                          <td>
                            <p>
                              {forum.mentor_biography ?

                                < TextEdit text={forum.mentor_biography} id={forum._id} attr={'mentor_biography'} role={role} callback={this.changeForumAttribute} styleClass="" />
                                : ''}
                            </p>
                          </td>
                          <td className="text-center">

                            <input type="checkbox" disabled={forum.loading} checked={forum.archived} onChange={this.archive.bind(this, forum._id, index, forums)} />
                          </td>
                          <td>
                            <a className={'btn btn-dark ' + (forum.archived && 'disabled')} target="_blank" href={`/${forum.forum_slug}`}><strong>Open</strong></a>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>}
                {!loadingInfo && forums && !forums.length && <p>No mosaics yet</p>}
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
      role: state.user.role,
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
      updateForum: (id, toUpdate, cb) => dispatch(updateForum(id, toUpdate, cb))
    };
  }
)(Dashboard);
