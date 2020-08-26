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

      discussionSlug
    } = this.props;

    this.props.getDiscussion(discussionSlug);
  }


  componentDidUpdate() {
    const {
      deletedDiscussion,
      deletedDiscussionRedirect,
    } = this.props;

    /* const { forum } = this.props.params;

    // check if the discussion is deleted and redirect the user
    if (deletedDiscussion) {
      browserHistory.push(`/${forum}`);
      setTimeout(() => { deletedDiscussionRedirect(); }, 100);
    } */
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
      discussion,
      opinionContent,
      userId,
    } = this.props;

    const discussion_slug = this.props.discussion.discussion_slug;    
    const forumId = this.props.discussion.forum._id;

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
    const { discussion } = this.props.params;
    const { deletePost } = this.props;
    deletePost(discussion);
  }

  deleteOpinion(opinionId) {
    const { discussion } = this.props.params;
    const { deleteOpinion } = this.props;
    deleteOpinion(opinionId, discussion);
  }

  render() {
    const {
      discussion,
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
      } = discussion;


      const {
        avatarUrl,
        name,
        username,
      } = discussion.user;

      // check if logged in user is owner of the discussion
      let allowDelete = false;
      if (
        (discussion.user._id === this.props.userId) ||
        this.props.userRole === 'admin'
      ) allowDelete = true;

      // check if user favorated the discussion
      const userFavorited = this.userFavoritedDiscussion(this.props.userId, favorites);

      return (
        <div >

          <Discussion
            id={_id}
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
            deletingDiscussion={deletingDiscussion}
            deleteAction={this.deleteDiscussion.bind(this)}

          />

          {opinionError && <div >{opinionError}</div>}


          <ReplyBox
            posting={postingOpinion}
            onSubmit={this.handleReplySubmit.bind(this)}
            onChange={(content) => { updateOpinionContent(content); }}
          />

          <hr />
          {opinions && opinions.length ? <p><strong>{opinions.length} Comments</strong></p> : null}
          {opinions && opinions.map((opinion) => {
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
      error: state.discussion.error,
      discussion: state.discussion.discussion,
    };
  },
  (dispatch) => {
    return {
      getDiscussion: (discussionSlug) => { dispatch(getDiscussion(discussionSlug)); },
      toggleFavorite: (discussionId) => { dispatch(toggleFavorite(discussionId)); },
      updateOpinionContent: (content) => { dispatch(updateOpinionContent(content)); },
      postOpinion: (opinion, discussionSlug) => { dispatch(postOpinion(opinion, discussionSlug)); },
      deletePost: (discussionSlug) => { dispatch(deletePost(discussionSlug)); },
      deletedDiscussionRedirect: () => { dispatch(deletedDiscussionRedirect()); },
      deleteOpinion: (opinionId, discussionSlug) => { dispatch(deleteOpinion(opinionId, discussionSlug)); },
    };
  }
)(SingleDiscussion);
