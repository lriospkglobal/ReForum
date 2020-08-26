import React, { Component } from 'react';



import Button from '../../Components/Button';

class Tag extends Component {
  render() {
    const {
      name,
      withRemove,
      removeAction,
    } = this.props;

    return (
      <div >
        {name}
        { withRemove &&
          <Button
            onClick={removeAction}

          >
            <i ></i>
          </Button>
        }
      </div>
    );
  }
}

Tag.defaultProps = {
  name: '',
  withRemove: false,
  removeAction: () => {},
};

/* Tag.propTypes = {
  name: React.PropTypes.string.isRequired,
  withRemove: React.PropTypes.bool,
  removeAction: React.PropTypes.func,
}; */

export default Tag;
