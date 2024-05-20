var express = require('express');
var router = express.Router();
require('dotenv').config()

const mailjet = require ('node-mailjet')
  .connect(process.env.API_KEY, process.env.SECRET_KEY)

router.post('/', function(req, res) {
  console.log(req);
  const request = mailjet
    .post("send", {'version': 'v3.1'})
    .request({
      "Messages":[
        {
          "From": {
            "Email": "mhkinggcp@gmail.com",
            "Name": "Martin"
          },
          "To": [
            {
              "Email": "mhkinggcp@gmail.com",
              "Name": "Martin"
            }
          ],
          "Subject": "Project NFT",
          "TextPart": "The NFT is here.",
          "HTMLPart": "<h3>Dear passenger 1, welcome to <a href='https://www.mailjet.com/'>Mailjet</a>!</h3><br />May the delivery force be with you!",
          "CustomID": ""
        }
      ]
    })  
  request
    .then((result) => {
      console.log(result.body)
      return res.status(200).send(result);
    })
    .catch((err) => {
      console.log(err.statusCode)
    })
});

module.exports = router;