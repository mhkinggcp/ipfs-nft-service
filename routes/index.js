var express = require('express');
var router = express.Router();

router.post('/upload', async function(req, res) {
  const bufferList = [];
  if (req.busboy) {
    let buffer = new Buffer.from('');
    req.busboy.on('file', (name, file, info) => {
      const { filename, encoding, mimeType } = info;
      console.log(
        `File [${name}]: filename: %j, encoding: %j, mimeType: %j`,
        filename,
        encoding,
        mimeType
      );
      file.on('data', (data) => {
        bufferList.push(data);
        console.log(`File [${name}] got ${data.length} bytes`);
      }).on('close', () => {
        console.log(`File [${name}] done`);
      });
    });
  }

  const { create } = await import('ipfs-http-client')
  const ipfs = await create();
  let result = {};
  const buffer = Buffer.concat(bufferList);
  result = await ipfs.add(buffer);

  console.log(result);
  return res.status(200).send(result);
});

module.exports = router;
