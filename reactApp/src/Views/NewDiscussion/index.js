import _ from 'lodash';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Form } from 'react-bootstrap';
import Dropzone from 'react-dropzone';

import RichEditor from '../../Components/RichEditor';
import PinButton from '../../Components/NewDiscussion/PinButton';
import TagsInput from '../../Components/NewDiscussion/TagsInput';

import {
  postDiscussion,
  updateDiscussionTitle,
  updateDiscussionTile,
  updateDiscussionContent,
  updateDiscussionPinStatus,
  updateDiscussionTags,
} from './actions';




class NewDiscussion extends Component {
  constructor(props) {
    super(props);

    this.state = {
      forumId: null,
      userId: null,
      fatalError: null,
      tileImage: null
    };
  }

  componentDidMount() {
    const {
      user,
      currentForum,
      forums,
      updateDiscussionTags
    } = this.props;
    updateDiscussionTags(['aarp'])
    this.setUserAndForumID(user, forums, currentForum);
  }

  componentWillReceiveProps(nextProps) {
    const {
      user,
      currentForum,
      forums,
    } = nextProps;

    this.setUserAndForumID(user, forums, currentForum);
  }

  setUserAndForumID(user, forums, currentForum) {
    const forumId = _.find(forums, { forum_slug: currentForum });
    if (forumId) {
      const currentForumId = forumId._id;
      this.setState({
        forumId: currentForumId,
        userId: user._id,
      });
    } else {
      this.setState({
        fatalError: 'Invalid forum buddy, go for the right one!',
      });
    }
  }


  renderEditor() {
    const {
      authenticated,
      role,
    } = this.props.user;

    const {
      updateDiscussionTitle,
      updateDiscussionTile,
      updateDiscussionContent,
      updateDiscussionPinStatus,
      updateDiscussionTags,
      postDiscussion,
      currentForum,
      successCallback
    } = this.props;

    const {
      title,
      content,
      tags,
      pinned,
      tile

    } = this.props.newDiscussion;

    const {
      forumId,
      userId,
    } = this.state;

    // only show the editor when user is authenticated
    if (authenticated) {
      return (
        <section className="d-flex new-discussion">
          <div className="new-discussion__dropzone-container d-flex justify-content-center align-items-center">
            <Dropzone accept="image/jpeg, image/png" onDrop={acceptedFiles => updateDiscussionTile(acceptedFiles[0])}>
              {({ getRootProps, getInputProps }) => (
                <section>
                  <div {...getRootProps()} >
                    <input name="tile" {...getInputProps()} />
                    <p>Drag 'n' drop some files here, or click to select files</p>
                  </div>
                </section>
              )}
            </Dropzone>
          </div>
          <Form className="new-discussion__form" onSubmit={(e) => { e.preventDefault() }}>
            <Form.Group controlId="exampleForm.ControlInput1">
              <Form.Label><strong>Discussion Title</strong></Form.Label>
              <Form.Control key={'title'}
                type="text"
                value={title}
                onChange={(event) => { updateDiscussionTitle(event.target.value); }} />
            </Form.Group>



            {(role === 'admin') && <Form.Group><PinButton
              key={'pinned'}
              value={pinned}
              onChange={(value) => { updateDiscussionPinStatus(value); }}
            />
            </Form.Group>}
            <Form.Group controlId="exampleForm.ControlSelect1">
              <Form.Label>Camera</Form.Label>
              <Form.Control as="select">
                <option>Sony A6100</option>
                <option>Olympus OM-D E-M5 Mark III</option>
                <option>Canon EOS Rebel SL3 / EOS 250D</option>
                <option>Fujifilm X100V</option>
                <option>Sony ZV-1</option>
              </Form.Control>
            </Form.Group>
            <Form.Group >
              <Form.Check type="checkbox" label="I am the owner of this photo. AARP may use this photo without permission or attribution. (Required)" />
            </Form.Group>
            <Form.Group>

              <Form.Label><strong>Description</strong></Form.Label>
              <Form.Text className="mb-2">
                Describe how your sharp photo connects to the Staying Sharp Pillar Ongoing Exercise?
  </Form.Text>
              <RichEditor
                key={'content'}
                type='newDiscussion'
                value={content}
                onChange={(value) => { updateDiscussionContent(value); }}
                onSave={() => { postDiscussion(userId, forumId, currentForum, successCallback); }}
              />
            </Form.Group>
          </Form>
        </section>
      )/* [
        <textarea
          
        />,
        ,
        <TagsInput
          key={'tags'}
          value={tags}
          onChange={(tags) => { updateDiscussionTags(tags); }}
        />,
        <RichEditor
          key={'content'}
          type='newDiscussion'
          value={content}
          onChange={(value) => { updateDiscussionContent(value); }}
          onSave={() => { postDiscussion(userId, forumId, currentForum); }}
        />,
        <div key={'tile'} >
          <div >Tile Image: </div>
          <input

            type={'file'}
            accept="image/jpeg"
            name="tile"
            onChange={(e) => { updateDiscussionTile(e.target.files[0]); }}
          />
        </div>
      ]; */
    }

    return (
      <div >
        Please sign in before posting a new discussion.
      </div>
    );
  }

  render() {
    const { fatalError } = this.state;

    if (fatalError) { return (<div >{fatalError}</div>); }

    const { currentForum } = this.props;
    const {
      errorMsg,
      postingSuccess,
      postingDiscussion,
    } = this.props.newDiscussion;

    return (
      <div >

        <div >{errorMsg}</div>
        {postingSuccess && <div >Your discussion is created :-)</div>}
        {this.renderEditor()}
        {postingDiscussion && <div >Posting discussion...</div>}
      </div>
    );
  }
}

export default connect(
  (state) => {
    return {
      user: state.user,
      forums: state.app.forums,
      currentForum: state.app.currentForum,
      newDiscussion: state.newDiscussion

    };
  },
  (dispatch) => {
    return {
      postDiscussion: (userId, forumId, currentForum, cb) => { dispatch(postDiscussion(userId, forumId, currentForum, cb)); },
      updateDiscussionTitle: (value) => {
        dispatch(updateDiscussionTitle(value));
      },
      updateDiscussionTile: (value) => {
        dispatch(updateDiscussionTile(value));
      },
      updateDiscussionContent: (value) => { dispatch(updateDiscussionContent(value)); },
      updateDiscussionPinStatus: (value) => { dispatch(updateDiscussionPinStatus(value)); },
      updateDiscussionTags: (value) => { dispatch(updateDiscussionTags(value)); },
    };
  }
)(NewDiscussion);
