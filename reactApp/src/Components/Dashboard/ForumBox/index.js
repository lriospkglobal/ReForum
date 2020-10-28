import React, { Component } from 'react';
import { Button, Form, Image, Col, Row, Alert } from 'react-bootstrap';
import Dropzone from 'react-dropzone';
import UploadImage from '../../../App/img/Photo-Upload-Box.png';
import UploadImageMentor from '../../../App/img/Bio-Photo-Upload@2x.png';
import CreatableSelect from 'react-select/creatable'
import DatePicker from "react-datepicker";
import { postDiscussionApi } from '../../../Views/NewDiscussion/api';
import { connect } from 'react-redux';

const options = [
  { value: 'smartphone', label: 'Smartphone' },
  { value: 'tablet', label: 'Tablet' },
  { value: 'point and shoot', label: 'Point and Shoot' },
  { value: 'slr and dslr', label: 'SLR and DSLR' }
]

class ForumBox extends Component {
  constructor(props) {
    super(props);
    this.state = {
      newForumTitle: '',
      newForumSlug: '',
      newForumDirections: '',
      newForumDescription: '',
      newMosaicImageOwner: false,
      errorMsg: null,
      mosaicImage: null,
      photoDate: new Date(),
      uploadedBase64mosaicImage: null,
      uploadedBase64tileImage: '',
      tileImage: null,
      uploadedBase64mentorImage: null,
      mentorImage: null,
      success: false,
      tileTitle: '',
      tileCamera: '',
      tileLocation: '',
      tileDescription: '',
      tileTags: ['aarp'],
      mentorName: '',
      mentorBiography: '',
      photoTime: 'Morning',
      tileRights: false,
      tileFeatured: false,
      tileObj: false,
      tags: [
        { value: '5', checked: false, disabled: false },
        { value: '10', checked: false, disabled: false },
        { value: '25', checked: false, disabled: false },
        { value: '50', checked: false, disabled: false },
        { value: '100', checked: false, disabled: false },
        { value: '200', checked: false, disabled: false },
        { value: '500', checked: false, disabled: false },
        { value: '1000', checked: false, disabled: false }


      ]

    };

    this.originalState = this.state;

    this.handleCreateForum = this.handleCreateForum.bind(this);
  }

  creatForumSuccess = (newForum) => {

    const {
      tileTitle,
      tileTags,
      tileCamera,
      tileDescription,
      tileLocation,
      tileRights,
      tileFeatured,
      photoDate,
      photoTime,
      tileImage,
      tileObj,
      newForumSlug

    } = this.state
    const { user } = this.props

    if (tileObj) {
      postDiscussionApi({
        forumName: newForumSlug,
        userId: user._id,
        forumId: newForum._doc._id,
        title: tileTitle,
        content: tileDescription,
        tags: tileTags,
        pinned: tileFeatured,
        tile: tileImage,
        photoLocation: tileLocation,
        camera: tileCamera,
        rights: tileRights,
        date: photoDate,
        time: photoTime
      }).then(
        (data) => {
          if (data.data.postCreated === true) {
            this.setState({ ...this.originalState, success: true })
          }
        },
        (error) => {
          this.setState({ errorMsg: 'Mosaic created but tile wasn\'t added' })
        }
      );
    } else {
      this.setState({ ...this.originalState, success: true })
    }



  }

