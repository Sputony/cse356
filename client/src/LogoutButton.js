import axios from "axios";
import { useHistory } from 'react-router-dom';

function LogoutButton({ setAuth }) {
  let history = useHistory();

  let handleSubmit = async (e) => {
    e.preventDefault();
    let url = 'http://cloudnine.cse356.compas.cs.stonybrook.edu/users/logout'
    const headers = {
        'Content-Type': 'application/json'
    }
    axios.post(url, {}, {headers: headers})
    .then(res => {
        setAuth(false)
        history.push("/")
        console.log(res)
    })
    .catch(error => { console.log(error)})
  }
  return (
    <form onSubmit={handleSubmit}>
        <button type="submit">Logout</button>
    </form>
  );
}

export default LogoutButton;