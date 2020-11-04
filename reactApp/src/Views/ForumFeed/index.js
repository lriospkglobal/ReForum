import React, { Component } from 'react';
import { Link } from 'react-router';
import Moment from 'moment';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import NewDiscussion from '../NewDiscussion/index';
import TextEdit from '../../Components/TextEdit/index';
import CheckBoxEdit from '../../Components/CheckBoxEdit/index';

import _ from 'lodash';
import axios from 'axios';
import { OverlayTrigger, Tooltip, Button as ButtonBootstrap, Container, Modal, Image as ImageBootstrap, Carousel, Popover, Col, Row, Card } from 'react-bootstrap';
import SingleDiscussion from '../../Views/SingleDiscussion';
import {
  getDiscussions,
  updateSortingMethod,
  stopLoading,
  updateForum
} from './actions';

import camera from '../../App/img/camera-icon.svg';
import comingSoon from '../../App/img/comingSoon.png';
import pencilWhite from '../../App/img/pencil-white.svg';
import pencilBlack from '../../App/img/pencil-black.svg';
import FeedBox from '../../Components/FeedBox';
import SideBar from '../../Components/SideBar';

let id, insidePopUp, xCanvas, yCanvas
let loadedEncodedImages = {}

class ForumFeed extends Component {
  constructor(props) {
    super(props)
    this.state = {
      loading: false,
      canvasHeight: 0,
      canvasWidth: 0,
      coordinates: null,
      imageOnModal: '',
      showUploadTilesButton: false,
      showUploadMosaicImageButton: false,
      toUploadTilesList: null,
      toUploadMosaicList: null,
      showSuccessMessage: false,
      successMessage: '',
      tileSize: null,
      tileSizeOriginal: null,
      previousMosaics: [],
      quality: 100,
      showTooltip: false,
      currentForumId: null,
      showDiscussionModal: false,
      showPopover: false,
      lgShow: false,
      currentDiscussion: null,
      highlights: false,
      widthGrowth: null,
      loadingPreviousMosaics: false,
      prevMosaicImage: null,
      vertical: { width: '200px', height: '280px' },
      horizontal: { width: '280px', height: '200px' },
      popupOrientation: null,
      viewLock: false,
      insidePopUp: false,
      xCanvas: null,
      yCanvas: null


    }
    this.canvas = React.createRef()
    this.popover = React.createRef()
  }

  setImageModalPopover = (imgName) => {

    if (loadedEncodedImages[imgName]) {
      const image = new Image()

      image.onload = () => {

        let popupOrientation

        if (image.width > image.height) {
          popupOrientation = this.state.horizontal

        } else
          popupOrientation = this.state.vertical
        this.setState({
          imageOnModal: loadedEncodedImages[imgName],
          loadingImage: false,
          popupOrientation
        }, () => {
          if (this.popover.current) {

            if (this.popover.current.getBoundingClientRect().right > window.innerWidth) {
              const regex = /\D/g
              this.popover.current.style.left = (parseInt(this.popover.current.style.left.replace(regex, '')) - this.popover.current.offsetWidth) - 40 + 'px'

            }

            this.setState({ showPopover: true })

          }
        })

      }

      image.src = 'data:image/jpeg;base64, ' + loadedEncodedImages[imgName]

    }

  }


  requestImage = (imgName, cb) => {
    this.setState({ loadingImage: true }, () => {
      axios.get('/api/forum/tile?tileFileName=' + imgName + '&forumId=' + this.state.currentForumId).then(response => {
        loadedEncodedImages = {
          ...loadedEncodedImages,
          [imgName]: response.data.base64

        }
        cb()
      }).catch(e => console.error(e))
    })
  }
  getIndividualImage = (x, y) => {

    let imgName
    for (let attr in this.state.coordinates) {

      const imageCoordinates = attr.split('-')
      const imageCoordinatesX = parseInt(imageCoordinates[0])
      const imageCoordinatesY = parseInt(imageCoordinates[1])
      if ((x >= imageCoordinatesX && x <= (imageCoordinatesX + this.state.tileSize)) && (y >= imageCoordinatesY && y <= (imageCoordinatesY + this.state.tileSize))) {
        imgName = this.state.coordinates[attr]

        if (Object.keys(loadedEncodedImages).includes(imgName) && loadedEncodedImages[imgName]) {

          this.setImageModalPopover(imgName)
        } else {


          this.requestImage(imgName, () => this.setImageModalPopover(imgName))

        }


        break
      }

    }
    if (this.state.highlights)
      this.highlightArea(imgName)

  }

