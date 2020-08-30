import React, { Component } from 'react';
import { Form, Button } from 'react-bootstrap';

class ReplyBox extends Component {
  render() {
    const {
      posting,
      onSubmit,
      onChange,
    } = this.props;

    if (posting) return <div >Posting your opinion...</div>;

    return (

      <Form onSubmit={(e) => {
        e.preventDefault()

      }}>
        <Form.Group controlId="exampleForm.ControlTextarea1">
          <Form.Control onChange={onChange} placeholder="Your comment" as="textarea" />
        </Form.Group>
        <Form.Group >
          <Button onClick={() => { onSubmit() }} className="w-100">Comment</Button>
        </Form.Group>
      </Form>
    );
  }
}

ReplyBox.defaultProps = {
  posting: false,
  onSubmit: () => { },
  onChange: (value) => { },
};

/* ReplyBox.propTypes = {
  posting: React.PropTypes.bool,
  onSubmit: React.PropTypes.func,
  onChange: React.PropTypes.func,
}; */

export default ReplyBox;
