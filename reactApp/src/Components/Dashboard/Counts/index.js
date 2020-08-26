import React, { Component } from 'react';



class Counts extends Component {
  render() {
    const {
      count,
      label,
    } = this.props;

    return (
      <div >
        <div >{count}</div>
        <div >{label}</div>
      </div>
    );
  }
}

Counts.defaultProps = {
  count: 0,
  label: 'default',
};

/* Counts.propTypes = {
  count: React.PropTypes.number,
  label: React.PropTypes.string,
}; */

export default Counts;
