import React, { Component } from 'react';
import { Button, Form, Image, Col, Row, Alert } from 'react-bootstrap';
import Dropzone from 'react-dropzone';
import UploadImage from '../../../App/img/Photo-Upload-Box.png';
import CreatableSelect from 'react-select/creatable'
import DatePicker from "react-datepicker";

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
      errorMsg: null,
      mosaicImage: null,
      startDate: new Date(),
      uploadedBase64mosaicImage: null,
      uploadedBase64tileImage: null,
      tileImage: null,
      uploadedBase64mentorImage: null,
      mentorImage: null,
      success: false
    };

    this.originalState = this.state;

    this.handleCreateForum = this.handleCreateForum.bind(this);
  }

  creatForumSuccess = () => {
    this.setState({ ...this.originalState, success: true })
  }

  handleCreateForum() {
    // remove any error messages
    this.setState({ errorMsg: null });

    const {
      newForumTitle,
      newForumSlug,
      mosaicImage
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

    if (!convertedTitle) { return this.setState({ errorMsg: 'Please provide a valid Forum Title.' }); }
    if (!convertedSlug) { return this.setState({ errorMsg: 'Please provide a valid Forum Slug. Slug can only contain small case alphabets and underscore.' }); }

    if (convertedTitle && convertedSlug) { this.props.createAction({ title: convertedTitle, slug: convertedSlug, mosaicImage }, this.creatForumSuccess); }
  }
  processImage = (image) => {
    this.encodeImage(image).then(base64 => {

      this.setState({ ['uploadedBase64' + image]: base64 })

    }).catch(err => console.error(err))
  }
  encodeImage = (image) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    console.log(this.state)
    reader.readAsDataURL(this.state[image]);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
  handleChange = date => {
    this.setState({
      startDate: date
    });
  };

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
              <Form.Control value={this.state.newForumTitle} onChange={(e) => { this.setState({ newForumTitle: e.target.value }); }} type="text" />

            </Form.Group>
            <Form.Group className="directions">


              <Form.Label>Directions</Form.Label>
              <Form.Control as="textarea" defaultValue="View the mosiac image below. Rollover individual images to see a larger thumbnail view, or click to view the full image with description and comments. Post your own photo and be part of the community." rows="2" />

            </Form.Group>
            <Form.Group className="slug">


              <Form.Label>Forum Slug</Form.Label>
              <Form.Control value={this.state.newForumSlug} onChange={(e) => { this.setState({ newForumSlug: e.target.value }); }} type="text" />

            </Form.Group>
            <Form.Group className="form-card">
              <Form.Label>Mosaic Photo</Form.Label>
              <Row>
                <Col md="7">
                  <div className="forum-box__dropzone-container d-flex">
                    {this.state.uploadedBase64mosaicImage ? <div className="forum-box__uploaded-image-container" style={{ backgroundImage: 'url(' + this.state.uploadedBase64mosaicImage + ')' }} ></div> :
                      <Dropzone accept="image/jpeg, image/png" maxSize={5000000}
                        onDrop={acceptedFiles => {
                          this.setState({ mosaicImage: acceptedFiles[0] }, () =>
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
                  <div>
                    <Form.Label>
                      Description
                  </Form.Label>
                    <Form.Control className="description" as="textarea" maxLength="500" placeholder="Why did you choose this photo for the mosaic?" />
                  </div>
                  <Form.Check
                    type="checkbox" className="small" label="I am the owner of this photo or have permission to use it. AARP may use this photo without permission or attribution. (Required)" />
                </Col>
              </Row>


            </Form.Group>
            <Form.Group className="form-card">
              <Form.Label>Photo Tile Upload</Form.Label>
              <Row>
                <Col md="7">
                  <div className="forum-box__dropzone-container d-flex">
                    {this.state.uploadedBase64tileImage ? <div className="forum-box__uploaded-image-container" style={{ backgroundImage: 'url(' + this.state.uploadedBase64tileImage + ')' }} ></div> :
                      <Dropzone accept="image/jpeg, image/png" maxSize={5000000}
                        onDrop={acceptedFiles => {
                          this.setState({ tileImage: acceptedFiles[0] }, () =>
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

                    />
                  </Form.Group>




                  <Form.Group >
                    <Form.Label>Camera</Form.Label>

                    <CreatableSelect
                      isClearable
                      //onChange={obj => obj.value && updateCamera(obj.value)}
                      //onInputChange={obj => obj.value && updateCamera(obj.value)}
                      options={options}
                      placeholder="Select or input..."
                    />

                  </Form.Group>

                  <Form.Group>
                    <Form.Label>Location</Form.Label>
                    <Form.Control
                      type="text"

                    />
                  </Form.Group>

                  <Form.Group>

                    <Form.Label>Description</Form.Label>
                    <Form.Text className="mb-2">
                      Describe how your sharp photo connects to the Staying Sharp Pillar Ongoing Exercise?
  </Form.Text>
                    <Form.Control as="textarea"></Form.Control>
                  </Form.Group>
                  <Form.Group>
                    <Form.Label>Date</Form.Label>
                    <Form.Text className="mb-2">
                      Date when picture was taken
              </Form.Text>
                    <DatePicker
                      selected={this.state.startDate}
                      onChange={this.handleChange}
                    />
                  </Form.Group>
                  <Form.Group>
                    <Form.Label>Time</Form.Label>
                    <Form.Text className="mb-2">
                      Time of day photo was taken
              </Form.Text>
                    <Form.Control as="select">
                      <option>Morning</option>
                      <option>Noon</option>
                      <option>Evening</option>
                      <option>Night</option>

                    </Form.Control>
                  </Form.Group>
                  <Form.Group className="small">
                    <Form.Check
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
                          this.setState({ mentorImage: acceptedFiles[0] }, () =>
                            this.processImage('mentorImage')
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
                <Col md="9" >

                  <Form.Group>
                    <Form.Label>
                      Name
                  </Form.Label>
                    <Form.Control className="mentor-name" type="text" />
                  </Form.Group>
                  <Form.Group>
                    <Form.Label>
                      Biography
                  </Form.Label>
                    <Form.Control className="biography" as="textarea" maxLength="500" placeholder="Tell a brief background about the Mentor" />
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

export default ForumBox;
