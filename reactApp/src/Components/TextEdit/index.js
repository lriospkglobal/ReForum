import React, { Component } from 'react';
class TextEdit extends Component {

  constructor(props) {
    super();
    this.ESCAPE_KEY = 27;
    this.ENTER_KEY = 13;
    this.state = {
      editText: props.text,
      originalText: props.text,
      editing: false
    };
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

        , () => this.props.callback(val, this.props.attr)
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

  componentDidUpdate(prevProps) {

    if (prevProps.text !== this.props.text) {

      this.setState({
        editText: this.props.text,
        originalText: this.props.text,
        editing: false
      })
    }
  }

  render() {
    const { styleClass, role } = this.props
    return (
      <span className="w-100">
        <span className={'text-edit ' + styleClass + (this.state.editing ? ' d-none' : '')} onDoubleClick={role === 'admin' ? this.handleEdit() : null}>{this.state.editText}</span>
        <input
          className={this.state.editing ? 'w-100 d-block' : 'd-none'}
          value={this.state.editText}
          onChange={this.handleChange.bind(this)}
          /* onBlur={this.handleSubmit.bind(this)} */
          onKeyDown={this.handleKeyDown.bind(this)}
        />
      </span>
    );
  }
}
export default TextEdit