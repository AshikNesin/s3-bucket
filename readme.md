> Easily upload files to your AWS S3 Buckets


## Install

```
$ npm install s3-bucket
```


## Environment Variables

```
AWS_ACCESS_KEY_ID=value
AWS_SECRET_ACCESS_KEY=value

AWS_S3_BUCKET_NAME=value
AWS_S3_REGION=value

```

## Usage

```js
const { getSignedUrl, uploadFile } = require('s3-bucket');

// Get a signed URL for a file using which we can upload file from client
getSignedUrl({ Key, ContentType });
//=> Objects which contains signedRequest URL

// Upload file to S3 Bucket
uploadFile({ Key, filePath })
//=> {url: "http://xyz.s3.amazonaws.com/hello.txt"}

```

## License

MIT © [Ashik Nesin](https://ashiknesin.com)
