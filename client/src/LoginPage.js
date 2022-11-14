import { useState } from 'react';
import axios from "axios";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  let handleSubmit = async (e) => {
    e.preventDefault();
    let url = 'http://cloudnine.cse356.compas.cs.stonybrook.edu/users/login'
    const headers = {
        'Content-Type': 'application/json'
    }
    axios.post(url, {email: email, password: password}, {headers: headers})
    .then(res => { console.log(res)})
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

export default LoginPage;