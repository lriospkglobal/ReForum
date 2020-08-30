import React, { Component } from 'react';

import moment from 'moment';
import { Image, Button } from 'react-bootstrap';




class Opinion extends Component {
  render() {
    const {
      opinionId,
      userAvatar,

      opDate,
      opContent,
      userId,
      currentUserId,
      currentUserRole,
      deleteAction,
      deletingOpinion,
    } = this.props;



    const allowDelete = (userId === currentUserId) || (currentUserRole === 'admin');

    return (
      <div className="opinion d-flex align-items-start mb-4">
        <div className="opinion__image-container">
          <Image src={userAvatar} fluid roundedCircle />




        </div>

        <div className="opinion__comment-container p-2">
          {allowDelete &&
            <i onClick={() => { deleteAction(opinionId); }} className="delete fa fa-minus-circle" aria-hidden="true"></i>
          }
          {opContent}
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
