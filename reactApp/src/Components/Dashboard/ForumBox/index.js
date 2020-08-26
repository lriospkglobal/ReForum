import React, { Component } from 'react';



import Button from '../../../Components/Button';

class ForumBox extends Component {
  constructor(props) {
    super(props);
    this.state = {
      newForumTitle: '',
      newForumSlug: '',
      errorMsg: null,
      mosaicImage: null
    };

    this.handleCreateForum = this.handleCreateForum.bind(this);
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
        return this.setState({ errorMsg: 'Forum title should have at least 4 charecters.' });
      }
    } else {
      return this.setState({ errorMsg: 'Forum title is empty. Please provide a valid Forum Title.' });
    }

    //check mosaic image
    if(!mosaicImage) return this.setState({errorMsg: 'Select an image for mosaic.' })
    // check and confirm forum slug
    if (convertedSlug !== '') {
      const slugRegex = /^[a-z\_]+$/;
      convertedSlug = newForumSlug.match(slugRegex) ? newForumSlug : null;

      // length check
      if (convertedSlug && convertedSlug.length < 4) {
        return this.setState({ errorMsg: 'Forum slug should have at least 4 charecters.' });
      }
    } else {
      return this.setState({ errorMsg: 'Forum slug is empty. Please provide a valid Forum Slug.' });
    }

    if (!convertedTitle) { return this.setState({ errorMsg: 'Please provide a valid Forum Title.' }); }
    if (!convertedSlug) { return this.setState({ errorMsg: 'Please provide a valid Forum Slug. Slug can only contain small case alphabets and underscore.' }); }

    if (convertedTitle && convertedSlug) { this.props.createAction({ title: convertedTitle, slug: convertedSlug, mosaicImage }); }
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
    } = this.state;

    return (
      <div >
        <div >Current Forums</div>
        <div >
          { deletingForum && <div >Removing forum, please wait...</div> }

          { forums.map((forum) => <div key={forum.id} >
            <div >{ forum.name }</div>
            <div >({ forum.slug })</div>
            <div >
              <Button onClick={() => { deleteAction(forum.id); }}>Remove</Button>
            </div>
          </div>) }

        </div>

        <div >
          { creatingForum && <div >Creating forum, please wait...</div> }
          <div >Create New Forum</div>
          <div >
            <div >
              <div >Title: </div>
              <input
                type={'text'}

                placeholder={'Forum Title'}
                onChange={(e) => { this.setState({ newForumTitle: e.target.value }); }}
              />
            </div>
            <div >
              <div >Slug: </div>
              <input
                type={'text'}

                placeholder={'forum_slug'}
                onChange={(e) => { this.setState({ newForumSlug: e.target.value }); }}
              />
            </div>
            <div >
              <div >Mosaic Image: </div>
              <input
                type={'file'}                        
                accept="image/jpeg" 
                name="img"                 
                onChange={(e) => { this.setState({ mosaicImage: e.target.files[0] }); }}
              />
            </div>
            <Button onClick={this.handleCreateForum}>Create</Button>
          </div>
          { errorMsg && <div >{errorMsg}</div> }
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
