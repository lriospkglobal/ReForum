import React, { Component } from 'react';
import { Form, Modal, Carousel, Container, Image as ImageBootstrap, OverlayTrigger, Tooltip } from 'react-bootstrap';
import pencilWhite from '../../App/img/pencil-white.svg';
import pencilBlack from '../../App/img/pencil-black.svg';
import comingSoon from '../../App/img/comingSoon.png';
class CheckBoxEdit extends Component {

  constructor(props) {
    super();

    this.state = {
      previousMosaics: props.previousMosaics,
      //editCheckboxes: props.checkboxes,
      //originalCheckboxes: props.checkboxes,
      editing: false,
      showPrevMosaicModal: false,
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
  }



  handleEdit = () => {

    this.setState({
      editing: !this.state.editing
    });
  }



  handleSubmit = (e) => {

    this.setState({
      editing: !this.state.editing
    }, () => {


      const mosaicProgressSteps = []
      this.state.tags.forEach(tag => {
        if (tag.checked) mosaicProgressSteps.push(tag.value)
      })
      this.props.callback(mosaicProgressSteps, this.props.attr, true)
    });


  }

  componentDidMount() {

    const tags = this.state.tags.map(tag => {
      for (let i = 0; i < this.props.previousMosaics.length; i++) {
        const prevMosaic = this.props.previousMosaics[i]
        if (prevMosaic.nTiles.toString() === tag.value) {
          tag.checked = true
          break
        }
      }

      return tag
    })
    let nChecked = tags.filter(tag => tag.checked).length

    this.setState({
      previousMosaics: this.props.previousMosaics,
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
  componentDidUpdate(prevProps) {

    if (JSON.stringify(prevProps.previousMosaics) !== JSON.stringify(this.props.previousMosaics)) {
      this.setState({ editing: false }, () => {
        const tags = this.state.tags.map(tag => {
          for (let i = 0; i < this.props.previousMosaics.length; i++) {
            const prevMosaic = this.props.previousMosaics[i]
            if (prevMosaic.nTiles.toString() === tag.value) {
              tag.checked = true
              break
            }
          }

          return tag
        })
        let nChecked = tags.filter(tag => tag.checked).length

        this.setState({
          previousMosaics: this.props.previousMosaics,
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
      })


    }
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
    const { tags, previousMosaics, editing } = this.state
    const { role } = this.props
    return (
      <div >
        {(role && role === 'admin') && !editing && <OverlayTrigger
          key={'top'}
          placement={'top'}
          overlay={
            <Tooltip >
              As an admin you can edit the mosaic progress steps (Double click on pencil to edit).
                    </Tooltip>
          }
        >
          <ImageBootstrap onDoubleClick={this.handleEdit} className="mb-3 pencil" src={pencilWhite} />
        </OverlayTrigger>}
        {(role && role === 'admin') && editing &&
          <button onClick={this.handleSubmit} className="close"><span>×</span><span className="sr-only">Close</span></button>
        }

        {editing ?
          <section className="d-flex flex-wrap justify-content-center text-white">
            <p className="w-100 text-center">Display progress snapshots</p>
            {tags.map((obj, index) => (

              <Form.Check inline label={obj.value} disabled={obj.disabled} checked={obj.checked} type="checkbox" onChange={this.checkProgress.bind(this, obj.value, index)} key={obj.value} />


            ))}
          </section> :
          <section className="d-flex flex-wrap justify-content-center">
            {previousMosaics.map((prevMosaic, index) => {
              return (
                <div className="previous-mosaic d-flex align-items-start justify-content-center flex-wrap mr-3 ml-3" key={prevMosaic._id}>
                  <ImageBootstrap onClick={() => {
                    this.setState({
                      showPrevMosaicModal: true,
                      prevMosaicImage: index
                    })
                  }} thumbnail src={prevMosaic.base64 ? 'data:image/jpeg;base64, ' + prevMosaic.base64 : comingSoon} />
                  <strong className="text-white text-center w-100 mt-2">{prevMosaic.nTiles} PHOTOS</strong>
                </div>
              )
            })}
            <Modal show={this.state.showPrevMosaicModal} className="full" onHide={() => this.setState({ showPrevMosaicModal: false })}>
              <Modal.Header closeButton>

              </Modal.Header>
              <Modal.Body>

                {/* <ImageBootstrap src={this.state.prevMosaicImage} fluid /> */}
                <Container>
                  <Carousel activeIndex={this.state.prevMosaicImage} indicators={false}
                    onSelect={(selectedIndex) => this.setState({ prevMosaicImage: selectedIndex })}>
                    {this.state.previousMosaics.map(prevMosaic => {
                      return (
                        <Carousel.Item key={prevMosaic._id}>
                          <ImageBootstrap
                            fluid
                            thumbnail
                            className="d-block w-100"
                            src={prevMosaic.base64 ? 'data:image/jpeg;base64, ' + prevMosaic.base64 : comingSoon}
                            alt="slide"
                          />
                          <Carousel.Caption>
                            <h5><strong>{prevMosaic.nTiles} Photos</strong></h5>
                            <p>This is a static image of the mosaic built with {prevMosaic.nTiles} photos,
                              to view current interactive mosaic please exit this window.
                              </p>
                          </Carousel.Caption>
                        </Carousel.Item>
                      )
                    })}


                  </Carousel>
                </Container>
              </Modal.Body>

            </Modal>
          </section>
        }



      </div>
    );
  }
}
export default CheckBoxEdit