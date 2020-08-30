import _ from 'lodash';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Form, Button, Image } from 'react-bootstrap';
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
  updateCamera,
  updatePhotoLocation,
  updateRights
} from './actions';




class NewDiscussion extends Component {
  constructor(props) {
    super(props);

    this.state = {
      forumId: null,
      userId: null,
      fatalError: null,
      tileImage: null,
      uploadedImage: null,
      uploadedBase64: null
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

  encodeImage = () => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(this.state.uploadedImage);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });

  processImage = () => {
    this.encodeImage().then(base64 => {

      this.setState({ uploadedBase64: base64 }, () => this.props.updateDiscussionTile(this.state.uploadedImage))

    }).catch(err => console.error(err))
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
      updateCamera,
      updatePhotoLocation,
      updateRights,
      postDiscussion,
      currentForum,
      successCallback,
      closeModal
    } = this.props;

    const {
      title,
      content,
      tags,
      pinned,
      tile,
      camera,
      photoLocation,
      rights

    } = this.props.newDiscussion;

    const {
      forumId,
      userId,
    } = this.state;

    // only show the editor when user is authenticated
    if (authenticated) {

      return (
        <section className="d-flex new-discussion">
          <div className="new-discussion__dropzone-container d-flex">
            {this.state.uploadedBase64 ? <div className="new-discussion__uploaded-image-container" style={{ backgroundImage: 'url(' + this.state.uploadedBase64 + ')' }} ></div> :
              <Dropzone accept="image/jpeg, image/png"
                onDrop={acceptedFiles => {
                  this.setState({ uploadedImage: acceptedFiles[0] }, () =>
                    this.processImage()
                  )

                }
                }>
                {({ getRootProps, getInputProps }) => (
                  <section className="d-flex w-100 justify-content-center">
                    <div className="d-flex" {...getRootProps()} >
                      <input name="tile" {...getInputProps()} />
                      <p className="p-3 justify-content-center align-items-center w-100 d-flex">Drag 'n' drop some files here, or click to select files</p>
                    </div>
                  </section>
                )}
              </Dropzone>}


          </div>
          <Form className="new-discussion__form p-3" onSubmit={(e) => { e.preventDefault() }}>
            <Form.Group controlId="exampleForm.ControlInput1">
              <Form.Label><strong>Discussion Title</strong></Form.Label>
              <Form.Control key={'title'}
                type="text"
                value={title}
                onChange={(event) => { updateDiscussionTitle(event.target.value); }} />
            </Form.Group>



            {(role === 'admin') && <Form.Group className="small">
              <Form.Check checked={pinned} onChange={(e) => { updateDiscussionPinStatus(e.target.checked); }}
                type="checkbox" label="Is it a featured discussion?" />
            </Form.Group>}
            <Form.Group >
              <Form.Label><strong>Camera</strong></Form.Label>
              <Form.Control onChange={(event) => { updateCamera(event.target.value); }} value={camera} type="text" />


            </Form.Group>

            <Form.Group>
              <Form.Label><strong>Location</strong></Form.Label>
              <Form.Control
                type="text"
                value={photoLocation}
                onChange={(event) => { updatePhotoLocation(event.target.value); }} />
            </Form.Group>

            <Form.Group>

              <Form.Label><strong>Description</strong></Form.Label>
              <Form.Text className="mb-2">
                Describe how your sharp photo connects to the Staying Sharp Pillar Ongoing Exercise?
  </Form.Text>
              {/* <RichEditor
                key={'content'}
                type='newDiscussion'
                value={content}
                onChange={(value) => { updateDiscussionContent(value); }}
                onSave={() => { postDiscussion(userId, forumId, currentForum, successCallback); }}
              /> */}
              <Form.Control value={content} onChange={(e) => { updateDiscussionContent(e.target.value); }} as="textarea"></Form.Control>
            </Form.Group>
            <Form.Group className="small">
              <Form.Check checked={rights} onChange={(e) => { updateRights(e.target.checked); }}
                type="checkbox" label="I am the owner of this photo. AARP may use this photo without permission or attribution. (Required)" />
            </Form.Group>
            <Form.Group className="d-flex justify-content-between">
              <Button onClick={() => closeModal()} variant="secondary">Cancel</Button>
              <Button onClick={() => postDiscussion(userId, forumId, currentForum, successCallback)}>Post Photo</Button>
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
      updateCamera: (value) => { dispatch(updateCamera(value)); },
      updatePhotoLocation: (value) => { dispatch(updatePhotoLocation(value)); },
      updateRights: (value) => { dispatch(updateRights(value)); },
    };
  }
)(NewDiscussion);
