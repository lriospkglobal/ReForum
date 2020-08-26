import React from 'react';



class StyleButton extends React.Component {
  constructor() {
    super();
    this.onToggle = (e) => {
      e.preventDefault();
      this.props.onToggle(this.props.style);
    };
  }

  render() {

    return (
      <div  onMouseDown={this.onToggle}>
        {this.props.label}
      </div>
    );
  }
}

/* StyleButton.propTypes = {
  onToggle: React.PropTypes.func.isRequired,
  active: React.PropTypes.any.isRequired,
  label: React.PropTypes.string.isRequired,
  style: React.PropTypes.string.isRequired,
}; */

export default StyleButton;
