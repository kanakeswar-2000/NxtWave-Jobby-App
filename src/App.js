import './App.css'

// These are the lists used in the application. You can move them to any component needed.

// Replace your code here
import {Switch, Route, Redirect} from 'react-router-dom'
import Home from './components/Home'
import NotFound from './components/NotFound'
import LoginForm from './components/LoginForm'
import Jobs from './components/Jobs'
import JobitemDetails from './components/JobItemDetails'
import ProtectedRoute from "./components/ProtectedRoute"
const App = () => (
  <div>
    <Switch>
      <Route exact path="/login" component={LoginForm} />
      <ProtectedRoute exact path="/" component={Home} />
      <ProtectedRoute exact path="/jobs" component={Jobs} />
      <ProtectedRoute exact path="/jobs/:id" component={JobitemDetails} />
      <Route exact path="/not-found" component={NotFound} />
      <Redirect to="/not-found" />
    </Switch>
  </div>
)

export default App
