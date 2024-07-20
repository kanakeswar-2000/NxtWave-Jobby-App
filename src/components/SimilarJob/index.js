import './index.css'

const SimilarJob = props => {
  const {jobDetails} = props
  const {
    title,
    companyLogoUrl,
    jobDescription,
    location,
    rating,
    employmentType,
  } = jobDetails
  return (
    <li className="similar-job-container">
      <img src={companyLogoUrl} alt="similar job company logo" />
      <h1>{title}</h1>
      <p>{rating}</p>
      <p>{location}</p>
      <p>{employmentType}</p>
      <h1>Description</h1>
      <p>{jobDescription}</p>
    </li>
  )
}

export default SimilarJob
