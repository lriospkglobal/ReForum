import {
  POSTING_DISCUSSION_START,
  POSTING_DISCUSSION_SUCCESS,
  POSTING_DISCUSSION_FAILURE,

  UPDATE_DISCUSSION_TITLE,
  UPDATE_DISCUSSION_CONTENT,
  UPDATE_DISCUSSION_PIN_STATUS,
  UPDATE_DISCUSSION_TAGS,
  UPDATE_CAMERA,

  CLEAR_SUCCESS_MESSAGE,
  UPDATE_DISCUSSION_TILE,
  UPDATE_RIGHTS,
  UPDATE_PHOTO_LOCATION,
  UPDATE_DATE,
  UPDATE_TIME
} from './constants';

const initialState = {
  postingSuccess: false,
  errorMsg: null,
  postingDiscussion: false,
  title: '',
  tile: null,
  content: '',
  tags: [],
  pinned: false,
  camera: '',
  photoLocation: '',
  rights: false,
  date: null,
  time: 'morning'
};

export const newDiscussionReducer = (state = initialState, action) => {
  switch (action.type) {
    case POSTING_DISCUSSION_START:
      return Object.assign({}, state, {
        postingDiscussion: true,
      });

    case POSTING_DISCUSSION_SUCCESS:
      return Object.assign({}, initialState, {
        postingSuccess: true,
        postingDiscussion: false,
        errorMsg: null,
      });

    case POSTING_DISCUSSION_FAILURE:
      return Object.assign({}, state, {
        postingSuccess: false,
        postingDiscussion: false,
        errorMsg: action.payload || 'Unable to post discussion.',
      });

    case CLEAR_SUCCESS_MESSAGE:
      return Object.assign({}, initialState, {
        postingSuccess: false,
      });

    case UPDATE_DISCUSSION_TITLE:
      return Object.assign({}, state, {
        title: action.payload,
      });

    case UPDATE_DISCUSSION_CONTENT:

      return Object.assign({}, state, {

        content: action.payload,
      });

    case UPDATE_DISCUSSION_TILE:
      return Object.assign({}, state, {
        tile: action.payload,
      });

    case UPDATE_DISCUSSION_PIN_STATUS:
      return Object.assign({}, state, {
        pinned: action.payload,
      });

    case UPDATE_DISCUSSION_TAGS:
      return Object.assign({}, state, {
        tags: action.payload,
      });

    case UPDATE_CAMERA:
      return Object.assign({}, state, {
        camera: action.payload,
      });

    case UPDATE_RIGHTS:
      return Object.assign({}, state, {
        rights: action.payload,
      });

    case UPDATE_PHOTO_LOCATION:
      return Object.assign({}, state, {
        photoLocation: action.payload,
      });

    case UPDATE_DATE:
      return Object.assign({}, state, {
        date: action.payload,
      });

    case UPDATE_TIME:
      return Object.assign({}, state, {
        time: action.payload,
      });


    default:
      return state;
  }
};
