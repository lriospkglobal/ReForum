import { browserHistory } from 'react-router';
import {
  POSTING_DISCUSSION_START,
  POSTING_DISCUSSION_END,
  POSTING_DISCUSSION_SUCCESS,
  POSTING_DISCUSSION_FAILURE,

  UPDATE_DISCUSSION_TITLE,
  UPDATE_DISCUSSION_CONTENT,
  UPDATE_DISCUSSION_PIN_STATUS,
  UPDATE_DISCUSSION_TAGS,
  UPDATE_DISCUSSION_TILE,
  CLEAR_SUCCESS_MESSAGE,
  UPDATE_CAMERA,
  UPDATE_PHOTO_LOCATION,
  UPDATE_RIGHTS
} from './constants';
import { postDiscussionApi } from './api';

/**
 * post a new discussion
 * @param  {ObjectId} userId
 * @param  {ObjectId} forumId
 * @param  {String} currentForum
 * @return {action}
 */
export const postDiscussion = (userId, forumId, currentForum, cb) => {
  return (dispatch, getState) => {
    dispatch({ type: POSTING_DISCUSSION_START });

    // validate discussion inputs
    // discussion values are in redux state
    const {
      title,
      tile,
      content,
      tags,
      pinned,
      photoLocation,
      rights,
      camera
    } = getState().newDiscussion;

    let validated = true;

    if (!userId || !forumId) {
      validated = false;
      return dispatch({
        type: POSTING_DISCUSSION_FAILURE,
        payload: 'Something is wrong with user/forum.',
      });
    }

    if (title === null || title.length < 10) {
      validated = false;
      return dispatch({
        type: POSTING_DISCUSSION_FAILURE,
        payload: 'Title should be at least 10 characters.',
      });
    }

    if (content === null || content.length === 0) {
      validated = false;
      return dispatch({
        type: POSTING_DISCUSSION_FAILURE,
        payload: 'Please write some description before posting.',
      });
    }

    if (!tile) {
      validated = false;
      return dispatch({
        type: POSTING_DISCUSSION_FAILURE,
        payload: 'Please add a tile .',
      });
    }

    if (tags === null || tags.length === 0) {
      validated = false;
      return dispatch({
        type: POSTING_DISCUSSION_FAILURE,
        payload: 'Please provide some tags.',
      });
    }

    if (!camera.length) {
      validated = false;
      return dispatch({
        type: POSTING_DISCUSSION_FAILURE,
        payload: 'Please add a camera.',
      });
    }
    if (!rights) {
      validated = false;
      return dispatch({
        type: POSTING_DISCUSSION_FAILURE,
        payload: 'Please check photo rights.',
      });
    }

    if (!photoLocation.length) {
      validated = false;
      return dispatch({
        type: POSTING_DISCUSSION_FAILURE,
        payload: 'Please add a location.',
      });
    }
    // make api call if post is validated
    if (validated) {
      postDiscussionApi({
        userId,
        forumId,
        title,
        content,
        tags,
        pinned,
        tile,
        photoLocation,
        camera,
        rights
      }).then(
        (data) => {
          if (data.data.postCreated === true) {
            dispatch({ type: POSTING_DISCUSSION_SUCCESS });
            setTimeout(() => { dispatch({ type: CLEAR_SUCCESS_MESSAGE }); }, 2000);
            cb()
            // issue a redirect to the newly reacted discussion
            //browserHistory.push(`/${currentForum}/discussion/${data.data.discussion_slug}`);
          } else {
            dispatch({
              type: POSTING_DISCUSSION_FAILURE,
              payload: 'Something is wrong at our server end. Please try again later',
            });
          }
        },
        (error) => {
          dispatch({
            type: POSTING_DISCUSSION_FAILURE,
            payload: error,
          });
        }
      );
    }
  };
};

/**
 * update the discussion title in redux state (controlled input)
 * @param  {String} value
 * @return {action}
 */
export const updateDiscussionTitle = (value) => {

  return {
    type: UPDATE_DISCUSSION_TITLE,
    payload: value,
  };
};

/**
 * update discussion content in redux state (controlled input)
 * @param  {Object} value
 * @return {action}
 */
export const updateDiscussionContent = (value) => {

  return {
    type: UPDATE_DISCUSSION_CONTENT,
    payload: value,
  };
};

/**
 * update camera in redux state (controlled input)
 * @param  {String} value
 * @return {action}
 */
export const updateCamera = (value) => {

  return {
    type: UPDATE_CAMERA,
    payload: value,
  };
};

/**
 * update LOCATION in redux state (controlled input)
 * @param  {String} value
 * @return {action}
 */
export const updatePhotoLocation = (value) => {

  return {
    type: UPDATE_PHOTO_LOCATION,
    payload: value,
  };
};

/**
 * update rights in redux state (controlled input)
 * @param  {Boolean} value
 * @return {action}
 */
export const updateRights = (value) => {
  return {
    type: UPDATE_RIGHTS,
    payload: value,
  };
};

/**
 * update discussion tile in redux state (not controlled input)
 * @param  {Object} tile
 * @return {action}
 */
export const updateDiscussionTile = (tile) => {

  return {
    type: UPDATE_DISCUSSION_TILE,
    payload: tile,
  };
};

/**
 * update discussion pinned status in redux state (controlled input)
 * @param  {Boolean} value
 * @return {action}
 */
export const updateDiscussionPinStatus = (value) => {
  return {
    type: UPDATE_DISCUSSION_PIN_STATUS,
    payload: value,
  };
};

/**
 * update discussion tags in redux state (controlled input)
 * @param  {Array} value
 * @return {action}
 */
export const updateDiscussionTags = (value) => {
  return {
    type: UPDATE_DISCUSSION_TAGS,
    payload: value,
  };
};
