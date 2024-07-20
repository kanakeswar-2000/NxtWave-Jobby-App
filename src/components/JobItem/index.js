import './index.css'
import {Link} from 'react-router-dom'
const Jobitem = props => {
  const {jobDetails} = props
  const {
    companyLogoUrl,
    employmentType,
    id,
    title,
    location,
    packagePerAnnum,
    rating,
    jobDescription,
  } = jobDetails
  return (
    <li className="eachjob-container">
      <Link to={`/jobs/${id}`}>
        <div>
          <div>
            <img src={companyLogoUrl} alt="company logo" className="company-logo" />
          </div>
          <div>
            <h1>{title}</h1>
            <p>{rating}</p>
          </div>
        </div>
        <div>
          <div>
            <p>{location}</p>
            <p>{employmentType}</p>
          </div>
          <p>{packagePerAnnum}</p>
        </div>
        <hr />
        <h1>Description</h1>
        <p>{jobDescription}</p>
      </Link>
    </li>
  )
}

export default Jobitem
