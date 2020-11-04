import React, { Component } from 'react';
import moment from 'moment';
import RichEditor from '../../../Components/RichEditor';
import thumbsUp from './../../../App/img/thumbsup-icon.svg';
import flag from './../../../App/img/flag-icon.svg';
import { Form, Button, Dropdown, OverlayTrigger, Tooltip } from 'react-bootstrap';
class Discussion extends Component {
  render() {
    const {
      id,

      discTitle,
      discContent,
      favoriteCount,
      favoriteAction,
      userFavorited,
      toggleingFavorite,
      allowDelete,
      deletingDiscussion,
      deleteAction,
      userRole,
      camera,
      photoLocation,
      photoDate,
      photoTime

    } = this.props;






    return (
      <section className="single-discussion">




        <p>
          <strong >{discTitle}</strong><br />
          {discContent}
        </p>
        <div className="d-flex flex-column">
          <span><strong>CAMERA: </strong>{camera}</span>
          <span><strong>LOCATION: </strong>{photoLocation}</span>
          <span><strong>DATE: </strong>{moment(photoDate).format("MMM Do YY")}</span>
          <span><strong>TIME OF DAY: </strong>{photoTime}</span>
        </div>
        <div className="mt-3">
          {allowDelete &&

            <a href="" className="bold" onClick={(e) => {
              e.preventDefault()
              deleteAction()
            }}>Delete post</a>
          }
        </div>




        <div className="mt-3 mb-3 d-flex single-discussion__tools align-items-center justify-content-between">
          <div >
            <button onClick={() => { !toggleingFavorite && favoriteAction(id); }}
              className={userFavorited ? 'active misc-button p-2' : 'misc-button p-2'} >
              <img src={thumbsUp} />
            </button>
            <span className="ml-2">{favoriteCount} Kudos</span>
          </div>
          {(userRole === 'user') &&
            <OverlayTrigger placement={'top'}
              overlay={
                <Tooltip>
                  As a user you can report posts.
              </Tooltip>
              }>
              <div >
                <button
                  className={'misc-button p-2'} >
                  <img src={flag} />
                </button>
                <span className="ml-2">Report Content</span>
              </div>
            </OverlayTrigger>
          }

        </div>









        {deletingDiscussion && <div>
          Deleting Discussion...
        </div>}
      </section>
    );
  }
}

Discussion.defaultProps = {
  id: 0,
  userAvatar: null,
  userName: 'User name',
  userGitHandler: 'github',
  discTitle: 'Default Discussion Title',
  discDate: 'a day ago',
  discContent: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
  tags: ['react', 'redux', 'webkit'],
  favoriteCount: 1,
  favoriteAction: () => { },
  userFavorited: false,
  toggleingFavorite: false,
  allowDelete: false,
  deletingDiscussion: false,
  deleteAction: () => { },
};

/* Discussion.propTypes = {
  id: React.PropTypes.any,
  userAvatar: React.PropTypes.string,
  userName: React.PropTypes.string,
  userGitHandler: React.PropTypes.string,
  discTitle: React.PropTypes.string,
  discDate: React.PropTypes.any,
  discContent: React.PropTypes.any,
  tags: React.PropTypes.array,
  favoriteCount: React.PropTypes.number,
  favoriteAction: React.PropTypes.func,
  userFavorited: React.PropTypes.bool,
  toggleingFavorite: React.PropTypes.bool,
  allowDelete: React.PropTypes.bool,
  deletingDiscussion: React.PropTypes.bool,
  deleteAction: React.PropTypes.func,
}; */

export default Discussion;
