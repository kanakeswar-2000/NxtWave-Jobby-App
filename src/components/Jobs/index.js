import './index.css'
import {Component} from 'react'
const employmentTypesList = [
  {
    label: 'Full Time',
    employmentTypeId: 'FULLTIME',
  },
  {
    label: 'Part Time',
    employmentTypeId: 'PARTTIME',
  },
  {
    label: 'Freelance',
    employmentTypeId: 'FREELANCE',
  },
  {
    label: 'Internship',
    employmentTypeId: 'INTERNSHIP',
  },
]

const salaryRangesList = [
  {
    salaryRangeId: '1000000',
    label: '10 LPA and above',
  },
  {
    salaryRangeId: '2000000',
    label: '20 LPA and above',
  },
  {
    salaryRangeId: '3000000',
    label: '30 LPA and above',
  },
  {
    salaryRangeId: '4000000',
    label: '40 LPA and above',
  },
]
import Header from '../Header'
import {BsSearch} from 'react-icons/bs'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import Jobitem from '../JobItem'
const apiStatusContants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  in_progress: 'INPROGRESS',
}
class Jobs extends Component {
  state = {
    employmentTypesList: [],
    minimumPackage: '',
    searchText: '',
    apiStatus1: apiStatusContants.initial,
    apiStatus2: apiStatusContants.initial,
    profileInfo: {},
    jobsList: [],
  }
  onChangeSearchInput = event => {
    this.setState({searchText: event.target.value})
  }
  onClickSearchIcon = () => {
    this.getJobslistInfo()
  }

  renderEachEmploymentType = eachitem => {
    return (
      <li key={eachitem.employmentTypeId} onClick={this.onChangeCheckbox}>
        <input type="checkbox" id={eachitem.employmentTypeId} />
        <label htmlFor={eachitem.employmentTypeId}>{eachitem.label}</label>
      </li>
    )
  }
  componentDidMount() {
    this.getProfileInfo()
    this.getJobslistInfo()
  }
  getProfileInfo = async () => {
    this.setState({apiStatus1: apiStatusContants.in_progress})
    const jwtToken = Cookies.get('jwt_token')
    const url = 'https://apis.ccbp.in/profile'
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const response = await fetch(url, options)
    const data = await response.json()
    if (response.ok === true) {
      const fetchedData = {
        profileDetails: {
          name: data.profile_details.name,
          profileImageUrl: data.profile_details.profile_image_url,
          shortBio: data.profile_details.short_bio,
        },
      }
      this.setState({
        apiStatus1: apiStatusContants.success,
        profileInfo: fetchedData,
      })
    } else {
      this.setState({apiStatus1: apiStatusContants.failure})
    }
  }
  getJobslistInfo = async () => {
    this.setState({apiStatus2: apiStatusContants.in_progress})
    const jwtToken = Cookies.get('jwt_token')
    const {employmentTypesList, minimumPackage, searchText} = this.state
    const employmentTypes = employmentTypesList.join(',')
    const url = `https://apis.ccbp.in/jobs?employment_type=${employmentTypes}&minimum_package=${minimumPackage}&search=${searchText}`
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const response = await fetch(url, options)
    const data = await response.json()
    if (response.ok === true) {
      const jobslist = data.jobs
      const fetchedData = jobslist.map(eachjob => {
        return {
          companyLogoUrl: eachjob.company_logo_url,
          employmentType: eachjob.employment_type,
          id: eachjob.id,
          jobDescription: eachjob.job_description,
          location: eachjob.location,
          packagePerAnnum: eachjob.package_per_annum,
          title: eachjob.title,
          rating: eachjob.rating,
        }
      })
      this.setState({
        apiStatus2: apiStatusContants.success,
        jobsList: fetchedData,
      })
    } else {
      this.setState({apiStatus2: apiStatusContants.failure})
    }
  }
  renderLoadingView = () => {
    return (
      <div className="loader-container" data-testid="loader">
        <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
      </div>
    )
  }
  renderJobsSuccessView = () => {
    const {jobsList} = this.state
    const jobsCount = jobsList.length
    if (jobsCount === 0) {
      return (
        <div className="no-jobs-container">
          <img
            src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png"
            alt="no jobs"
          />
          <h1>No Jobs Found</h1>
          <p>We could not find any jobs.Try other filters</p>
        </div>
      )
    } else {
      return (
        <ul className="jobslist-container">
          {jobsList.map(eachjob => (
            <Jobitem key={eachjob.id} jobDetails={eachjob} />
          ))}
        </ul>
      )
    }
  }
  renderJobsFailureView = () => {
    return (
      <div className="jobs-failure-container">
        <img
          src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
          alt="failure view"
        />
        <h1>Oops! Something Went Wrong</h1>
        <p>We cannot seem to find the page you are looking for.</p>
        <button
          type="button"
          className="retry-button"
          onClick={this.getJobslistInfo}
        >
          Retry
        </button>
      </div>
    )
  }
  renderProfileSuccessView = () => {
    const {profileInfo} = this.state
    const {profileDetails} = profileInfo
    const {name, profileImageUrl, shortBio} = profileDetails
    return (
      <div className="profile-container">
        <img src={profileImageUrl} className="profile-image" />
        <h1>{name}</h1>
        <p>{shortBio}</p>
      </div>
    )
  }
  renderProfileFailureView = () => {
    return (
      <div>
        <button
          type="button"
          onClick={this.getProfileInfo}
          className="retry-button"
        >
          Retry
        </button>
      </div>
    )
  }
  renderJobslistSection = () => {
    const {apiStatus2} = this.state
    switch (apiStatus2) {
      case apiStatusContants.success:
        return this.renderJobsSuccessView()
      case apiStatusContants.failure:
        return this.renderJobsFailureView()

      case apiStatusContants.in_progress:
        return this.renderLoadingView()
      default:
        return null
    }
  }
  renderProfileSection = () => {
    const {apiStatus1} = this.state
    switch (apiStatus1) {
      case apiStatusContants.success:
        return this.renderProfileSuccessView()
      case apiStatusContants.failure:
        return this.renderProfileFailureView()

      case apiStatusContants.in_progress:
        return this.renderLoadingView()
      default:
        return null
    }
  }
  render() {
    const {searchText} = this.state
    return (
      <div className="jobs-container">
        <Header />
        <div className="info-container">
          <div className="left-container">
            {this.renderProfileSection()}
            <hr />
            <h1>Type of Employment</h1>
            <ul className="employment-types-container">
              {employmentTypesList.map(eachitem => {
                return this.renderEachEmploymentType(eachitem)
              })}
            </ul>
            <hr />
            <h1>Salary Range</h1>
            <ul className="salary-ranges-list">
              {salaryRangesList.map(eachitem => {
                return (
                  <li key={eachitem.salaryRangeId}>
                    <input
                      type="radio"
                      name="salary"
                      value={eachitem.label}
                      id={eachitem.salaryRangeId}
                    />
                    <label htmFor={eachitem.salaryRangeId}>
                      {eachitem.label}
                    </label>
                  </li>
                )
              })}
            </ul>
          </div>
          <div className="right-container">
            <div>
              <input
                type="search"
                placeholder="Search"
                value={searchText}
                onChange={this.onChangeSearchInput}
              />
              <button
                type="button"
                data-testid="searchButton"
                onClick={this.onClickSearchIcon}
              >
                <BsSearch />
              </button>
            </div>
            {this.renderJobslistSection()}
          </div>
        </div>
      </div>
    )
  }
}
export default Jobs