  highlightArea = (imgName) => {
    const context = this.canvas.current.getContext('2d')
    for (let attr in this.state.coordinates) {
      const imgNameFromCoordinates = this.state.coordinates[attr]
      const imageCoordinates = attr.split('-')
      const imageCoordinatesX = parseInt(imageCoordinates[0])
      const imageCoordinatesY = parseInt(imageCoordinates[1])
      const size = Math.ceil(this.state.tileSize)
      context.clearRect(imageCoordinatesX, imageCoordinatesY, size, size)
      if (imgName === imgNameFromCoordinates) {

        context.fillStyle = '#4ed164';
        context.fillRect(imageCoordinatesX, imageCoordinatesY, size, size)
      }
    }

  }

  clickedTile = (e) => {
    let { discussions, currentForumId } = this.props;
    const forumId = currentForumId()
    if (discussions && discussions[forumId]) {
      discussions = discussions[forumId]
      const el = e ? e.target : this.canvas.current;
      const rect = el.getBoundingClientRect();
      //const x = e.clientX - rect.left;
      //const y = e.clientY - rect.top;
      const x = this.state.xCanvas;
      const y = this.state.yCanvas;
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




  }



  getCoordenate = (e) => {

    const el = e.target
    const rect = el.getBoundingClientRect()
    const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop
    let top = rect.top + scrollTop
    let left = rect.left + scrollLeft

    //for popup adjustment
    top = top - 16
    left = left + 11

    xCanvas = e.clientX - rect.left
    yCanvas = e.clientY - rect.top



    this.setState({ x: left + xCanvas, y: top + yCanvas, xCanvas, yCanvas, showPopover: false }, () => this.getIndividualImage(xCanvas, yCanvas))



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
        tileSize: parseInt(currentForumObj.mosaic.tile_size),
        tileSizeOriginal: parseInt(currentForumObj.mosaic.tile_size),
      }
      //added pixels for full width
      const style = window.getComputedStyle(that.canvas.current.parentElement, null)
      const regex = /\D/g
      //canvas container width
      let canvasContainerWidth = parseFloat(style.getPropertyValue("width").replace(regex, ''))
      //rest 5px each horizontal side for white background (borders)
      canvasContainerWidth = canvasContainerWidth - 10
      const nTilesWidth = state.canvasWidth / state.tileSize
      const widthGrowth = (canvasContainerWidth - state.canvasWidth) / nTilesWidth

      state.widthGrowth = widthGrowth
      if (state.widthGrowth > 0) {
        state.ratioFactor = state.canvasHeight / state.canvasWidth
        state.newHeight = state.ratioFactor * canvasContainerWidth
        state.tileSize = state.tileSize + state.widthGrowth

        const newCoordinates = {}
        for (let attr in state.coordinates) {

          const imageCoordinates = attr.split('-')
          let imageCoordinatesX = parseInt(imageCoordinates[0])
          let imageCoordinatesY = parseInt(imageCoordinates[1])

          if (imageCoordinatesX !== 0) {
            const multiplierX = imageCoordinatesX / state.tileSizeOriginal
            imageCoordinatesX = multiplierX * state.tileSize
          }
          if (imageCoordinatesY !== 0) {
            const multiplierY = imageCoordinatesY / state.tileSizeOriginal
            imageCoordinatesY = multiplierY * state.tileSize
          }
          newCoordinates[imageCoordinatesX + '-' + imageCoordinatesY] = state.coordinates[attr]

        }
        state.coordinates = newCoordinates

      }



      that.setState(state, () => {
        that.canvas.current.width = state.widthGrowth > 0 ? canvasContainerWidth : that.state.canvasWidth
        that.canvas.current.height = state.widthGrowth > 0 ? state.newHeight : that.state.canvasHeight

        context.drawImage(this, 0, 0, state.widthGrowth > 0
          ? canvasContainerWidth : that.state.canvasWidth,
          state.widthGrowth > 0 ? state.newHeight : that.state.canvasHeight)


        if (that.props.location.query.tileId) {
          that.openFromUrl(that.props.location.query.tileId)
        }



      })

    }