  handleCreateForum() {
    // remove any error messages
    this.setState({ errorMsg: null, success: false });

    const {
      newForumTitle,
      newForumSlug,
      mosaicImage,
      newForumDirections,
      newForumDescription,
      newMosaicImageOwner,
      tileTitle,
      tileCamera,
      tileLocation,
      tileDescription,

      tileRights,
      uploadedBase64tileImage,
      tileFeatured,

      mentorName,
      mentorBiography,
      mentorImage,
      uploadedBase64mentorImage,


    } = this.state;

    let convertedTitle = null;
    let convertedSlug = null;

    // check and convert forum title
    if (newForumTitle !== '') {
      // trim any leading or ending white spaces
      convertedTitle = newForumTitle.trim();

      // check the length, 4 is hardcoded here
      if (convertedTitle.length < 4) {
        return this.setState({ errorMsg: 'Forum title should have at least 4 characters.' });
      }
    } else {
      return this.setState({ errorMsg: 'Forum title is empty. Please provide a valid forum Title.' });
    }

    //check mosaic image
    if (!mosaicImage) return this.setState({ errorMsg: 'Select a photo for mosaic.' })
    // check and confirm forum slug
    if (convertedSlug !== '') {
      const slugRegex = /^[a-z\_]+$/;
      convertedSlug = newForumSlug.match(slugRegex) ? newForumSlug : null;

      // length check
      if (convertedSlug && convertedSlug.length < 4) {
        return this.setState({ errorMsg: 'Forum slug should have at least 4 charecters.' });
      }
    } else {
      return this.setState({ errorMsg: 'Forum slug is empty. Please provide a valid forum slug.' });
    }

    if (!newForumDescription.length) return this.setState({ errorMsg: 'Mosaic description is empty.' })
    if (!newForumDirections.length) return this.setState({ errorMsg: 'Mosaic directions empty.' })
    if (!newMosaicImageOwner) return this.setState({ errorMsg: 'Please check mosaic photo rights.' })

    if (!mentorName.length) return this.setState({ errorMsg: 'Please add a mentor name.' })
    if (!mentorBiography.length) return this.setState({ errorMsg: 'Please add a mentor biography.' })
    if (!mentorImage) return this.setState({ errorMsg: 'Please add a mentor image.' })

    if (!convertedTitle) { return this.setState({ errorMsg: 'Please provide a valid Forum Title.' }); }
    if (!convertedSlug) { return this.setState({ errorMsg: 'Please provide a valid Forum Slug. Slug can only contain small case alphabets and underscore.' }); }


    let tileObj = false
    if (tileTitle.length || tileFeatured || tileCamera.length || tileDescription.length || tileLocation.length || tileRights || uploadedBase64tileImage.length) {
      tileObj = true
      const newTileAttributes = ['tileTitle', 'tileCamera', 'tileDescription', 'tileLocation', 'tileRights', 'uploadedBase64tileImage']

      let errorMsg
      for (let i = 0; i < newTileAttributes.length; i++) {
        if (typeof this.state[newTileAttributes[i]] === 'string') {
          if (!this.state[newTileAttributes[i]].length) {
            switch (newTileAttributes[i]) {

              case 'tileTitle':
                errorMsg = 'Please provide a tile title.'
              case 'tileCamera':
                errorMsg = 'Please add a tile camera.'
              case 'tileDescription':
                errorMsg = 'Please write some tile description.'
              case 'tileLocation':
                errorMsg = 'Please add a tile location.'
              case 'uploadedBase64tileImage':
                errorMsg = 'Please add a tile image.'
            }


            return this.setState({ errorMsg })

          }
        }


        if (typeof this.state[newTileAttributes[i]] === 'boolean') {
          if (!this.state[newTileAttributes[i]]) {

            switch (newTileAttributes[i]) {
              case 'tileRights':
                errorMsg = 'Please check tile photo rights.'
            }

            return this.setState({ errorMsg })

          }
        }
      }


    }

    this.setState({ tileObj }, () => {
      if (convertedTitle && convertedSlug) {
        this.props.createAction(
          {
            title: convertedTitle,
            slug: convertedSlug,
            mosaicImage,
            newForumDescription,
            newForumDirections,
            newMosaicImageOwner,
            mentorName,
            mentorBiography,
            uploadedBase64mentorImage


          }, this.creatForumSuccess);
      }
    })



  }
  processImage = (image) => {
    this.encodeImage(image).then(base64 => {

      this.setState({ ['uploadedBase64' + image]: base64 })

    }).catch(err => console.error(err))
  }
  encodeImage = (image) => new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.readAsDataURL(this.state[image]);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });

  setTitle = (e) => {
    const title = e.target.value
    let newForumSlug = title.replace(/\s/g, "_").toLowerCase()
    this.setState({ newForumTitle: title, newForumSlug, success: false })
  }

  checkProgress = (value, index, e) => {
    const checked = e.target.checked
    let nChecked = this.state.tags.filter(tag => tag.checked).length
    if (checked) nChecked += 1
    else nChecked -= 1

    const tags = [...this.state.tags]


    if (nChecked <= 7)
      tags[index].checked = checked

    this.setState({
      tags: tags.map(tag => {
        if (nChecked >= 7) {
          if (!tag.checked && !tag.disabled) {
            tag.disabled = true;
          }
        }
        else if (nChecked < 8) {
          if (tag.disabled) {
            tag.disabled = false;
          }
        }
        return tag
      })
    })
  }


  render() {
    const {
      forums,
      creatingForum,
      deleteAction,
      deletingForum,
    } = this.props;

    const {
      newForumTitle,
      newForumSlug,
      errorMsg,
      tags
    } = this.state;

    return (
      <div className="forum-box">
        {/* <div >Current Forums</div> */}
        {/* <div >
          {deletingForum && <div >Removing forum, please wait...</div>}

          {forums.map((forum) => <div key={forum.id} >
            <div >{forum.name}</div>
            <div >({forum.slug})</div>
            <div >
              <Button onClick={() => { deleteAction(forum.id); }}>Remove</Button>
            </div>
          </div>)}

        </div> */}

        <div >

          <h2 className="mb-5"><strong>Create New Mosaic</strong></h2>
          <Form>
            <Form.Group className="page-title">


              <Form.Label>Forum Title</Form.Label>
              <Form.Control value={newForumTitle} onChange={this.setTitle} type="text" />

            </Form.Group>
            <Form.Group className="directions">


              <Form.Label>Directions</Form.Label>
              <Form.Control value={this.state.newForumDirections} as="textarea" onChange={(e) => this.setState({ newForumDirections: e.target.value, success: false })} />

            </Form.Group>


            <Form.Group className="form-card">
              <Form.Label>Mosaic Photo</Form.Label>
              <Row>
                <Col md="7">
                  <div className="forum-box__dropzone-container d-flex">
                    {this.state.uploadedBase64mosaicImage ? <div className="forum-box__uploaded-image-container" style={{ backgroundImage: 'url(' + this.state.uploadedBase64mosaicImage + ')' }} ></div> :
                      <Dropzone accept="image/jpeg, image/png" maxSize={5000000}
                        onDrop={acceptedFiles => {
                          this.setState({ mosaicImage: acceptedFiles[0], success: false }, () =>
                            this.processImage('mosaicImage')
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
                </Col>
                <Col md="5" className="d-flex flex-column justify-content-between">
                  <div className="mb-3">
                    <Form.Label>
                      Description
                  </Form.Label>
                    <Form.Control
                      value={this.state.newForumDescription}
                      onChange={(e) => this.setState({ newForumDescription: e.target.value, success: false })}
                      className="description"
                      as="textarea"
                      maxLength="500"
                      placeholder="Why did you choose this photo for the mosaic?" />
                    <Form.Label className="mt-3">
                      Pillar
                  </Form.Label>
                    <Form.Control as="select">

                      <option>Connect</option>
                      <option>Discover</option>
                      <option>Move</option>
                      <option>Nourish</option>
                      <option>Relax</option>
                    </Form.Control>
                  </div>
                  <Form.Check
                    checked={this.state.newMosaicImageOwner} onChange={(e) => { this.setState({ newMosaicImageOwner: e.target.checked, success: false }); }}
                    type="checkbox" className="small" label="I am the owner of this photo or have permission to use it. AARP may use this photo without permission or attribution. (Required)" />
                </Col>
              </Row>


            </Form.Group>


            <Form.Group className="form-card">
              <Form.Label>Mosaic Progress</Form.Label>



              <p>Display progress snapshots</p>
              {tags.map((obj, index) => (

                <Form.Check inline label={obj.value} disabled={obj.disabled} checked={obj.checked} type="checkbox" onChange={this.checkProgress.bind(this, obj.value, index)} key={obj.value} />


              ))}


            </Form.Group>
            <Form.Group className="form-card">
              <Form.Label>Photo Tile Upload (Optional)</Form.Label>
              <Row>
                <Col md="7">
                  <div className="forum-box__dropzone-container d-flex">
                    {this.state.uploadedBase64tileImage ? <div className="forum-box__uploaded-image-container" style={{ backgroundImage: 'url(' + this.state.uploadedBase64tileImage + ')' }} ></div> :
                      <Dropzone accept="image/jpeg, image/png" maxSize={5000000}
                        onDrop={acceptedFiles => {
                          this.setState({ tileImage: acceptedFiles[0], success: false }, () =>
                            this.processImage('tileImage')
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
                </Col>
                <Col md="5" >

                  <Form.Group controlId="exampleForm.ControlInput1">
                    <Form.Label>Photo Title</Form.Label>
                    <Form.Control key={'title'}
                      type="text"
                      value={this.state.tileTitle}
                      onChange={(e) => this.setState({ tileTitle: e.target.value, success: false })}
                    />
                  </Form.Group>
                  <Form.Group className="small">
                    <Form.Check checked={this.state.tileFeatured} onChange={(e) => { this.setState({ tileFeatured: e.target.checked, success: false }); }}
                      type="checkbox" label="Is it a featured discussion?" />
                  </Form.Group>



                  <Form.Group >
                    <Form.Label>Camera</Form.Label>

                    <CreatableSelect
                      isClearable
                      onChange={obj => obj.value && this.setState({ tileCamera: obj.value, success: false })}
                      onInputChange={obj => obj.value && this.setState({ tileCamera: obj.value, success: false })}
                      options={options}
                      placeholder="Select or input..."
                    />

                  </Form.Group>

                  <Form.Group>
                    <Form.Label>Location</Form.Label>
                    <Form.Control
                      type="text"
                      value={this.state.tileLocation}
                      onChange={(e) => this.setState({ tileLocation: e.target.value, success: false })}
                    />
                  </Form.Group>

                  <Form.Group>

                    <Form.Label>Description</Form.Label>
                    <Form.Text className="mb-2">
                      Describe how your Sharp Shot connects to the Staying Sharp pillar ongoing exercise.
  </Form.Text>
                    <Form.Control value={this.state.tileDescription} onChange={(e) => this.setState({ tileDescription: e.target.value, success: false })} as="textarea"></Form.Control>
                  </Form.Group>
                  <Form.Group>
                    <Form.Label>Date</Form.Label>
                    <Form.Text className="mb-2">
                      Date when picture was taken
              </Form.Text>
                    <DatePicker
                      selected={this.state.photoDate}
                      onChange={date => {
                        this.setState({
                          photoDate: date, success: false
                        })
                      }}
                    />
                  </Form.Group>
                  <Form.Group>
                    <Form.Label>Time</Form.Label>
                    <Form.Text className="mb-2">
                      Time of day photo was taken
              </Form.Text>
                    <Form.Control as="select" value={this.state.photoTime} onChange={e => {

                      this.setState({ photoTime: e.target.value, success: false })
                    }}>
                      <option>Morning</option>
                      <option>Noon</option>
                      <option>Evening</option>
                      <option>Night</option>

                    </Form.Control>
                  </Form.Group>
                  <Form.Group className="small">
                    <Form.Check
                      checked={this.state.tileRights} onChange={(e) => this.setState({ tileRights: e.target.checked, success: false })}
                      type="checkbox" label="I am the owner of this photo. AARP may use this photo without permission or attribution. (Required)" />
                  </Form.Group>




                </Col>
              </Row>


            </Form.Group>
            <Form.Group className="form-card">
              <Form.Label>Mosaic Mentor</Form.Label>
              <Row>
                <Col md="3">
                  <div className="forum-box__dropzone-container d-flex">
                    {this.state.uploadedBase64mentorImage ? <div className="forum-box__uploaded-image-container" style={{ backgroundImage: 'url(' + this.state.uploadedBase64mentorImage + ')' }} ></div> :
                      <Dropzone accept="image/jpeg, image/png" maxSize={5000000}
                        onDrop={acceptedFiles => {
                          this.setState({ mentorImage: acceptedFiles[0], success: false }, () =>
                            this.processImage('mentorImage')
                          )

                        }
                        }>
                        {({ getRootProps, getInputProps }) => (
                          <section className="d-flex w-100 justify-content-center">
                            <div className="d-flex" {...getRootProps()} >
                              <input name="tile" {...getInputProps()} />
                              <div className="p-3 justify-content-center align-items-center w-100 flex-column d-flex">
                                <Image className="upload-image" src={UploadImageMentor} />

                              </div>
                            </div>
                          </section>
                        )}
                      </Dropzone>}


                  </div>
                </Col>
                <Col md="9" >

                  <Form.Group>
                    <Form.Label>
                      Name
                  </Form.Label>
                    <Form.Control value={this.state.mentorName} onChange={e => this.setState({ mentorName: e.target.value, success: false })} className="mentor-name" type="text" />
                  </Form.Group>
                  <Form.Group>
                    <Form.Label>
                      Biography
                  </Form.Label>
                    <Form.Control
                      value={this.state.mentorBiography} onChange={e => this.setState({ mentorBiography: e.target.value, success: false })}
                      className="biography" as="textarea" maxLength="500" placeholder="Tell a brief background about the Mentor" />
                  </Form.Group>

                </Col>
              </Row>


            </Form.Group>
            {(errorMsg || this.state.success) ? <Form.Group>
              {this.state.success && <Alert variant="success">
                Mosaic succesfully created!
              </Alert>}
              {errorMsg && <Alert variant="danger">
                {errorMsg}
              </Alert>}
            </Form.Group> : null}
            <hr />
            <section className="pt-4 pb-4 d-flex justify-content-end">
              <Button onClick={this.handleCreateForum} disabled={creatingForum}>{creatingForum ? <div className="spinner-border" role="status">
                <span className="sr-only">Loading...</span>
              </div> : 'Create Mosaic'}</Button>
            </section>
          </Form>




        </div>
      </div>
    );
  }
}

ForumBox.defaultProps = {
};

/* ForumBox.propTypes = {
  forums: React.PropTypes.array,
  deletingForum: React.PropTypes.bool,
  deleteAction: React.PropTypes.func,
  creatingForum: React.PropTypes.bool,
  createAction: React.PropTypes.func,
}; */


export default connect(
  (state) => {
    return {
      user: state.user
    };
  }

)(ForumBox);
