
export default function handler(req, res) {
  fetch(`http://3.19.218.16:5000/update-email`, {
    // fetch(`3.19.218.16:5000/update-email`, { // used for local testing
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      address: req.headers.address,
      email: req.headers.email
    },
  }).then(response => response.json())
  .then(data => {
    console.log(data)
    res.status(200).json(data)
    })
    
}