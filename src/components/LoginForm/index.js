import './index.css'

import {Component} from 'react'

import {Redirect} from 'react-router-dom'

import Cookies from 'js-cookie'

class LoginForm extends Component {
  state = {
    usernameInput: '',
    passwordInput: '',
    showError: false,
    errorMsg: '',
  }
  onChangeUsernameInput = event => {
    this.setState({usernameInput: event.target.value})
  }
  onChangePasswordInput = event => {
    this.setState({passwordInput: event.target.value})
  }
  onSubmitSuccess = jwtToken => {
    const {history} = this.props
    Cookies.set('jwt_token', jwtToken, {expires: 30})
    history.replace('/')
  }
  onSubmitFailure = errorMsg => {
    this.setState({
      showError: true,
      errorMsg,
      usernameInput: '',
      passwordInput: '',
    })
  }
  onSubmitForm = async event => {
    event.preventDefault()
    const {usernameInput, passwordInput} = this.state
    const userDetails = {
      username: usernameInput,
      password: passwordInput,
    }
    const url = 'https://apis.ccbp.in/login'
    const options = {
      method: 'POST',
      body: JSON.stringify(userDetails),
    }
    const response = await fetch(url, options)
    const data = await response.json()
    if (response.ok === true) {
      this.onSubmitSuccess(data.jwt_token)
    } else {
      this.onSubmitFailure(data.error_msg)
    }
  }
  render() {
    const {showError, errorMsg, usernameInput, passwordInput} = this.state
    const jwtToken = Cookies.get('jwt_token')
    if (jwtToken !== undefined) {
      return <Redirect to="/" />
    }
    return (
      <div className="login-container">
        <form className="form-container" onSubmit={this.onSubmitForm}>
          <div>
            <img
              src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
              className="website logo"
              className="website-logo"
            />
          </div>
          <div>
            <label htmlFor="username">USERNAME</label>
            <br />
            <input
              type="text"
              placeholder="Username"
              onChange={this.onChangeUsernameInput}
              value={usernameInput}
              id="username"
            />
          </div>
          <div>
            <label htmlFor="password">PASSWORD</label>
            <br />
            <input
              type="password"
              placeholder="Password"
              onChange={this.onChangePasswordInput}
              value={passwordInput}
              id="password"
            />
          </div>
          <button type="submit" className="login-button">
            Login
          </button>
          {showError ? <p>{errorMsg}</p> : <p></p>}
        </form>
      </div>
    )
  }
}
export default LoginForm
