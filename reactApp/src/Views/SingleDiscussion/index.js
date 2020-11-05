import React, { Component } from 'react';
import { connect } from 'react-redux';



import {
  toggleFavorite,
  updateOpinionContent,
  postOpinion,
  deletePost,
  deletedDiscussionRedirect,
  deleteOpinion,
  getDiscussion
} from './actions';

import Discussion from '../../Components/SingleDiscussion/Discussion';
import ReplyBox from '../../Components/SingleDiscussion/ReplyBox';
import Opinion from '../../Components/SingleDiscussion/Opinion';


class SingleDiscussion extends Component {
  constructor(props) {
    super(props);
    this.state = { opinionContent: '' };
  }

  componentDidMount() {
    const {

      discussionSlug, discussion
    } = this.props;

    if (!discussion) {
      console.log(discussionSlug)
      this.props.getDiscussion(discussionSlug);
    }


  }


  componentDidUpdate() {
    const {
      deletedDiscussion,
      deletedDiscussionRedirect,
    } = this.props;



    // check if the discussion is deleted and redirect the user
    if (deletedDiscussion) {

      //setTimeout(() => { deletedDiscussionRedirect(); }, 100);
      window.location = '/'
    }
  }

  componentWillUnmount() {
    // remove any existing opinion texts
    this.props.updateOpinionContent(null);
  }

  userFavoritedDiscussion(userId, favorites) {
    let favorited = false;
    for (let i = 0; i < favorites.length; i++) {
      if (favorites[i] === userId) favorited = true;
    }
    return favorited;
  }

  handleReplySubmit() {

    const {
      postOpinion,
      opinionContent,
      userId,
    } = this.props;

    const discussion = this.props.discussionFromStore || this.props.discussion
    const discussion_slug = this.props.discussionSlug;
    const forumId = discussion.forum._id;

    postOpinion(
      {
        forum_id: forumId,
        discussion_id: discussion._id,
        user_id: userId,
        content: opinionContent,
      },
      discussion_slug
    );
  }

  deleteDiscussion() {
    const { discussionSlug, deletePost, currentForum } = this.props;

    deletePost(discussionSlug, currentForum);
  }

  deleteOpinion(opinionId) {
    const { discussionSlug } = this.props;
    const { deleteOpinion } = this.props;
    deleteOpinion(opinionId, discussionSlug);
  }

  render() {
    const discussion = this.props.discussionFromStore || this.props.discussion

    const {
      toggleFavorite,
      toggleingFavorite,
      updateOpinionContent,
      postingOpinion,
      opinionError,
      deletingOpinion,
      deletingDiscussion

    } = this.props;


    if (discussion) {
      const {
        _id,
        content,
        date,
        favorites,
        title,
        tags,
        opinions,
        camera,
        photo_location,
        photo_date,
        photo_time
      } = discussion;


      const {
        avatarUrl,
        name,
        username,
      } = discussion.user;

      // check if logged in user is owner of the discussion
      let allowDelete = false;
      let allowEdit = false
      if (
        (discussion.user._id === this.props.userId) ||
        this.props.userRole === 'admin'
      ) allowDelete = true;
      if (discussion.user._id === this.props.userId) allowEdit = true;


      // check if user favorated the discussion
      const userFavorited = this.userFavoritedDiscussion(this.props.userId, favorites);

      return (
        <div >

          <Discussion
            id={_id}
            userRole={this.props.userRole}
            userAvatar={avatarUrl}
            userName={name || username}
            userGitHandler={username}
            discTitle={title}
            discDate={date}
            discContent={content}
            tags={tags}
            favoriteCount={favorites.length}
            favoriteAction={toggleFavorite}
            userFavorited={userFavorited}
            toggleingFavorite={toggleingFavorite}
            allowDelete={allowDelete}
            allowEdit={allowEdit}
            deletingDiscussion={deletingDiscussion}
            deleteAction={this.deleteDiscussion.bind(this)}
            camera={camera}
            photoLocation={photo_location}
            photoDate={photo_date}
            photoTime={photo_time}
          />

          {opinionError && <div >{opinionError}</div>}


          <ReplyBox
            posting={postingOpinion}
            onSubmit={this.handleReplySubmit.bind(this)}
            onChange={(e) => { updateOpinionContent(e.target.value); }}
          />

          <hr />
          {opinions && opinions.length ? <p><strong>{opinions.length + 1} Comments</strong></p> : null}
          {(opinions && opinions.length > 0) &&
            <Opinion
              pinned={true}
              key={'hkjhfd25432'}
              opinionId={'hkjhfd25432'}
              userAvatar={'https://randomuser.me/api/portraits/men/34.jpg'}
              userName={'John Doe'}
              userGitHandler={'John Doe'}
              opDate={null}
              opContent={'Wow! What a fabulous photo, great job!'}
              userId={'hkjhfd25432'}



            />
          }
          {opinions && opinions.length > 0 && opinions.map((opinion) => {
            return (
              <Opinion
                key={opinion._id}
                opinionId={opinion._id}
                userAvatar={opinion.user.avatarUrl}
                userName={opinion.user.name}
                userGitHandler={opinion.user.username}
                opDate={opinion.date}
                opContent={opinion.content}
                userId={opinion.user_id}
                currentUserId={this.props.userId}
                currentUserRole={this.props.userRole}
                deleteAction={this.deleteOpinion.bind(this)}
                deletingOpinion={deletingOpinion}
                allowDelete={allowDelete}
              />
            );
          })}
        </div>
      );
    }

    else return null
  }
}

export default connect(
  (state) => {
    return {
      currentForum: state.app.currentForum,
      forums: state.app.forums,
      userId: state.user._id,
      userRole: state.user.role,
      toggleingFavorite: state.discussion.toggleingFavorite,
      deletingDiscussion: state.discussion.deletingDiscussion,
      deletedDiscussion: state.discussion.deletedDiscussion,
      opinionContent: state.discussion.opinionContent,
      postingOpinion: state.discussion.postingOpinion,
      opinionError: state.discussion.opinionError,
      deletingOpinion: state.discussion.deletingOpinion,
      discussionFromStore: state.discussion.discussion,
      error: state.discussion.error

    };
  },
  (dispatch) => {
    return {
      getDiscussion: (discussionSlug) => { dispatch(getDiscussion(discussionSlug)); },
      toggleFavorite: (discussionId) => { dispatch(toggleFavorite(discussionId)); },
      updateOpinionContent: (content) => { dispatch(updateOpinionContent(content)); },
      postOpinion: (opinion, discussionSlug) => { dispatch(postOpinion(opinion, discussionSlug)); },
      deletePost: (discussionSlug, currentForum) => { dispatch(deletePost(discussionSlug, currentForum)); },
      deletedDiscussionRedirect: () => { dispatch(deletedDiscussionRedirect()); },
      deleteOpinion: (opinionId, discussionSlug) => { dispatch(deleteOpinion(opinionId, discussionSlug)); },
    };
  }
)(SingleDiscussion);
