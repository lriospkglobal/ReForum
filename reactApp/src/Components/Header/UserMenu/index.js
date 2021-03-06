import React, { Component } from 'react';
import { Button, Image, Navbar, Nav, NavDropdown, Form } from 'react-bootstrap';
import axios from 'axios';
import EmailValidator from 'email-validator';



class UserMenu extends Component {
  constructor() {
    super();
    this.state = {
      userInput: '',
      emailInput: '',
      showDropdown: false
    }
  }

  logIn = (e) => {
    e.preventDefault()
    axios.post(`/api/user/authViaGitHub?user=${this.state.userInput}&email=${this.state.emailInput}`).then(function (res) {
      window.location = '/'

    })
      .catch(function (error) {
        console.error(error)
      })
  }

  logout = () => {
    axios.get(`/api/user/signout`).then(function (res) {
      window.location = '/'

    })
      .catch(function (error) {
        console.error(error)
      })
  }
  render() {
    const {
      signedIn,
      userName,
      avatar,
      gitHandler

    } = this.props;




    return (
      <div>

        <div className="navbar-collapse collapse">
          <div className="mr-auto navbar-nav">
            <div className="dropdown nav-item">
              <span className="dropdown-toggle nav-link" onClick={() => this.setState({ showDropdown: true })}>
                {signedIn ? userName : 'Sign Up / Sign In'}
              </span>
              <div className={(this.state.showDropdown ? 'd-block' : 'd-none') + ' dropdown-menu'}>
                <button onClick={() => this.setState({ showDropdown: false })} className="close"><span>×</span><span className="sr-only">Close</span></button>
                {!signedIn && <Form className="p-3">
                  <Form.Group>
                    <Form.Label>Username</Form.Label>
                    <Form.Control type="text" onChange={(e) => this.setState({ userInput: e.target.value })} placeholder="Enter user" />
                  </Form.Group>
                  <Form.Group >
                    <Form.Label>Email</Form.Label>
                    <Form.Control type="email" onChange={(e) => this.setState({ emailInput: e.target.value })} placeholder="Enter email" />
                  </Form.Group>

                  {this.state.userInput.length && EmailValidator.validate(this.state.emailInput) ? <Button variant="primary" type="submit" onClick={this.logIn}>
                    Submit
                </Button> : null}
                </Form>}

                {signedIn && <span>
                  <Image src={avatar} alt={`${userName} Avatar`} className="w-100" thumbnail />

                  <NavDropdown.Item href={`/user/${gitHandler}`}>My Profile</NavDropdown.Item>

                </span>}
                {/* { signedIn && <a  href={'#'}>Settings</a> } */}
                {signedIn &&
                  <span onClick={this.logout} className="dropdown-item" href={`/api/user/signout`}>Sign Out</span>
                }
              </div>
            </div>
          </div>
        </div>




      </div>
    );



  }
}

UserMenu.defaultProps = {
  signedIn: false,
  userName: '',
  gitHandler: '',
  avatar: '',
};

/* UserMenu.propTypes = {
          signedIn: React.PropTypes.bool.isRequired,
  userName: React.PropTypes.string,
  gitHandler: React.PropTypes.string,
  avatar: React.PropTypes.string,
}; */

export default UserMenu;
