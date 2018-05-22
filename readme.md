> Simple AWS S3 Wrapper 🔥

## Install

```
$ npm install s3-bucket
```


## Environment Variables

```
S3_BUCKET_ACCESS_KEY_ID=value
S3_BUCKET_SECRET_ACCESS_KEY=value

S3_BUCKET_NAME=value
S3_BUCKET_REGION=value

```

## Usage

```js
// Don't forgot to import the function 😊
const {
	updateCredentials,
	updateRegion,
	getAllBuckets,
	getUploadUrl,
	uploadFile,
	listFiles,
	deleteFiles,
} = require('s3-bucket');

```

### getAllBuckets()

Yep! Like you've already guessed. It'll list all the buckets in your AWS account.

```js
// Request
getAllBuckets()
	.then(buckets => console.log(buckets));
// Response
{
	Buckets:
	[
		 { Name: 'your-bucket-name', CreationDate: '2017-09-14T13:14:01.000Z' },
	],
  Owner:{ ID: 'your-id-here' }
}

```
---

### getUploadUrl(customParams)
Get Signed Upload URL. Then use that to upload files to upload files directly to S3 without sending it to your server.

#### Required Params
ContentType → content type of the file.
Key → path of that file within your S3 bucket

#### Optional Params
Bucket
ACL → public-read by default
Expires → 60 seconds

```js
// Request
getUploadUrl({
	ContentType: 'application/javascript',
	Key: 'your-dir/test.js'
}).then(res => console.log(res))

// Response
{ signedUrl: 'https://s3.ap-south-1.amazonaws.com/your-bucket-name/your-dir/test.js?all-query-strings' }

```

---


### uploadFile(customParams)
Upload files to your S3 bucket.

#### Required Params
filePath → absolute path to the file
Key → path of that file within your S3 bucket

#### Optional Params
Bucket
ACL → public-read by default
Expires → 60 seconds

```js
// Request
uploadFile({
	filePath: 'path/to/your/file.js',
	Key: 'your-dir/test.js'})
.then(res => console.log(res));

// Response
{ ETag: '"9184ea01719a9444c823f1cb797529c9"',
	url: 'https://your-bucket-name.s3.amazonaws.com/your-dir/test.js'
}

```

---


### listFiles(customParams)
Just list all the files(objects) in your bucket.

#### Optional Params
Bucket

```js
// Request
listFiles({}).then(files => console.log(files))

// Response
{ IsTruncated: false,
  Contents:
   [ { Key: 'your-dir/test.js',
       LastModified: '2017-12-18T09:58:09.000Z',
       ETag: '"fd131f0975cdb3b6422290261866bf01"',
       Size: 383,
       StorageClass: 'STANDARD' },
	],
  Name: 'your-bucket-name',
  Prefix: '',
  MaxKeys: 1000,
  CommonPrefixes: [],
  KeyCount: 31 }
```

---


### deleteFiles(customParams)
Let's delete files 🗑️

#### Required Params
files → path to files (Keys) in array

#### Optional Params
Bucket


```js
// Request
deleteFiles({
	files: ['your-dir/test.js']
})
.then(res => console.log(res));

// Response
{ Deleted: [ { Key: '/your-dir/test.js' } ], Errors: [] }

```

---


### updateCredentials(credentials)

Sometimes we want to set our AWS credentials dynamically.

In that senario we can use updateCredentials() to set the **credentials on the fly**

```js
	const credentials = {
		accessKeyId:'your-aws-access-key',
		secretAccessKey:'your-aws-secret-key'
	};
	updateCredentials(credentials)
```

---


### updateRegion(region)

Setting our S3 region on the fly

```js
	updateRegion('ap-south-1')
```

---

### updateBucketName(bucketName)

Setting our S3 region on the fly

```js
	updateBucketName('new-bucket-name')
```

## TODO
- Handle Missing credentials errors
- File Upload Progress

## License

MIT © [Ashik Nesin](https://ashiknesin.com)
