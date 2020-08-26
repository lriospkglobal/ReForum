import React, { Component } from 'react';

import moment from 'moment';
import { Image } from 'react-bootstrap';

import Button from '../../../Components/Button';
import RichEditor from '../../../Components/RichEditor';

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
      <div className="opinion d-flex">
        <div className="opinion__image-container">
          <Image src={userAvatar} fluid roundedCircle/>


          {allowDelete && <Button noUppercase onClick={() => { deleteAction(opinionId); }}>
            <i ></i>
            <span>Delete</span>
          </Button>}
          {/* <Button noUppercase>Quote</Button> */}
        </div>

        <div className="opinion__comment-container">
          <RichEditor
            readOnly
            value={opContent}
          />
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
