import TextForm from './TextForm'
import LoginPage from './LoginPage'
import SignupPage from './SignupPage'
import {
  BrowserRouter as Router,
  Switch,
  Route
} from 'react-router-dom'

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/" exact>
          <SignupPage/>
          <LoginPage/>
          <TextForm/>
        </Route>
        <Route path="/edit/:id">
          
        </Route>
      </Switch>
    </Router>
  )
}

export default App;
