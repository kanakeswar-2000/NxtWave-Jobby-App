import './index.css'
import {Link} from 'react-router-dom'
import Header from '../Header'
const Home = () => {
  return (
    <div className="home-container">
      <Header />
      <h1>
        Find The Job That <br />
        Fits Your Life
      </h1>
      <p>
        Millions of people are searching for jobs,
        <br />
        salary information,company reviews
      </p>
      <Link to="/jobs">
        <button type="button">Find Jobs</button>
      </Link>
    </div>
  )
}
export default Home
