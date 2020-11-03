import React, { Component } from 'react';
import { Form } from 'react-bootstrap';
class TextEdit extends Component {

  constructor(props) {
    super();
    this.ESCAPE_KEY = 27;
    this.ENTER_KEY = 13;
    this.state = {
      editText: props.text,
      originalText: props.text,
      editing: false,
      rows: null
    };
    this.text = React.createRef()
  }

  handleEdit(e) {
    return (e) => this.setState({
      editing: !this.state.editing
    });
  }

  handleChange(e) {
    this.setState({ editText: e.target.value });
  }

  handleSubmit(e) {
    var val = this.state.editText.trim();
    if (val) {
      this.setState({
        editText: val,
        editing: false,
      }

        , () => this.props.callback(val, this.props.attr, this.props.id)
      )


    }
  }

  handleKeyDown(e) {

    if (e.which === this.ESCAPE_KEY) {
      this.setState({
        editText: this.state.originalText,
        editing: false
      });
    } else if (e.which === this.ENTER_KEY) {
      this.handleSubmit(e);
    }
  }
  getLines = () => {
    const el = this.text.current

    if (el) {
      const messageLines = el.getClientRects();      
      return this.setState({ rows: messageLines.length })
    }


    else return this.setState({ rows: null })

  }

  componentDidMount() {
    this.getLines()
  }

  componentDidUpdate(prevProps) {
    
    if (prevProps.text !== this.props.text) {

      this.setState({
        editText: this.props.text,
        originalText: this.props.text,
        editing: false
      }, this.getLines)
    }
  }

  render() {
    const { styleClass, role } = this.props
    return (
      <span className="w-100">
        <span ref={this.text} className={'text-edit ' + styleClass + (this.state.editing ? ' d-none' : '')} onDoubleClick={role === 'admin' ? this.handleEdit() : null}>{this.state.editText}</span>

        <Form.Control
          className={this.state.editing ? 'w-100 d-block' : 'd-none'}
          value={this.state.editText}
          onChange={this.handleChange.bind(this)}
          /* onBlur={this.handleSubmit.bind(this)} */
          onKeyDown={this.handleKeyDown.bind(this)}
          as="textarea" rows={this.state.rows} />
      </span>
    );
  }
}
export default TextEdit