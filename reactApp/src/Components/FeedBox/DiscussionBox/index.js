import React, { useState } from 'react';
import { Card, Button, Image, Modal } from 'react-bootstrap';
import Moment from 'moment';
import SingleDiscussion from '../../../Views/SingleDiscussion';
import thumbsUp from './../../../App/img/thumbsup-icon.svg';

function DiscussionBox(props) {

  const [lgShow, setLgShow] = useState(false);

  const user = props.discussion.user

  const discussionTitle = props.discussion.title
  const discussionContent = props.discussion.content
  const pinnedDiscussion = props.discussion.pinned
  const time = props.discussion.date
  const id = props.idKey

  const voteCount = props.discussion.favorites.length


  const { discussion, discussionType } = props;

  const postTime = Moment(time);
  const timeDisplay = postTime.from(Moment());

  return (
    <Card key={id} className="discussion-box mb-3">
      <Card.Body>
        <section className="discussion-box__header d-flex mb-3">
          <Image src={user.avatarUrl} roundedCircle />
          <div className="d-flex flex-column justify-content-center">
            <span>{user.name || user.username} {pinnedDiscussion ? <span className="rectangle">Featured</span> : null}</span>
            <span className="text-muted">{user.role === 'admin' ? 'MODERATOR' : 'USER'} - {timeDisplay}</span>
          </div>
        </section>

        <Image className="discussion-box__image" src={'data:image/jpeg;base64,' + discussion.base64} fluid />
        <Card.Text>
          {discussionContent.text}
        </Card.Text>

        <p>{discussionTitle}</p>


        <div className="d-flex discussion-box__footer align-items-center justify-content-between">
          <div ><button className="misc-button p-2"><img src={thumbsUp} /></button> <span className="ml-2">{voteCount} Kudos</span></div>
          <Button onClick={() => setLgShow(true)}>Comment</Button>
        </div>
      </Card.Body>
      <Modal

        size="xl"
        show={lgShow}
        onHide={() => setLgShow(false)}
        aria-labelledby="example-modal-sizes-title-lg"
      >

        <Modal.Body className="p-0 d-flex">
          <div className="w-75 modal-image" style={{ backgroundImage: 'url(' + 'data:image/jpeg;base64,' + discussion.base64 + ')' }}>

          </div>
          <div className="w-25 p-3">
            <section className="discussion-box__header d-flex mb-3">


              <Image src={user.avatarUrl} roundedCircle />
              <div className="d-flex flex-column justify-content-center">
                <span>{user.name || user.username} </span>
                <span className="text-muted">{timeDisplay}</span>
              </div>
            </section>
            <SingleDiscussion discussionSlug={discussion.discussion_slug} />
          </div>
        </Modal.Body>
      </Modal>

    </Card>

  );
}


DiscussionBox.defaultProps = {
  discussionId: 1,
  voteCount: 20,
  user: {},
  userGitHandler: 'github',
  discussionTitle: 'This is a default post title',
  time: Moment(),
  opinionCount: 12,
  tags: ['react', 'redux', 'nodejs'],
  link: '',
  userProfile: false,
};

/* DiscussionBox.propTypes = {
  discussionId: React.PropTypes.number,
  voteCount: React.PropTypes.number,
  userName: React.PropTypes.string,
  userGitHandler: React.PropTypes.string,
  discussionTitle: React.PropTypes.string,
  time: React.PropTypes.any,
  opinionCount: React.PropTypes.number,
  tags: React.PropTypes.array,
  link: React.PropTypes.string,
  userProfile: React.PropTypes.bool,
}; */

export default DiscussionBox;
