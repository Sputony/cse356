import TextForm from './TextForm'
import LoginPage from './LoginPage'
import SignupPage from './SignupPage'
import HomePage from './HomePage'
import LogoutButton from './LogoutButton'

import React, {useState} from 'react'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect
} from 'react-router-dom'

function App() {
  const [isAuth, setAuth] = useState(false)
  return (
    <Router>
      <Switch>
        <Route path="/" exact>
          {isAuth ? <Redirect to="/home" /> :
          <div>
            <SignupPage/>
            <LoginPage setAuth={setAuth}/>
          </div>}
        </Route>
        <Route path="/home" exact>
          <LogoutButton setAuth={setAuth}/>
          <HomePage/>
          <TextForm/>
        </Route> 
        <Route path="/edit/:id">
          
        </Route>
      </Switch>
    </Router>
  )
}

export default App;
