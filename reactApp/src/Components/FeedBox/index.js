import React, { Component } from 'react';

import DiscussionBox from './DiscussionBox';

class FeedBox extends Component {
  renderSort() {
    const {
      activeSortingMethod,
      onChangeSortingMethod,
    } = this.props;

    if (this.props.type === 'general') {
      return (
        <div >
          <span

            onClick={() => onChangeSortingMethod('date')}
          >
            Latest
          </span>
          <span

            onClick={() => onChangeSortingMethod('popularity')}
          >
            Popular
          </span>
        </div>
      );
    }
    return null;
  }

  renderEmptyDiscussionLine(loading, discussions) {
    if (!loading) {
      if (!discussions || discussions.length === 0) {
        return <div >No discussions...</div>;
      }
    }
  }

  render() {
    const {
      type,
      loading,
      discussions,
      currentForum,
      userProfile,
    } = this.props;

    let discussionBoxTitle = '';
    if (type === 'general') discussionBoxTitle = 'Discussions';
    if (type === 'pinned') discussionBoxTitle = 'Pinned';

    return (
      <div >
        <div >
          {!userProfile && this.renderSort()}
        </div>
        {loading && <div className="d-flex justify-content-center align-items-center"><div className="spinner-border" role="status">
          <span className="sr-only">Loading...</span>
        </div></div>}
        {this.renderEmptyDiscussionLine(loading, discussions)}
        {!loading &&
          <div >
            {discussions && discussions.map((discussion) =>
              <DiscussionBox
                discussion={discussion}
                userProfile={userProfile}
                discussionType={type}
                key={discussion._id}
                idKey={discussion._id}

              />
            )}
          </div>
        }
      </div>
    );
  }
}

FeedBox.defaultProps = {
  type: 'general',
  loading: false,
  discussions: [],
  currentForum: 'general',
  activeSortingMethod: 'date',
  onChangeSortingMethod: (val) => { },
  userProfile: false,
};

/* FeedBox.propTypes = {
  //type: React.PropTypes.oneOf(['general', 'pinned']),
  loading: React.PropTypes.bool,
  discussions: React.PropTypes.array,
  currentForum: React.PropTypes.string,
  activeSortingMethod: React.PropTypes.string,
  onChangeSortingMethod: React.PropTypes.func,
  userProfile: React.PropTypes.bool,
}; */

export default FeedBox;
