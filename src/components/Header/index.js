import './index.css'
import {Link, withRouter} from 'react-router-dom'
import Cookies from 'js-cookie'
const Header = props => {
  const {history} = props
  const onClickLogout = () => {
    Cookies.remove('jwt_token')
    history.replace('/login')
  }
  return (
    <nav className='nav-container'>
      <Link to='/'>
        <img
          src='https://assets.ccbp.in/frontend/react-js/logo-img.png'
          alt='website logo'
          className='website-logo'
        />
      </Link>
      <ul className='links-container'>
        <li className='nav-link'>
          <Link to='/'>Home</Link>
        </li>
        <li className='nav-link'>
          <Link to='/jobs'>Jobs</Link>
        </li>
        <li>
          <button
            onClick={onClickLogout}
            type='button'
            className='logout-button'
          >
            Logout
          </button>
        </li>
      </ul>
    </nav>
  )
}
export default withRouter(Header)
