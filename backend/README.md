# Express backend

The Express backend uploads the image to IPFS, then send email.

The routes/index.js uploads the image to IPFS.

Note that there must be an IPFS nodes running in localhost.

The module can be substitute with other storage solutions, such as AWS S3.

Change the code such that the image is uploaded elsewhere, other than IPFS.

The routes/email.js sends the email to the user.

It uses MailJet, but it can be substituted with any email API services.

Please create a .env file with API_KEY and SECRET_KEY from MailJet.

Run npm ci, npm run start to start the service.