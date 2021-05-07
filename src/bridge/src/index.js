
const express = require('express');
const fs = require('fs');
const { execSync } = require('child_process');

const port = 8080;
const app = express();

const depositPath = process.env.DEPOSIT_PATH || '../../articles';

app.use(express.text({ limit: '5mb', type: 'application/xml' }));

function getRandomInt(minimum, maximum) {
  return Math.floor(Math.random() * (maximum - minimum + 1) + minimum);
}

app.post('/upload', (req, res) => {
  console.log('upload');

  if (req.is('application/xml'))
  {
    const articleId = getRandomInt(10000, 99999);
    console.log(`Sending ${articleId} to Libero Editor`);
    const filename = `./elife-${articleId}/elife-${articleId}.xml`;
    execSync(`mkdir ./elife-${articleId}`);
    fs.writeFileSync(filename, req.body);
    execSync(`zip ./elife-${articleId}-vor-r1.zip elife-${articleId}/*`);
    execSync(`rm -r ./elife-${articleId}`);
    execSync(`mv ./elife-${articleId}-vor-r1.zip ${depositPath}`);
    res.status(200).json({articleId});
  } else {
    res.status(414).end();
  }
});

const server = app.listen(port, () => {
  console.log(`server started at http://localhost:${port}`);
  process.on('SIGINT', function () {
    server.close(function () {
      process.exit(0);
    });
  });
});