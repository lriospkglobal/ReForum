import React, { useState, useEffect } from 'react';
import Moment from 'moment';
import DiscussionBox from './DiscussionBox';
import { Modal, Image } from 'react-bootstrap';
import SingleDiscussion from '../../Views/SingleDiscussion';
import { connect } from 'react-redux';
import { toApproveDiscussion } from './mock';

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
      role
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
    role
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
          {(role && role === 'admin' && discussions && discussions.length) && <DiscussionBox
            discussion={toApproveDiscussion}
            key={toApproveDiscussion._id}
            idKey={toApproveDiscussion._id}
            userProfile={userProfile}
            discussionType={type}
            mock={true}

          />}

          {(discussions && discussions.length) ? discussions.map((discussion) => {

            return < DiscussionBox
              discussion={discussion}
              userProfile={userProfile}
              discussionType={type}
              key={discussion._id}
              idKey={discussion._id}
              setDiscussion={setDiscussion}
              setLgShow={setLgShow}

            />
          }) : null}
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
            <div className="w-70 modal-image" style={{ backgroundImage: 'url(' + 'data:image/jpeg;base64,' + discussion.base64 + ')' }}>

            </div>
            <div className="overflow-auto w-40 p-3">
              <section className="discussion-box__header d-flex mb-3">


                <Image src={discussion.user.avatarUrl} roundedCircle />

                <div className="d-flex flex-column justify-content-center">
                  <span>{discussion.user.name || discussion.user.username} </span>
                  <span className="text-muted">{timeDisplay(discussion.date)}</span>
                </div>
              </section>
              <SingleDiscussion discussion={discussion} discussionSlug={discussion.discussion_slug} />
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


export default connect(
  (state) => {
    return {
      role: state.user.role,

    };
  }
)(FeedBox);

