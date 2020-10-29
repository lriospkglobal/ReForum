import React, { useState, useEffect } from 'react';
import { OverlayTrigger, Tooltip, Card, Button, Image, Modal, Container, Col, Row } from 'react-bootstrap';
import Moment from 'moment';

import Opinion from '../../../Components/SingleDiscussion/Opinion';
import thumbsUp from './../../../App/img/thumbsup-icon.svg';
import eye from './../../../App/img/eye-icon.svg';
import pin from './../../../App/img/pin-icon.svg';
import flag from './../../../App/img/flag-icon.svg';
import { connect } from 'react-redux';
import mockImage from '../mock-img.jpg';
import axios from 'axios';
function DiscussionBox(props) {

  const user = props.discussion.user

  const discussionTitle = props.discussion.title
  const discussionContent = props.discussion.content
  const pinnedDiscussion = props.discussion.pinned
  const discussion_slug = props.discussion.discussion_slug
  const time = props.discussion.date
  const setPinned = props.discussion.setPinned
  const photoTime = props.discussion.photo_time
  const camera = props.discussion.camera ? props.discussion.camera : ''
  const location = props.discussion.photo_location ? props.discussion.photo_location : ''
  const voteCount = props.discussion.favorites.length


  const { openFromUrl, discussion, setDiscussion, setLgShow, role, mock, key, idKey, tileId } = props;


  const postTime = Moment(time);
  const timeDisplay = postTime.from(Moment());



  return (
    <Card key={key} className="discussion-box mb-3">
      <Card.Body>
        <section className="discussion-box__header d-flex mb-3 align-items-center justify-content-between">
          <div className="d-flex align-items-center h-100">
            <Image src={user.avatarUrl} fluid roundedCircle />
            <div className="d-flex flex-column justify-content-center">
              <span>{user.name || user.username} {pinnedDiscussion && <span className="rectangle">Featured</span>}
                {(!pinnedDiscussion && !mock) && (role && role === 'admin') &&
                  <OverlayTrigger
                    key={'top'}
                    placement={'top'}
                    overlay={
                      <Tooltip >
                        As an admin you can feature posts.
                </Tooltip>
                    }
                  >
                    <span className="rectangle gray">Set featured</span>
                  </OverlayTrigger>
                }
              </span>

              <span className="text-muted">{user.role} - {timeDisplay}</span>
            </div>
          </div>
          {mock && <strong className="pending-message">PENDING APPROVAL</strong>}
        </section>

        <Image className="discussion-box__image" src={discussion.base64 ? ('data:image/jpeg;base64,' + discussion.base64) : mockImage} fluid />



        <Container className="mt-4">
          <Row>
            <Col className="pl-0">
              <p>{discussionTitle}</p>
            </Col>
            <Col className="pr-0">
              <p><strong>Time of Day: </strong> {photoTime}</p>
            </Col>
          </Row>
          <Row>
            <Col className="pl-0">
              <p><strong>CAMERA: </strong> {camera}</p>
            </Col>
            <Col className="pr-0">
              <p><strong>LOCATION: </strong> {location}</p>
            </Col>
          </Row>




        </Container>
        <p>{discussionContent}</p>

        <div className="discussion-box__footer ">
          {!mock ? <div>
            <div className="d-flex align-items-center justify-content-between">
              <div>
                <button className="misc-button p-2">
                  <img src={thumbsUp} />
                </button>
                <span className="ml-2">{voteCount} Kudos</span>
              </div>

              {(role && role === 'admin') &&

                <OverlayTrigger
                  key={'top'}
                  placement={'top'}
                  overlay={
                    <Tooltip >
                      As an admin you can pin posts.
                  </Tooltip>
                  }
                >
                  <div>

                    <button className={(setPinned ? 'active ' : '') + 'misc-button p-2'}>
                      <img src={pin} />
                    </button>
                    <span className="ml-2">Pin</span>
                  </div>
                </OverlayTrigger>
              }

              {(role && role === 'user') &&

                <OverlayTrigger
                  key={'top'}
                  placement={'top'}
                  overlay={
                    <Tooltip >
                      As a user you can report posts.
  </Tooltip>
                  }
                >
                  <div>

                    <button className="misc-button p-2">
                      <img src={flag} />
                    </button>
                    <span className="ml-2">Report Content</span>
                  </div>
                </OverlayTrigger>
              }


              <div>
                <button onClick={() => openFromUrl(tileId)} className="misc-button p-2">
                  <img src={eye} />
                </button>
                <span className="ml-2">View in mosaic</span>
              </div>

              <Button onClick={() => {
                setLgShow(true)
                setDiscussion(discussion)
              }
              }>Comment</Button>
            </div>
            {(discussion.opinions && discussion.opinions.length) ?
              <div className="opinion-section">
                <h4 className="mt-4 mb-3"><strong>{discussion.opinions.length + 1} Comments</strong></h4>
                <Opinion
                  pinned={true}
                  key={'hkjhfd25432'}
                  opinionId={'hkjhfd25432'}
                  userAvatar={'https://randomuser.me/api/portraits/men/34.jpg'}
                  userName={'John Doe'}
                  userGitHandler={'John Doe'}
                  opDate={null}
                  opContent={'Wow! What a fabulous photo, great job!'}
                  userId={'hkjhfd25432'}



                />
                {discussion.opinions.length && discussion.opinions.map((opinion) => {
                  return (
                    <Opinion
                      key={opinion._id}
                      opinionId={opinion._id}
                      userAvatar={opinion.user.avatarUrl}
                      userName={opinion.user.name}
                      userGitHandler={opinion.user.username}
                      opDate={opinion.date}
                      opContent={opinion.content}
                      userId={opinion.user_id}



                    />
                  );
                })}
              </div> : null}
          </div> :
            <div >

              {(role && role === 'admin') &&

                <div className="d-flex align-items-center justify-content-between">
                  <OverlayTrigger

                    placement={'top'}
                    overlay={
                      <Tooltip >
                        As an admin you can reject posts.
                </Tooltip>
                    }
                  >
                    <Button >Reject</Button>
                  </OverlayTrigger>
                  <OverlayTrigger

                    placement={'top'}
                    overlay={
                      <Tooltip >
                        As an admin you can approve posts.
                </Tooltip>
                    }
                  >
                    <Button variant="dark">Approve</Button>
                  </OverlayTrigger>
                </div>
              }


            </div>
          }
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




export default connect(
  (state) => {
    return {
      role: state.user.role,

    };
  }
)(DiscussionBox);
