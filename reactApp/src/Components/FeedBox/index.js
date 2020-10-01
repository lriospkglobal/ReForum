import React, { useState, useEffect } from 'react';
import Moment from 'moment';
import DiscussionBox from './DiscussionBox';
import { Modal, Image } from 'react-bootstrap';
import SingleDiscussion from '../../Views/SingleDiscussion';

function FeedBox(props) {
  const [lgShow, setLgShow] = useState(false);
  const [discussion, setDiscussion] = useState(null);
  const timeDisplay = (date) => {
    const postTime = Moment(date);
    return postTime.from(Moment());
  }
  const renderSort = () => {
    const {
      activeSortingMethod,
      onChangeSortingMethod,
    } = props;

    if (props.type === 'general') {
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


  const renderEmptyDiscussionLine = (loading, discussions) => {
    if (!loading) {
      if (!discussions || discussions.length === 0) {
        return <div >No discussions...</div>;
      }
    }
  }




  const {
    type,
    loading,
    discussions,
    currentForum,
    userProfile,
  } = props;

  let discussionBoxTitle = '';
  if (type === 'general') discussionBoxTitle = 'Discussions';
  if (type === 'pinned') discussionBoxTitle = 'Pinned';

  return (
    <div >
      {/* <div >
        {!userProfile && renderSort()}
      </div> */}
      {loading && <div className="d-flex justify-content-center align-items-center"><div className="spinner-border" role="status">
        <span className="sr-only">Loading...</span>
      </div></div>}
      {renderEmptyDiscussionLine(loading, discussions)}
      {!loading &&
        <div >
          {discussions && discussions.length && discussions.map((discussion) =>
            <DiscussionBox
              discussion={discussion}
              userProfile={userProfile}
              discussionType={type}
              key={discussion._id}
              idKey={discussion._id}
              setDiscussion={setDiscussion}
              setLgShow={setLgShow}

            />
          )}
        </div>
      }
      {discussion && <Modal

        size="xl"
        show={lgShow}
        onHide={() => {
          setLgShow(false)
          setDiscussion(null)
        }}
        aria-labelledby="example-modal-sizes-title-lg"
      >

        <Modal.Body className="p-0 h-100">

          <section className="d-flex h-100">
            <div className="w-75 modal-image" style={{ backgroundImage: 'url(' + 'data:image/jpeg;base64,' + discussion.base64 + ')' }}>

            </div>
            <div className="overflow-auto w-25 p-3">
              <section className="discussion-box__header d-flex mb-3">


                <Image src={discussion.user.avatarUrl} roundedCircle />

                <div className="d-flex flex-column justify-content-center">
                  <span>{discussion.user.name || discussion.user.username} </span>
                  <span className="text-muted">{timeDisplay(discussion.date)}</span>
                </div>
              </section>
              <SingleDiscussion discussionSlug={discussion.discussion_slug} />
            </div>
          </section>
        </Modal.Body>
      </Modal>}
    </div>
  );

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