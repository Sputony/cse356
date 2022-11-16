import { useState } from 'react';
import axios from "axios";
import PropTypes from 'prop-types';

function LoginPage({ setAuth }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  let handleSubmit = async (e) => {
    e.preventDefault();
    let url = 'http://cloudnine.cse356.compas.cs.stonybrook.edu/users/login'
    const headers = {
        'Content-Type': 'application/json'
    }
    axios.post(url, {email: email, password: password}, {headers: headers})
    .then(res => {
        if (res.data.name)
          setAuth(true)
        console.log(res)
    })
    .catch(error => { console.log(error)})
  }
  return (
    <div className="LoginPage">
        Login<br></br>
      <form onSubmit={handleSubmit}>
        Email: <input type="text" value={email} onChange={(e) => setEmail(e.target.value)}/><br></br>
        Password: <input type="text" value={password} onChange={(e) => setPassword(e.target.value)}/><br></br>
        <button type="submit">Login</button>
      </form>
    </div>
  );
}

LoginPage.propTypes = {
    setAuth: PropTypes.func.isRequired
}

export default LoginPage;