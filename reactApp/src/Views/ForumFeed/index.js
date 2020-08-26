import React, { Component } from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import NewDiscussion from '../NewDiscussion/index';
import _ from 'lodash';
import axios from 'axios';
import { Button as ButtonBootstrap, Container, Modal, Image as ImageBootstrap, Popover, Col, Row, Card } from 'react-bootstrap';

import {
  getDiscussions,
  updateSortingMethod,
} from './actions';


import FeedBox from '../../Components/FeedBox';
import SideBar from '../../Components/SideBar';




let timer;

class ForumFeed extends Component {
  constructor(props) {
    super(props)
    this.state = {
      loading: false,
      canvasHeight: 0,
      canvasWidth: 0,
      coordinates: null,
      loadedEncodedImages: {},
      showModal: false,
      imageOnModal: '',
      showUploadTilesButton: false,
      showUploadMosaicImageButton: false,
      toUploadTilesList: null,
      toUploadMosaicList: null,
      showSuccessMessage: false,
      successMessage: '',
      tileSize: null,
      timesWider: '1',
      widthHeight: '3',
      quality: 100,
      showTooltip: false,
      currentForumId: null,
      showDiscussionModal: false
    }
    this.canvas = React.createRef()
  }

  setImageModalPopover = (imgName) => {
    this.setState({ imageOnModal: this.state.loadedEncodedImages[imgName], loadingImage: false })
  }

  closeModal = () => {
    this.setState({
      showModal: false
    })
  }

  getIndividualImage = (x, y) => {

    for (let attr in this.state.coordinates) {

      const imageCoordinates = attr.split('-')
      const imageCoordinatesX = parseInt(imageCoordinates[0])
      const imageCoordinatesY = parseInt(imageCoordinates[1])
      if ((x >= imageCoordinatesX && x <= (imageCoordinatesX + this.state.tileSize)) && (y >= imageCoordinatesY && y <= (imageCoordinatesY + this.state.tileSize))) {
        const imgName = this.state.coordinates[attr]

        if (Object.keys(this.state.loadedEncodedImages).includes(imgName) && this.state.loadedEncodedImages[imgName]) {

          this.setImageModalPopover(imgName)
        } else {
          this.setState({ loadingImage: true }, () => {
            axios.get('/api/forum/tile?tileFileName=' + imgName + '&forumId=' + this.state.currentForumId).then(response => {
              this.setState({
                loadedEncodedImages: {
                  ...this.state.loadedEncodedImages,
                  [imgName]: response.data.base64

                }
              }, () =>
                this.setImageModalPopover(imgName)

              )
            }).catch(e => console.error(e))
          })

        }


        break
      }

    }
  }

  getCoordenate = (e) => {




    const rect = e.target.getBoundingClientRect()
    const clientX = e.clientX
    const clientY = e.clientY
    const x = clientX - rect.left
    const y = clientY - rect.top


    if (timer !== undefined) {
      window.clearTimeout(timer)
    }
    timer = window.setTimeout(() => {

      if (!this.state.inPopover) {
        this.setState({
          x: clientX,
          y: clientY
        }, () => {
          if (!this.state.showModal) {
            this.getIndividualImage(x, y)
          }
        }


        )
      }

    }, 500);






  }

  drawImage = (currentForumObj) => {
    const context = this.canvas.current.getContext('2d')
    const img = new Image()
    const that = this;
    img.onload = function () {

      let state = {
        canvasWidth: this.width,
        canvasHeight: this.height,
        loading: false,
        coordinates: currentForumObj.mosaic.coordinates,
        tileSize: parseInt(currentForumObj.mosaic.tile_size)
      }


      that.setState(state, () => {
        that.canvas.current.width = that.state.canvasWidth
        that.canvas.current.height = that.state.canvasHeight
        context.drawImage(this, 0, 0, this.width, this.height)
      })

    }

    img.src = 'data:image/jpeg;base64,' + currentForumObj.mosaic.base64
  }
  componentDidMount() {
    const {
      currentForumId,
      getDiscussions,

      getCurrentForum

    } = this.props;

    // get the discussions and pinned discussions
    getDiscussions(currentForumId());

    const currentForumObj = getCurrentForum();

    if (currentForumObj) {
      this.setState({
        currentForumObj
      }, () => {
        if (currentForumObj.mosaic) {
          this.setState({ currentForumId: currentForumObj._id }, () => this.drawImage(currentForumObj))
        }
      })


    }



  }

