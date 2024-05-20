var express = require('express');
var router = express.Router();
require('dotenv').config()

const mailjet = require('node-mailjet')
  .apiConnect(process.env.API_KEY, process.env.SECRET_KEY)

router.post('/', function(req, res) {
  const request = mailjet
    .post("send", {'version': 'v3.1'})
    .request({
      "Messages":[
        {
          "From": {
            "Email": "mhkinggcp@gmail.com",
            "Name": "Martin King"
          },
          "To": [
            {
              "Email": req.body.email,
              "Name": "Martin"
            }
          ],
          "Subject": "Project NFT",
          "HTMLPart": "<p><h3>Dear user, Thank you for using Project NFT.</h3></p><p>Please find your nft metadata at " + req.body.nftMetadata + ".</p>",
          "CustomID": ""
        }
      ]
    })  
  request
    .then((result) => {
      return res.status(200).send(result);
    })
    .catch((err) => {
      console.log(err.statusCode)
    })
});

module.exports = router;