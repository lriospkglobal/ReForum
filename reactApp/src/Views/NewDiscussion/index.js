import _ from 'lodash';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Form, Button, Image, Alert } from 'react-bootstrap';
import Dropzone from 'react-dropzone';
import CreatableSelect from 'react-select/creatable'
import DatePicker from "react-datepicker";
import UploadImage from '../../App/img/Photo-Upload-Box.png';

import "react-datepicker/dist/react-datepicker.css";

import {
  postDiscussion,
  updateDiscussionTitle,
  updateDiscussionTile,
  updateDiscussionContent,
  updateDiscussionPinStatus,
  updateDiscussionTags,
  updateCamera,
  updatePhotoLocation,
  updateRights,
  updateDate,
  updateTime
} from './actions';

const options = [
  { value: 'smartphone', label: 'Smartphone' },
  { value: 'tablet', label: 'Tablet' },
  { value: 'point and shoot', label: 'Point and Shoot' },
  { value: 'SLR and DSLR', label: 'SLR and DSLR' }
]

const optionsTime = [
  { value: 'dawn', label: 'Dawn' },
  { value: 'morning', label: 'Morning' },
  { value: 'midday', label: 'Midday' },
  { value: 'afternoon', label: 'Afternoon' },
  { value: 'sunset', label: 'Sunset' },
  { value: 'evening', label: 'Evening' },

]



class NewDiscussion extends Component {
  constructor(props) {
    super(props);

    this.state = {
      forumId: null,
      userId: null,
      fatalError: null,
      tileImage: null,
      uploadedImage: null,
      uploadedBase64: null,
      startDate: new Date(),
      selectedOption: null
    };


  }


  handleChange = date => {
    this.setState({
      startDate: date
    }, () => this.props.updateDate(this.state.startDate));
  };

  componentDidMount() {
    const {
      user,
      currentForum,
      forums,
      updateDiscussionTags,
      updateDate
    } = this.props;
    updateDiscussionTags(['aarp'])
    updateDate(this.state.startDate)
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
        fatalError: 'Invalid forum, go for the right one!',
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
      errorMsg,
      postingSuccess,
      postingDiscussion,
    } = this.props.newDiscussion;

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
      closeModal,
      updateTime,
      pillar
    } = this.props;

    const {
      title,
      content,
      tags,
      pinned,
      tile,
      camera,
      photoLocation,
      rights,
      time

    } = this.props.newDiscussion;

    const {
      forumId,
      userId,
    } = this.state;

    // only show the editor when user is authenticated
    if (authenticated) {

      return (
        <section className="d-flex new-discussion align-items-start">
          <div className="new-discussion__dropzone-container d-flex">
            {this.state.uploadedBase64 ? <div className="new-discussion__uploaded-image-container" style={{ backgroundImage: 'url(' + this.state.uploadedBase64 + ')' }} ></div> :
              <Dropzone accept="image/jpeg, image/png" maxSize={5000000}
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
                      <div className="p-3 justify-content-center align-items-center w-100 flex-column d-flex">
                        <Image className="upload-image" src={UploadImage} />
                        <small className="w-100 text-center mt-3">Maximum upload file size: 5MB<br />
                        (.JPG, .PNG)
                        </small>
                      </div>
                    </div>
                  </section>
                )}
              </Dropzone>}


          </div>
          <Form className="new-discussion__form p-3 overflow-auto" onSubmit={(e) => { e.preventDefault() }}>
            <Form.Group controlId="exampleForm.ControlInput1">
              <Form.Label><strong>Photo Title</strong></Form.Label>
              <Form.Control key={'title'}
                type="text"
                value={title}
                onChange={(event) => { updateDiscussionTitle(event.target.value); }} />
            </Form.Group>



            {(role === 'admin') && <Form.Group className="small">
              <Form.Check checked={pinned} onChange={(e) => { updateDiscussionPinStatus(e.target.checked); }}
                type="checkbox" label="Feature this post." />
            </Form.Group>}
            <Form.Group >
              <Form.Label><strong>Camera</strong></Form.Label>

              <CreatableSelect
                isClearable
                onChange={obj => obj.value && updateCamera(obj.value)}
                onInputChange={obj => obj.value && updateCamera(obj.value)}
                options={options}
                placeholder="Select or input..."
              />

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
                Describe how your Sharp Shot connects to the Staying Sharp pillar <span className="text-capitalize">{pillar}</span>.

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
            <Form.Group>
              <Form.Label><strong>Date</strong></Form.Label>
              <Form.Text className="mb-2">
                Date when picture was taken
              </Form.Text>
              <DatePicker
                selected={this.state.startDate}
                onChange={this.handleChange}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label><strong>Time</strong></Form.Label>
              <Form.Text className="mb-2">
                Time of day photo was taken
              </Form.Text>
              <CreatableSelect
                isClearable
                onChange={obj => obj.value && updateTime(obj.value)}
                onInputChange={obj => obj.value && updateTime(obj.value)}
                options={optionsTime}
                placeholder="Select or input..."
              />

            </Form.Group>
            <Form.Group className="small">
              <Form.Check checked={rights} onChange={(e) => { updateRights(e.target.checked); }}
                type="checkbox" label="I am the owner of this photo. AARP may use this photo without permission or attribution. (Required)" />
            </Form.Group>
            {(errorMsg || postingSuccess) ? <Form.Group>

              {errorMsg && <Alert variant="danger">
                {errorMsg}
              </Alert>}
              {postingSuccess && <Alert variant="success">
                Successfully created post.
          </Alert>}


            </Form.Group> : null}
            <Form.Group className="d-flex justify-content-between">
              <Button onClick={() => closeModal()} variant="secondary">Cancel</Button>
              <Button disabled={postingDiscussion} onClick={() => postDiscussion(userId, forumId, currentForum, successCallback)}>{postingDiscussion ? <div class="spinner-border" role="status">
                <span className="sr-only">Loading...</span>
              </div> : 'Post Photo'}</Button>
            </Form.Group>

          </Form>
        </section >
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


    return (
      <div className="h-100">

        {this.renderEditor()}

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
      updateDate: (value) => { dispatch(updateDate(value)); },
      updateTime: (value) => { dispatch(updateTime(value)); },
    };
  }
)(NewDiscussion);
