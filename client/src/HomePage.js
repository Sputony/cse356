import { useState, useEffect } from 'react'
import axios from 'axios';

function HomePage() {
  const[html, setHTML] = useState()
  useEffect(() => {
    let url = 'http://cloudnine.cse356.compas.cs.stonybrook.edu/home'
    axios.get(url)
    .then(res => {
      console.log(res)
      setHTML(res.data)
    })
  }, [])


  return (
    <div className="HomePage" dangerouslySetInnerHTML={html}/>
  );
}

export default HomePage;