  componentDidUpdate(prevProps) {
    const {
      currentForum,
      currentForumId,
      getDiscussions,
      getPinnedDiscussions,
      getCurrentForum
    } = this.props;



    // get the discussions again
    // if the forum didn't matched
    if (prevProps.currentForum !== currentForum) {
      const feedChanged = true;
      getDiscussions(currentForumId(), feedChanged);


      const currentForumObj = getCurrentForum();

      if (currentForumObj) {
        this.setState({
          currentForumObj
        }, () => {
          if (currentForumObj.mosaic) {
            this.setState({ currentForumId: currentForumObj._id }, () => this.drawImage(currentForumObj))
          }
        })


      }


    }
  }

  successCallback = () => {
    window.location = "/"
  }

  handleSortingChange(newSortingMethod) {
    const {
      currentForum,
      getDiscussions,
      updateSortingMethod,
      sortingMethod,
    } = this.props;

    if (sortingMethod !== newSortingMethod) {
      updateSortingMethod(newSortingMethod);
      getDiscussions(currentForum, false, true);
    }
  }

  renderNewDiscussionButtion() {
    const { currentForum } = this.props;

    return (
      <div >

        <ButtonBootstrap className="camera" onClick={() => this.setState({ showDiscussionModal: true })}>
          Post a Photo
          </ButtonBootstrap>

        <Modal className="new-discussion-modal" show={this.state.showDiscussionModal} size="xl" onHide={() => this.setState({ showDiscussionModal: false })}>
          <Modal.Header closeButton>
            <Modal.Title>Post a Photo</Modal.Title>
          </Modal.Header>
          <Modal.Body className="p-0">
            <NewDiscussion successCallback={this.successCallback} />
          </Modal.Body>

        </Modal>

      </div>
    );
  }

