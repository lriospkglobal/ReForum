import React, { Component } from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import classnames from 'classnames';
import axios from 'axios';
import { Button as ButtonBootstrap, Modal, Image as ImageBootstrap, Popover } from 'react-bootstrap';

import {
  getDiscussions,
  getPinnedDiscussions,
  updateSortingMethod,
} from './actions';

import Button from 'Components/Button';
import FeedBox from 'Components/FeedBox';
import SideBar from 'Components/SideBar';

import appLayout from 'SharedStyles/appLayout.css';
import styles from './styles.css';

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
      currentForumId: null
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

        if (Object.keys(this.state.loadedEncodedImages).includes(imgName)) {

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
        }, () => this.getIndividualImage(x, y))
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
      getPinnedDiscussions,
      getCurrentForum

    } = this.props;

    // get the discussions and pinned discussions
    getDiscussions(currentForumId());
    getPinnedDiscussions(currentForumId());
    const currentForumObj = getCurrentForum();
    if (currentForumObj && currentForumObj.mosaic) {
      console.log('draw')
      this.setState({ currentForumId: currentForumObj._id }, () => this.drawImage(currentForumObj))

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
      getPinnedDiscussions(currentForumId(), feedChanged);

      const currentForumObj = getCurrentForum();
      if (currentForumObj && currentForumObj.mosaic) {
        console.log('draw')
        this.setState({ currentForumId: currentForumObj._id }, () => this.drawImage(currentForumObj))

      }


    }
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
      <div className={classnames(appLayout.showOnMediumBP, styles.newDiscussionBtn)}>
        <Link to={`/${currentForum}/new_discussion`}>
          <Button type='outline' fullWidth noUppercase>
            New Discussion
          </Button>
        </Link>
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
        <div className={classnames(styles.errorMsg)}>
          {error}
        </div>
      );
    }

    return (
      <div className={classnames(appLayout.constraintWidth, styles.contentArea)}>
        <style dangerouslySetInnerHTML={{
          __html: `
    .modal-dialog.modal-xl{
        height: calc( 100% - 3.75rem );
    }
    .modal-content{
        height: 100%;
    }
    .modal{
        z-index: 1065;
    }
    .modal-backdrop{
        z-index: 1065;
    }
    .popover{
        max-width: 100px;
    }

`
        }} />
        <Helmet><title>{`ReForum | ${currentForum}`}</title></Helmet>

        <div className={appLayout.primaryContent}>
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
          <FeedBox
            type='pinned'
            loading={fetchingPinnedDiscussions}
            discussions={pinnedDiscussions}
            currentForum={currentForum}
          />

          <FeedBox
            type='general'
            loading={fetchingDiscussions}
            discussions={discussions}
            currentForum={currentForum}
            onChangeSortingMethod={this.handleSortingChange.bind(this)}
            activeSortingMethod={sortingMethod}
          />

          {this.renderNewDiscussionButtion()}
        </div>

        <div className={appLayout.secondaryContent}>
          <SideBar currentForum={currentForum} />
        </div>
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
      </div>
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
      pinnedDiscussions: state.feed.pinnedDiscussions,
      error: state.feed.error,
    };
  },
  (dispatch) => {
    return {
      getDiscussions: (currentForumId, feedChanged, sortingMethod, sortingChanged) => { dispatch(getDiscussions(currentForumId, feedChanged, sortingMethod, sortingChanged)); },
      getPinnedDiscussions: (currentForumId, feedChanged) => { dispatch(getPinnedDiscussions(currentForumId, feedChanged)); },
      updateSortingMethod: (method) => { dispatch(updateSortingMethod(method)); },
    };
  }
)(ForumFeed);
