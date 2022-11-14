import { useState } from 'react';
import axios from "axios";

function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  let handleSubmit = async (e) => {
    e.preventDefault();
    let url = 'http://cloudnine.cse356.compas.cs.stonybrook.edu/users/signup'
    const headers = {
      'Content-Type': 'application/json'
    }
    axios.post(url, {name: name, email: email, password: password}, {headers: headers})
    .then(res => { console.log(res)})
    .catch(error => { console.log(error)})
  }
  return (
    <div className="SignupPage">
      Signup<br></br>
      <form onSubmit={handleSubmit}>
        Name: <input type="text" value={name} onChange={(e) => setName(e.target.value)}/><br></br>
        Email: <input type="text" value={email} onChange={(e) => setEmail(e.target.value)}/><br></br>
        Password: <input type="text" value={password} onChange={(e) => setPassword(e.target.value)}/><br></br>
        <button type="submit">Signup</button>
      </form>
    </div>
  );
}

export default SignupPage;