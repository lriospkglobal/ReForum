import React, { Component } from 'react';
import { Link } from 'react-router';
import Moment from 'moment';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import NewDiscussion from '../NewDiscussion/index';
import _ from 'lodash';
import axios from 'axios';
import { Button as ButtonBootstrap, Container, Modal, Image as ImageBootstrap, Popover, Col, Row, Card } from 'react-bootstrap';
import SingleDiscussion from '../../Views/SingleDiscussion';
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
      showDiscussionModal: false,
      showPopover: false,
      lgShow: false,
      currentDiscussion: null
    }
    this.canvas = React.createRef()
  }

  setImageModalPopover = (imgName) => {
    this.setState({ imageOnModal: this.state.loadedEncodedImages[imgName], loadingImage: false })
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

  clickedTile = (e) => {
    const {
      discussions
    } = this.props;
    const el = e.target;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    let matchedDiscussion;
    //this.getIndividualImage(xCanvas, yCanvas)
    for (let attr in this.state.coordinates) {
      const imageCoordinates = attr.split('-')
      const imageCoordinatesX = parseInt(imageCoordinates[0])
      const imageCoordinatesY = parseInt(imageCoordinates[1])
      if ((x >= imageCoordinatesX && x <= (imageCoordinatesX + this.state.tileSize)) && (y >= imageCoordinatesY && y <= (imageCoordinatesY + this.state.tileSize))) {
        const tileId = this.state.coordinates[attr]
        for (let i = 0; i < discussions.length; i++) {
          const discussion = discussions[i];
          if (discussion.tile_id === tileId) {
            matchedDiscussion = discussion;
            break;
          }
        }
      }



    }
    this.setState({ currentDiscussion: matchedDiscussion, lgShow: true })


  }

  getCoordenate = (e) => {
    const el = e.target
    const rect = el.getBoundingClientRect()
    const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop
    const top = rect.top + scrollTop
    const left = rect.left + scrollLeft
    const xCanvas = e.clientX - rect.left;
    const yCanvas = e.clientY - rect.top;
    this.setState({ x: left + xCanvas, y: top + yCanvas, showPopover: true }, () => this.getIndividualImage(xCanvas, yCanvas))

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

  timeDisplay = () => {
    const postTime = Moment(this.state.currentDiscussion.date);
    return postTime.from(Moment());
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

                  <div >

                    <ButtonBootstrap className="camera" onClick={() => this.setState({ showDiscussionModal: true })}>
                      Post a Photo
          </ButtonBootstrap>



                  </div>
                </div>
              </div>
            </section>

            {this.state.showPopover && (this.state.x && this.state.y) ? <Popover placement="right"
              style={{ top: this.state.y + 'px', left: this.state.x + 'px' }}
            >

              <Popover.Content>
                {this.state.loadingImage ? <div className="d-flex mt-2 justify-content-center align-items-center"><div className="spinner-border" role="status">
                  <span className="sr-only">Loading...</span>
                </div></div> : <ImageBootstrap src={'data:image/jpeg;base64, ' + this.state.imageOnModal} thumbnail />}


              </Popover.Content>
            </Popover> : null}

            <canvas
              style={{ display: (this.state.currentForumObj && this.state.currentForumObj.mosaic) ? 'block' : 'none' }}
              onMouseOut={() => this.setState({
                showPopover: false,
                x: null, y: null
              })}
              onClick={this.clickedTile}
              onMouseMove={this.getCoordenate} ref={this.canvas}></canvas>
          </Container>
        </Container>
        <Container className="pt-4">
          <Row>
            <Col md="8" >
              <ButtonBootstrap className="camera" onClick={() => this.setState({ showDiscussionModal: true })}>
                Post a Photo
          </ButtonBootstrap>

              <FeedBox
                type='general'
                loading={fetchingDiscussions}
                discussions={discussions}
                currentForum={currentForum}
                onChangeSortingMethod={this.handleSortingChange.bind(this)}
                activeSortingMethod={sortingMethod}
                setDiscussionOpenModal={this.setDiscussionOpenModal}
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
        {this.state.currentDiscussion && <Modal

          size="xl"
          show={this.state.lgShow}
          onHide={() =>
            this.setState({ lgShow: false, currentDiscussion: null })

          }
          aria-labelledby="example-modal-sizes-title-lg"
        >

          <Modal.Body className="p-0 d-flex">
            <div className="w-75 modal-image" style={{ backgroundImage: 'url(' + 'data:image/jpeg;base64,' + this.state.currentDiscussion.base64 + ')' }}>

            </div>
            <div className="w-25 p-3">
              <section className="discussion-box__header d-flex mb-3">


                <ImageBootstrap src={this.state.currentDiscussion.user.avatarUrl} roundedCircle />
                <div className="d-flex flex-column justify-content-center">
                  <span>{this.state.currentDiscussion.user.name || this.state.currentDiscussion.user.username} </span>
                  <span className="text-muted">{this.state.currentDiscussion && this.timeDisplay()}</span>
                </div>
              </section>
              <SingleDiscussion discussionSlug={this.state.currentDiscussion.discussion_slug} />
            </div>
          </Modal.Body>
        </Modal>}
        <Modal className="new-discussion-modal" show={this.state.showDiscussionModal} size="xl" onHide={() => this.setState({ showDiscussionModal: false })}>
          <Modal.Header closeButton>
            <Modal.Title>Post a Photo</Modal.Title>
          </Modal.Header>
          <Modal.Body className="p-0">
            <NewDiscussion closeModal={() => this.setState({ showDiscussionModal: false })} successCallback={this.successCallback} />
          </Modal.Body>

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
