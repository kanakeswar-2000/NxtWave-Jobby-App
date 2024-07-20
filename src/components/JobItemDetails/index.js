import './index.css'
import {Component} from 'react'
import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'
import Header from '../Header'
import SimilarJob from '../SimilarJob'
const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  in_progress: 'INPROGRESS',
}
class JobitemDetails extends Component {
  state = {
    companyInfo: {},
    similarJobsList: [],
    apiStatus: apiStatusConstants.initial,
  }
  renderSkillsList = eachskill => {
    return {
      imageUrl: eachskill.image_url,
      name: eachskill.name,
    }
  }
  renderSimilarJob = eachjob => {
    return {
      companyLogoUrl: eachjob.company_logo_url,
      employmentType: eachjob.employment_type,
      id: eachjob.id,
      location: eachjob.location,
      rating: eachjob.rating,
      jobDescription: eachjob.job_description,
      title: eachjob.title,
    }
  }
  componentDidMount() {
    this.getcompaniesdetails()
  }
  getcompaniesdetails = async () => {
    this.setState({apiStatus: apiStatusConstants.in_progress})
    const jwtToken = Cookies.get('jwt_token')
    const {match} = this.props
    const {params} = match
    const {id} = params
    const url = `https://apis.ccbp.in/jobs/${id}`
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const response = await fetch(url, options)
    const data = await response.json()

    if (response.ok === true) {
      const company = data.job_details
      const clickedCompanyInfo = {
        companyLogoUrl: company.company_logo_url,
        companyWebsiteUrl: company.company_website_url,
        id: company.id,
        jobDescription: company.job_description,
        skills: company.skills.map(eachskill =>
          this.renderSkillsList(eachskill),
        ),
        lifeAtCompany: {
          imageUrl: company.life_at_company.image_url,
          description: company.life_at_company.description,
        },
        location: company.location,
        packagePerAnnum: company.package_per_annum,
        rating: company.rating,
        title: company.title,
        employmentType:company.employment_type
      }
      const similarJobsList = data.similar_jobs
      const similarjobs = similarJobsList.map(eachjob =>
        this.renderSimilarJob(eachjob),
      )
      this.setState({
        apiStatus: apiStatusConstants.success,
        companyInfo: clickedCompanyInfo,
        similarJobsList: similarjobs,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }
  renderSuccessView = () => {
    const {companyInfo, similarJobsList} = this.state
    const {
      companyLogoUrl,
      companyWebsiteUrl,
      id,
      jobDescription,
      lifeAtCompany,
      location,
      packagePerAnnum,
      employmentType,
      rating,
      title,
      skills,
    } = companyInfo
    const {imageUrl, description} = lifeAtCompany
    return (
      <div>
        <div className="company-container">
          <img
            src={companyLogoUrl}
            alt="job details company logo"
            className="company-logo"
          />
          <h1>{title}</h1>
          <p>{rating}</p>
          <p>{location}</p>
          <p>{employmentType}</p>
          <p>{packagePerAnnum}</p>
          <button type="button">
            <a href={companyWebsiteUrl} target="_blank">
              Visit
            </a>
          </button>
          <h1>Skills</h1>
          <ul className="skills-container">
            {skills.map(eachskill => {
              return (
                <li key={eachskill.name}>
                  <img src={eachskill.imageUrl} />
                  <p>{eachskill.name}</p>
                </li>
              )
            })}
          </ul>
          <h1>Description</h1>
          <p>{jobDescription}</p>
          <div> 
          <h1>Life at Company</h1>
          <p>{description}</p>
          <img
            src={imageUrl}
            alt="job details company logo"
            className="company-image"
          />
          </div>
        </div>
        <div> 
        <h1>Similar Jobs</h1>
        <ul className="similarjobs-container">
          {similarJobsList.map(eachjob => (
            <SimilarJob jobDetails={eachjob} key={eachjob.id} />
          ))}
        </ul>
        </div>
      </div>
    )
  }
  renderFailureView = () => {
    return (
      <div>
        <img
          src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
          alt="failure view"
        />
        <h1>Oops! Something Went Wrong</h1>
        <p>We cannot seem to find the page you are looking for.</p>
        <button
          type="button"
          className="retry-button"
          onClick={this.getcompaniesdetails}
        >
          Retry
        </button>
      </div>
    )
  }
  renderLoadingView = () => {
    return (
      <div className="loader-container" data-testid="loader">
        <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
      </div>
    )
  }
  renderDetailsView = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderSuccessView()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      case apiStatusConstants.in_progress:
        return this.renderLoadingView()
      default:
        return null
    }
  }
  render() {
    return (
      <div className="job-details-container">
        <Header />
        <div> {this.renderDetailsView()}</div>
      </div>
    )
  }
}
export default JobitemDetails
