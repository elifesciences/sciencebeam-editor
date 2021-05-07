const chokidar = require('chokidar');
const AWS = require('aws-sdk');
const fs = require('fs');
const nodePath = require('path');
const fileType = require('file-type');

const s3 = new AWS.S3({ 
  endpoint: process.env.AWS_ENDPOINT, 
  apiVersion: '2006-03-01',
  accessKeyId: 'accessKeyId',
  secretAccessKey: 'secretAccessKey', 
  s3ForcePathStyle: true 
});
const watcher = chokidar.watch('/bucket-to-watch');
console.log('listening for files and mapping to bucket: ' + process.env.S3_BUCKET);
watcher
  .on('add', async path => {
    console.log(`File ${path} has been added`);
    const fileContent = fs.readFileSync(path);
    const { mime: ContentType } = await fileType.fromBuffer(fileContent);
    var params = {
      Body: fileContent, 
      Bucket: process.env.S3_BUCKET, 
      Key: nodePath.basename(path),
      ContentType 
     };
     s3.putObject(params, function(err, data) {
       if (err) console.log(err, err.stack);
       else     console.log(data); 
     });
  })