    img.src = 'data:image/jpeg;base64,' + currentForumObj.mosaic.base64
    this.canvas.current.style.backgroundImage = 'url(' + 'data:image/jpeg;base64,' + currentForumObj.mosaic.base64 + ')'
  }

  openFromUrl = (tileId) => {

    let coordinates

    for (let attr in this.state.coordinates) {
      if (this.state.coordinates[attr] === tileId) {
        coordinates = attr

        break
      }

    }
    if (coordinates) {

      const imgName = this.state.coordinates[coordinates]
      const imageCoordinates = coordinates.split('-')
      const imageCoordinatesX = parseInt(imageCoordinates[0])
      const imageCoordinatesY = parseInt(imageCoordinates[1])

      const el = this.canvas.current
      const rect = el.getBoundingClientRect()
      const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop
      let top = rect.top + scrollTop
      let left = rect.left + scrollLeft
      //for popup adjustment
      top = top - 16
      left = left + 11



      this.setState({
        x: imageCoordinatesX + left, y: imageCoordinatesY + top, showPopover: true, highlights: true, viewLock: true,
        xCanvas: imageCoordinatesX, yCanvas: imageCoordinatesY
      }, () => {
        if (Object.keys(loadedEncodedImages).includes(imgName) && loadedEncodedImages[imgName])
          this.setImageModalPopover(imgName)
        else
          this.requestImage(imgName, () => this.setImageModalPopover(imgName))

        this.highlightArea(imgName)
        this.canvas.current.scrollIntoView()
      })


    }
  }

  getPreviousMosaics = () => {
    this.setState({ loadingPreviousMosaics: true }, () => {
      axios.get(`/api/forum/${this.state.currentForumId}/past-mosaics`)
        .then(response => {
          const previousMosaics = response.data.previousMosaics
          let steps = response.data.steps
          if (previousMosaics.length) {
            steps = steps.slice(previousMosaics.length, steps.length)
          }
          const empty = steps.map(x => {
            return { _id: x, nTiles: x };
          });



          this.setState({
            previousMosaics: [...previousMosaics, ...empty], loadingPreviousMosaics: false

          })
        })

    })

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

          this.setState({ currentForumId: currentForumObj._id }, () => {
            this.drawImage(currentForumObj)
            this.getPreviousMosaics()
          })
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
      getCurrentForum,
      stopLoading
    } = this.props;


    // get the discussions again
    // if the forum didn't match
    if (prevProps.currentForum !== currentForum) {
      stopLoading()
      const feedChanged = true;
      getDiscussions(currentForumId(), feedChanged);


      const currentForumObj = getCurrentForum();

      if (currentForumObj) {

        this.setState({
          currentForumObj
        }, () => {
          const currentForumId = currentForumObj._id
          if (currentForumObj.mosaic) {
            this.setState({ currentForumId }, () => {
              this.drawImage(currentForumObj)
              this.getPreviousMosaics()
            })
          } else
            this.setState({ currentForumId, previousMosaics: [] })


        })


      }


    }
  }

  successCallback = () => {
    window.location = "/" + this.props.currentForum
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
  clearAllHighlights = () => {
    if (this.state.highlights) {
      const context = this.canvas.current.getContext('2d')
      for (let attr in this.state.coordinates) {

        const imageCoordinates = attr.split('-')
        const imageCoordinatesX = parseInt(imageCoordinates[0])
        const imageCoordinatesY = parseInt(imageCoordinates[1])
        const size = Math.ceil(this.state.tileSize)
        context.clearRect(imageCoordinatesX, imageCoordinatesY, size, size)

      }
    }


  }

  timeDisplay = () => {
    const postTime = Moment(this.state.currentDiscussion.date);
    return postTime.from(Moment());
  }

  checkPopoverLeft = () => {
    const canvas = this.canvas.current

    const popover = this.popover.current

    if (canvas && popover) {
      const rectPopover = popover.getBoundingClientRect()
      const leftPopover = rectPopover.left
      return this.state.x > leftPopover
    } else return false

  }

  moving = (e) => {
    clearTimeout(id)
    id = setTimeout(() => {
      if (!insidePopUp)
        this.getCoordenate(e)

    }, 500)



  }

  getPercent = () => {
    let { discussions, currentForumId } = this.props;
    const forumId = currentForumId()
    if (discussions && discussions[forumId]) {
      discussions = discussions[forumId]
      return discussions.length * 100 / 1000
    }
    else return 0
  }

  changeForumAttribute = (value, attr, pastMosaics) => {
    this.props.updateForum(this.state.currentForumId, { [attr]: value }, () => {
      if (pastMosaics) this.getPreviousMosaics()

    })

  }

  render() {
    const {
      currentForum,
      fetchingDiscussions,
      pinnedDiscussions,
      fetchingPinnedDiscussions,
      sortingMethod,
      error,
      currentForumId,
      role
    } = this.props;

    let { discussions } = this.props;

    const forumId = currentForumId()
    if (discussions && discussions[forumId])
      discussions = discussions[forumId]

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
              <div className="d-flex align-items-center">

                <h1><strong>Community Photo Mosaic:&nbsp;
                {(this.state.currentForumObj && this.state.currentForumObj.forum_name) ?



                    < TextEdit text={this.state.currentForumObj.forum_name} attr={'forum_name'} role={role} callback={this.changeForumAttribute} styleClass="" />


                    : ''}

                </strong></h1>
                {(role && role === 'admin') && <OverlayTrigger
                  key={'top'}
                  placement={'top'}
                  overlay={
                    <Tooltip >
                      As an admin you can edit the mosaic title (double click on text to edit, enter to save changes or esc to exit).
                    </Tooltip>
                  }
                >
                  <ImageBootstrap className="ml-3 pencil" src={pencilWhite} />
                </OverlayTrigger>}


              </div>
              <div className="d-flex flex-wrap mt-4">
                <div className="w-100 align-items-center d-flex">
                  <strong >
                    Directions
                </strong>
                  {(role && role === 'admin') && <OverlayTrigger
                    key={'top'}
                    placement={'top'}
                    overlay={
                      <Tooltip >
                        As an admin you can edit directions section (double click on text to edit, enter to save changes or esc to exit).
                    </Tooltip>
                    }
                  >
                    <ImageBootstrap className="ml-3 pencil" src={pencilWhite} />
                  </OverlayTrigger>}
                </div>
                <div className="w-75 pr-5">


                  {(this.state.currentForumObj && this.state.currentForumObj.forum_directions) ?



                    < TextEdit text={this.state.currentForumObj.forum_directions} attr={'forum_directions'} role={role} callback={this.changeForumAttribute} styleClass="" />


                    : ''}

                </div>
                <div className="w-25 overflow-auto">
                  {(role && role === 'moderator') && <OverlayTrigger placement={'top'}
                    overlay={
                      <Tooltip>
                        As a moderator you can post photos.
        </Tooltip>
                    }>
                    <ButtonBootstrap className="camera float-right" >
                      Post a Photo
          </ButtonBootstrap>
                  </OverlayTrigger>}


                  <ButtonBootstrap className="camera float-right" onClick={() => this.setState({ showDiscussionModal: true })}>
                    Post a Photo
          </ButtonBootstrap>




                </div>
              </div>
              <section className="pt-2 pb-2 d-flex justify-content-between">
                <div className="d-flex align-items-center">
                  <input className={(this.state.currentForumObj && this.state.currentForumObj.mosaic ? 'visible ' : 'invisible ') + 'apple-switch mr-4'} checked={this.state.highlights} onChange={() => this.setState({ highlights: !this.state.highlights })} type="checkbox" /> <strong className={(this.state.currentForumObj && this.state.currentForumObj.mosaic ? 'visible ' : 'invisible ')}>Highlight duplicate photos on rollover</strong>
                </div>
                <div className="d-flex align-items-center">
                  <strong>Photos Posted: </strong>
                  <div className="status-bar ml-2 d-flex justify-content-center align-items-center">
                    {discussions && <span style={{ left: 'calc( ' + this.getPercent() + '% - 10px )' }} className="count">{discussions.length}</span>}
                    {!discussions && <small className="text-dark">loading...</small>}
                    <span style={{ width: this.getPercent() + '%' }} className="fill"></span>
                  </div>
                </div>
              </section>
            </section>

            <Popover
              onMouseMove={() => {

                insidePopUp = true
              }} onMouseOut={() => {
                insidePopUp = false

              }}
              onClick={this.clickedTile}
              className={(this.state.showPopover && (this.state.x && this.state.y) ? 'visible' : 'invisible') + (this.checkPopoverLeft() ? ' left' : '')}
              style={{ top: this.state.y + 'px', left: this.state.x + 'px', ...this.state.popupOrientation }} ref={this.popover}

            >

              <Popover.Content >
                {this.state.loadingImage ? <div className="d-flex mt-2 justify-content-center align-items-center"><div className="spinner-border" role="status">
                  <span className="sr-only">Loading...</span>
                </div></div> : <div className="image-container" style={{ backgroundImage: 'url(' + 'data:image/jpeg;base64,' + this.state.imageOnModal + ')' }} ></div>}


              </Popover.Content>
            </Popover>
            <section className="canvas-background-wrapper w-100"
              style={{
                display: (this.state.currentForumObj && this.state.currentForumObj.mosaic) ? 'block' : 'none',
                height: (this.state.newHeight || this.state.canvasHeight) + 10 + 'px'
              }}>
              <div className="canvas-background"></div>

              <canvas
                className="canvas"
                style={{ display: (this.state.currentForumObj && this.state.currentForumObj.mosaic) ? 'block' : 'none' }}
                onMouseOut={this.state.viewLock ? null : () => {

                  setTimeout(200, () => {

                    if (!insidePopUp) {
                      this.setState({
                        showPopover: false,
                        x: null, y: null
                      }, () => this.clearAllHighlights())
                    }
                  })

                }}
                onClick={this.clickedTile}
                onMouseMove={(e) => this.state.viewLock ? null : this.moving(e)} ref={this.canvas}></canvas>

            </section>

            <div className={(this.state.loadingPreviousMosaics ? 'd-block' : 'd-none') + " spinner-grow text-light mt-4 mb-3"} role="status">
              <span className="sr-only">Loading...</span>
            </div>

            <div className={(this.state.loadingPreviousMosaics ? 'd-none' : 'd-block')}>
              {(this.state.previousMosaics) ? <section className="previous-mosaics mt-4 mb-3">
                <h5 className="w-100 text-white d-flex justify-content-center mb-3"><strong>View images of the mosaic at different stages of development:</strong></h5>
                <CheckBoxEdit attr={'mosaic_progress_steps'} callback={this.changeForumAttribute} previousMosaics={this.state.previousMosaics} role={role} />



              </section> : null}
            </div>




          </Container>
        </Container>
        <Container className="pt-4">
          <Row>
            <Col md="8" >
              <div className="mb-4 d-flex justify-content-between">
                <ButtonBootstrap className="camera" onClick={() => this.setState({ showDiscussionModal: true })}>
                  Post a Photo
          </ButtonBootstrap>

                {(role && role === 'admin') && <OverlayTrigger placement={'top'}
                  overlay={
                    <Tooltip>
                      As an admin you can comment from this section.
        </Tooltip>
                  }>
                  <ButtonBootstrap >
                    Comment
          </ButtonBootstrap>
                </OverlayTrigger>}


                {(role && role === 'admin') && <OverlayTrigger placement={'top'}
                  overlay={
                    <Tooltip>
                      As an admin you can filter posts.
        </Tooltip>
                  }>
                  <label className="d-flex align-items-center">
                    Filter
                  <select className="select ml-3">

                      <option>Pending</option>
                      <option>Approved</option>
                      <option>Reported</option>
                      <option>Featured</option>
                      <option>Pinned</option>

                    </select>
                  </label>
                </OverlayTrigger>}

                <OverlayTrigger placement={'top'}
                  overlay={
                    <Tooltip>
                      Sort by kudos.
        </Tooltip>
                  }>
                  <label className="d-flex align-items-center">
                    Sort
                  <select className="select ml-3">

                      <option defaultValue>Newest</option>
                      <option>Oldest</option>
                      <option>User Name</option>
                      <option>Camera Type</option>
                      <option>Time of Day</option>


                    </select>
                  </label>
                </OverlayTrigger>
              </div>

              <FeedBox
                type='general'
                loading={fetchingDiscussions}
                discussions={discussions ? discussions : []}
                currentForum={currentForum}
                onChangeSortingMethod={this.handleSortingChange.bind(this)}
                activeSortingMethod={sortingMethod}
                setDiscussionOpenModal={this.setDiscussionOpenModal}
                openFromUrl={this.openFromUrl}
              />


            </Col>
            <Col md="4">
              <OverlayTrigger placement={'top'}
                overlay={
                  <Tooltip>
                    Share on social media.
        </Tooltip>
                }>
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
              </OverlayTrigger>
              <Card className="mb-3 gray">
                <Card.Header className="text-center"><h5 className="d-inline">Mosaic Overview</h5>{(role && role === 'admin') && <OverlayTrigger placement={'top'}
                  overlay={
                    <Tooltip>
                      As an admin you can edit the mosaic overview (double click on text to edit, enter to save changes or esc to exit).
        </Tooltip>
                  }>
                  <ImageBootstrap className="float-right pencil" src={pencilBlack} />
                </OverlayTrigger>}</Card.Header>
                <Card.Body>

                  <Card.Text className="small mb-3">
                    {this.state.currentForumObj ? <ImageBootstrap src={'data:image/jpeg;base64, ' + this.state.currentForumObj.base64} fluid /> : null}
                    {(this.state.currentForumObj && this.state.currentForumObj.forum_description) ?
                      < TextEdit text={this.state.currentForumObj.forum_description} attr={'forum_description'} role={role} callback={this.changeForumAttribute} styleClass="" />
                      : ''}


                  </Card.Text>

                </Card.Body>
              </Card>
              <Card className="gray">
                <Card.Header className="text-center">
                  <h5 className="d-inline">About the Moderator</h5>
                  {(role && role === 'admin') && <OverlayTrigger placement={'top'}
                    overlay={
                      <Tooltip>
                        As an admin you can edit the moderator info (double click on text to edit, enter to save changes or esc to exit).
        </Tooltip>
                    }>
                    <ImageBootstrap className="float-right pencil" src={pencilBlack} />
                  </OverlayTrigger>}
                </Card.Header>
                <Card.Body>
                  <section className="moderator-card d-flex">
                    <div className="moderator-card__img-container w-25">
                      {this.state.currentForumObj && this.state.currentForumObj.mentor_base64 ? <ImageBootstrap src={this.state.currentForumObj.mentor_base64} fluid /> : null}
                    </div>
                    <div className="w-75">
                      <div className="w-100">
                        <strong>NAME: </strong>

                        <p className="mb-0"> {this.state.currentForumObj && this.state.currentForumObj.mentor_name ?

                          < TextEdit text={this.state.currentForumObj.mentor_name} attr={'mentor_name'} role={role} callback={this.changeForumAttribute} styleClass="" />
                          : null}</p>
                      </div>


                    </div>

                  </section>
                  <Card.Text className="small mb-3">
                    {this.state.currentForumObj && this.state.currentForumObj.mentor_biography ?
                      < TextEdit text={this.state.currentForumObj.mentor_biography} attr={'mentor_biography'} role={role} callback={this.changeForumAttribute} styleClass="" /> : ''}
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
            <div className="w-70 modal-image" style={{ backgroundImage: 'url(' + 'data:image/jpeg;base64,' + this.state.currentDiscussion.base64 + ')' }}>

            </div>
            <div className="w-40 p-3">
              <section className="discussion-box__header d-flex mb-3">


                <ImageBootstrap src={this.state.currentDiscussion.user.avatarUrl} roundedCircle />

                <div className="d-flex flex-column justify-content-center">
                  <span>{this.state.currentDiscussion.user.name || this.state.currentDiscussion.user.username} </span>
                  <span className="text-muted">{this.state.currentDiscussion && this.timeDisplay()}</span>
                </div>
                <button
                  onClick={() =>
                    this.setState({ lgShow: false, currentDiscussion: null })

                  }
                  className="close"><span>×</span><span className="sr-only">Close</span></button>
              </section>
              <SingleDiscussion discussionSlug={this.state.currentDiscussion.discussion_slug} />
            </div>
          </Modal.Body>
        </Modal>}



        <Modal className="new-discussion-modal" show={this.state.showDiscussionModal} size="xl" onHide={() => this.setState({ showDiscussionModal: false })}>
          <Modal.Header closeButton>
            <Modal.Title className="d-flex align-items-center"><ImageBootstrap src={camera} className="mr-2" /><strong>Post a Photo</strong></Modal.Title>
          </Modal.Header>
          <Modal.Body className="p-0">
            <NewDiscussion closeModal={() => this.setState({ showDiscussionModal: false })} pillar={this.state.currentForumObj ? this.state.currentForumObj.pillar : ''} successCallback={this.successCallback} />
          </Modal.Body>

        </Modal>
      </section>
    );
  }
}

export default connect(
  (state) => {
    return {
      role: state.user.role,
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
      updateForum: (id, toUpdate, cb) => dispatch(updateForum(id, toUpdate, cb)),
      updateSortingMethod: (method) => { dispatch(updateSortingMethod(method)); },
      stopLoading: () => dispatch(stopLoading())
    };
  }
)(ForumFeed);