  render() {
    const {
      currentForum,
      discussions,
      fetchingDiscussions,
      pinnedDiscussions,
      fetchingPinnedDiscussions,
      sortingMethod,
      error,
    } = this.props;

    if (error) {
      return (
        <div >
          {error}
        </div>
      );
    }

    return (
      <section className="forum-feed">

        <Helmet><title>{`Mosaic Forum | ${currentForum}`}</title></Helmet>
        <Container className="forum-feed__canvas-container pt-5 pb-5" fluid>
          <Container className="justify-content-center d-flex flex-wrap">
            <section className="intro w-100 pb-4">
              <h1><strong>Community Photo Mosaic: Ongoing Exercise</strong></h1>
              <div className="d-flex flex-wrap mt-4">
                <strong className="w-100">
                  Directions
                </strong>
                <p className="w-75 pr-5">


                  View the mosiac image below. Rollover individual images to see a larger thumbnail view, or click to view the full image with description and comments. Post your own photo and be part of the community.

              </p>
                <div className="w-25">
                  {this.renderNewDiscussionButtion()}
                </div>
              </div>
            </section>
            <Popover placement="right"
              style={{ display: this.state.loading || !this.state.coordinates ? 'none' : 'block', top: this.state.y, left: this.state.x }} onClick={() => this.setState({ showModal: true })}
              onMouseOut={() => this.setState({ inPopover: false })} onMouseOver={() => this.setState({ inPopover: true })} >

              <Popover.Content>
                {this.state.loadingImage ? <div className="d-flex mt-2 justify-content-center align-items-center"><div className="spinner-border" role="status">
                  <span className="sr-only">Loading...</span>
                </div></div> : <ImageBootstrap src={'data:image/jpeg;base64, ' + this.state.imageOnModal} thumbnail />}


              </Popover.Content>
            </Popover>
            <canvas onMouseMove={this.getCoordenate} ref={this.canvas}></canvas>
          </Container>
        </Container>
        <Container className="pt-4">
          <Row>
            <Col md="8" >
              {this.renderNewDiscussionButtion()}

              <FeedBox
                type='general'
                loading={fetchingDiscussions}
                discussions={discussions}
                currentForum={currentForum}
                onChangeSortingMethod={this.handleSortingChange.bind(this)}
                activeSortingMethod={sortingMethod}
              />


            </Col>
            <Col md="4">
              <section className="forum-feed__social d-flex justify-content-around pr-4 pl-4 pb-4">
                <span className="fa-stack fa-lg">
                  <i className="fa fa-circle facebook fa-stack-2x"></i>
                  <i className="fa fa-facebook fa-stack-1x fa-inverse"></i>
                </span>
                <span className="fa-stack fa-lg ">
                  <i className="fa fa-circle linkedin fa-stack-2x"></i>
                  <i className="fa fa-linkedin fa-stack-1x fa-inverse"></i>
                </span>
                <span className="fa-stack fa-lg ">
                  <i className="fa fa-circle twitter fa-stack-2x"></i>
                  <i className="fa fa-twitter fa-stack-1x fa-inverse"></i>
                </span>
                <span className="fa-stack fa-lg">
                  <i className="fa fa-circle fa-stack-2x"></i>
                  <i className="fa fa fa-envelope fa-stack-1x fa-inverse"></i>
                </span>
                <span className="fa-stack fa-lg">
                  <i className="fa fa-circle fa-stack-2x"></i>
                  <i className="fa fa-print fa-stack-1x fa-inverse"></i>
                </span>
                <span className="fa-stack fa-lg">
                  <i className="fa fa-circle fa-stack-2x"></i>
                  <i className="fa fa-user-plus fa-stack-1x fa-inverse"></i>
                </span>

              </section>
              <Card className="mb-3">
                <Card.Header><h5>Mosaic Overview</h5></Card.Header>
                <Card.Body>

                  <Card.Text className="small mb-3">
                    {this.state.currentForumObj ? <ImageBootstrap src={'data:image/jpeg;base64, ' + this.state.currentForumObj.base64} fluid /> : null}
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc et nibh a risus sodales faucibus id sed nulla. Nam erat mi, volutpat id lobortis in, congue nec ante. Proin eu enim sed enim molestie accumsan fermentum at nisi. Donec et ultrices nulla. In et euismod odio, in consectetur tellus. Maecenas a vulputate orci. Proin venenatis hendrerit urna.


                  </Card.Text>

                </Card.Body>
              </Card>
              <Card>
                <Card.Header><h5>About the Moderator</h5></Card.Header>
                <Card.Body>
                  <section className="moderator-card d-flex">
                    <div className="moderator-card__img-container w-25">
                      {this.state.currentForumObj && this.state.currentForumObj.admin ? <ImageBootstrap src={this.state.currentForumObj.admin.avatarUrl} fluid /> : null}
                    </div>
                    <div className="w-75">
                      <div className="w-100">
                        <strong>NAME: </strong>

                        <p className="mb-0"> {this.state.currentForumObj && this.state.currentForumObj.admin ? this.state.currentForumObj.admin.name : null}</p>
                      </div>

                      <div className="w-100">
                        <strong>Nunc et nibh:</strong>
                        <p>a risus sodales faucibus id sed nulla. </p>
                      </div>
                    </div>

                  </section>
                  <Card.Text className="small mb-3">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc et nibh a risus sodales faucibus id sed nulla. Nam erat mi, volutpat id lobortis in, congue nec ante. Proin eu enim sed enim molestie accumsan fermentum at nisi. Donec et ultrices nulla. In et euismod odio, in consectetur tellus. Maecenas a vulputate orci. Proin venenatis hendrerit urna.
                  </Card.Text>

                </Card.Body>
              </Card>
            </Col>

          </Row>

        </Container>

        <Modal size="xl" show={this.state.showModal} onHide={this.closeModal}>
          <Modal.Header closeButton>
          </Modal.Header>
          <Modal.Body className="text-center">
            <div className="tile-image-container"
              style={{
                height: '100%',
                backgroundImage: 'url("data:image/jpeg;base64, ' + this.state.imageOnModal + '")',
                backgroundRepeat: 'no-repeat',
                backgroundSize: 'contain',
                backgroundPosition: 'center',
              }}></div>
          </Modal.Body>
          <Modal.Footer>
            <ButtonBootstrap variant="secondary" onClick={this.closeModal}>
              Close
        </ButtonBootstrap>
          </Modal.Footer>
        </Modal>
      </section>
    );
  }
}

export default connect(
  (state) => {
    return {
      currentForum: state.app.currentForum,
      currentForumId: () => {
        const currentForumObj = _.find(state.app.forums, { forum_slug: state.app.currentForum });
        if (currentForumObj) return currentForumObj._id;
        else return null;
      },
      getCurrentForum: () => {
        const currentForumObj = _.find(state.app.forums, { forum_slug: state.app.currentForum });
        if (currentForumObj) return currentForumObj;
        else return null;
      },
      fetchingDiscussions: state.feed.fetchingDiscussions,
      discussions: state.feed.discussions,
      fetchingPinnedDiscussions: state.feed.fetchingPinnedDiscussions,
      sortingMethod: state.feed.sortingMethod,
      error: state.feed.error,
    };
  },
  (dispatch) => {
    return {
      getDiscussions: (currentForumId, feedChanged, sortingMethod, sortingChanged) => { dispatch(getDiscussions(currentForumId, feedChanged, sortingMethod, sortingChanged)); },

      updateSortingMethod: (method) => { dispatch(updateSortingMethod(method)); },
    };
  }
)(ForumFeed);
