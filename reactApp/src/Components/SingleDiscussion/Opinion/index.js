import React, { Component } from 'react';

import moment from 'moment';
import { Image, Button, OverlayTrigger, Tooltip } from 'react-bootstrap';
import pin from './../../../App/img/pin-icon.svg';



class Opinion extends Component {
  render() {
    const {
      opinionId,
      userAvatar,
      pinned,
      opDate,
      opContent,
      userId,
      currentUserId,
      currentUserRole,
      deleteAction,
      deletingOpinion,
      allowDelete
    } = this.props;





    return (
      <div className="opinion d-flex align-items-start flex-column mb-4">
        <section className="d-flex align-items-center w-100">
          <div className="opinion__image-container">
            <Image src={userAvatar} fluid roundedCircle />




          </div>

          <div className="opinion__comment-container d-flex align-items-center px-3 py-2">
            {pinned && <Image className="pin-image" src={pin} fluid />}
            <p className="mb-0">{opContent}</p>
          </div>
        </section>
        <div className="opinion__options">
          <ul className="d-flex mb-0">
            <OverlayTrigger

              placement={'top'}
              overlay={
                <Tooltip>
                  As a user you can kudos this comment.
        </Tooltip>
              }
            >
              <li><span>Kudos</span></li>
            </OverlayTrigger>
            {(currentUserRole === 'user') &&
              <OverlayTrigger

                placement={'top'}
                overlay={
                  <Tooltip>
                    As a user you can report this comment.
        </Tooltip>
                }
              >
                <li><span>Report Content</span></li>
              </OverlayTrigger>

            }
            <OverlayTrigger

              placement={'top'}
              overlay={
                <Tooltip>
                  As a user you can reply to this comment.
</Tooltip>
              }
            >
              <li><span>Comment</span></li>
            </OverlayTrigger>

            {allowDelete &&
              <li><span onClick={() => { deleteAction(opinionId); }}>Delete</span></li>
            }

          </ul>
        </div>

        {(deletingOpinion === opinionId) && <div >Deleting Opinion ...</div>}
      </div>
    );
  }
}

Opinion.defaultProps = {
  opinionId: '12345',
  userAvatar: null,
  userName: 'User name',
  userGitHandler: 'github',
  opDate: 'a day ago',
  opContent: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
  userId: '12345',
  currentUserId: '12345',
  currentUserRole: 'user',
  deleteAction: () => { },
  deletingOpinion: null,
};

/* Opinion.propTypes = {
  opinionId: React.PropTypes.string,
  userAvatar: React.PropTypes.string,
  userName: React.PropTypes.string,
  userGitHandler: React.PropTypes.string,
  opDate: React.PropTypes.any,
  opContent: React.PropTypes.string,
  userId: React.PropTypes.string,
  currentUserId: React.PropTypes.string,
  currentUserRole: React.PropTypes.string,
  deleteAction: React.PropTypes.func,
  deletingOpinion: React.PropTypes.any,
}; */

export default Opinion;
