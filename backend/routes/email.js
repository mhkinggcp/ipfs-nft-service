var express = require('express');
var router = express.Router();
require('dotenv').config()

const mailjet = require('node-mailjet')
  .apiConnect(process.env.API_KEY, process.env.SECRET_KEY)

router.post('/', async function(req, res) {
  await mailjet
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
   return res.status(200).send({});
});

module.exports = router;