

export default function handler(req, res) {
    fetch(`http://3.19.218.16:5000/find-user`, {
    //   fetch(`http://3.19.218.16:5000/find-user`, { // used for local testing
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'address': req.headers.address,
      }
    }).then(response => response.json())
    .then(data => {
      console.log(data)
      res.status(200).json(data)
      })
      
  }