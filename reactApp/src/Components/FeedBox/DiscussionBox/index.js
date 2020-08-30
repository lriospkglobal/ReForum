import React, { useState } from 'react';
import { Card, Button, Image, Modal, Container, Col, Row } from 'react-bootstrap';
import Moment from 'moment';
import SingleDiscussion from '../../../Views/SingleDiscussion';
import thumbsUp from './../../../App/img/thumbsup-icon.svg';

function DiscussionBox(props) {


  const user = props.discussion.user

  const discussionTitle = props.discussion.title
  const discussionContent = props.discussion.content
  const pinnedDiscussion = props.discussion.pinned
  const time = props.discussion.date
  const camera = props.discussion.camera
  const location = props.discussion.photo_location
  const voteCount = props.discussion.favorites.length


  const { discussion, id, setDiscussion, setLgShow } = props;

  const postTime = Moment(time);
  const timeDisplay = postTime.from(Moment());

  return (
    <Card key={id} className="discussion-box mb-3">
      <Card.Body>
        <section className="discussion-box__header d-flex mb-3">
          <Image src={user.avatarUrl} roundedCircle />
          <div className="d-flex flex-column justify-content-center">
            <span>{user.name || user.username} {pinnedDiscussion && <span className="rectangle">Featured</span>}</span>
            <span className="text-muted">{user.role === 'admin' ? 'MODERATOR' : 'USER'} - {timeDisplay}</span>
          </div>
        </section>

        <Image className="discussion-box__image" src={'data:image/jpeg;base64,' + discussion.base64} fluid />
        <Card.Text>
          {discussionContent.text}
        </Card.Text>

        <p className="mb-2">{discussionTitle}</p>
        <Container>

          <Row>
            <Col className="pl-0">
              <p><strong>CAMERA: </strong> {camera}</p>
            </Col>
            <Col className="pr-0">
              <p><strong>LOCATION: </strong> {location}</p>
            </Col>
          </Row>

        </Container>


        <div className="d-flex discussion-box__footer align-items-center justify-content-between">
          <div ><button className="misc-button p-2"><img src={thumbsUp} /></button> <span className="ml-2">{voteCount} Kudos</span></div>
          <Button onClick={() => {
            setLgShow(true)
            setDiscussion(discussion)
          }
          }>Comment</Button>
        </div>
      </Card.Body>


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
