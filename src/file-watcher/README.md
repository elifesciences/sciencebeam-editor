# File Watcher Service

The File Watcher Service watches a specified directory `/bucket-to-watch` and uploads any newly placed files to a specified S3 bucket. 

We intend for this tooling to make developing using `localstack` to mock S3 easier as `putObject` events which would otherwise have needed to take place on the CLI are automated when the service spots a new file in a given directory. The service is best used as a container with a local dirctory volume mapped to `/bucket-to-watch`.

### Environment Variables

```
S3_BUCKET=someBucketName
AWS_ENDPOINT=http://some-aws-service
```

### docker-compose example

An example docker-compose config block which could be used alongside `localstack`

```
...
s3-file-watcher:
    build:
      context: './file-watcher'
    image: file-watcher:${IMAGE_TAG:-local}
    environment: 
      - S3_BUCKET=kryia
      - AWS_ENDPOINT=http://localstack:4566
    volumes: 
      - "./tmp/kryiaBucket:/bucket-to-watch"
    depends_on:
      - localstack
...
```