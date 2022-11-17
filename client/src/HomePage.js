import { useState, useEffect } from 'react'
import axios from 'axios';

function HomePage() {
  const [newDocName, setNewDocName] = useState("");
  const [documents, setDocuments] = useState([]);

  useEffect(() => {
    let mounted = true;
    let url = 'http://cloudnine.cse356.compas.cs.stonybrook.edu/collection/list'
    axios.get(url, {withCredentials: true})
    .then(res => {
      if (mounted) {
        console.log(res.data)
        setDocuments(res.data)
      }
    })
    return () => mounted = false
  }, [])

  let handleSubmit = async (e) => {
    e.preventDefault();
    let url = 'http://cloudnine.cse356.compas.cs.stonybrook.edu/collection/create'
    const headers = {
        'Content-Type': 'application/json'
    }
    axios.post(url, {name: newDocName}, {headers: headers, withCredentials: true})
    .then(res => { console.log(res) })
    .catch(error => { console.log(error) })
  }

  return (
  <div>
    Welcome to collab-doc
    <div className="CollectionCreate">
    <form onSubmit={handleSubmit}>
      New Document Name: <input type="text" value={newDocName} onChange={(e) => setNewDocName(e.target.value)}/>
      <button type="submit">Create Document</button>
    </form>
    </div>
    10 Most Recent Documents
    <ul>{documents.map(document => <li key={document._id}><a href={"http://cloudnine.cse356.compas.cs.stonybrook.edu/edit/"+document._id}>{document.name}</a></li>)}</ul>
  </div>
  );
}

export default HomePage;