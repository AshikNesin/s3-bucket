// Native
const fs = require('fs');
const {promisify} = require('util');

// Packages
const AWS = require('aws-sdk');

// Utilities
const {getFilesizeInBytes} = require('./utils');

// Load config from Environment Variables
const config = {
	accessKeyId: process.env.S3_BUCKET_ACCESS_KEY_ID,
	secretAccessKey: process.env.S3_BUCKET_SECRET_ACCESS_KEY,
	region: process.env.S3_BUCKET_REGION
};

const BucketName = process.env.S3_BUCKET_NAME;

const S3 = new AWS.S3(config);

const updateCredentials = credentials => {
	S3.config.update({
		credentials: new AWS.Credentials(credentials)
	});
};

const updateRegion = region => S3.config.update({region});

// AWS S3 Docs → http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html
const getAllBuckets = promisify(S3.listBuckets).bind(S3);

const getUploadUrl = customParams => {
	// TODO: Throw error if Bucket, Key, ContentType is undefined.
	const params = {
		Expires: 60,
		ACL: 'public-read',
		Bucket: BucketName,
		...customParams
	};
	const getSignedUrlPromise = promisify(S3.getSignedUrl).bind(S3);
	return new Promise((resolve, reject) => {
		getSignedUrlPromise('putObject', params)
			.then(signedUrl => resolve({signedUrl}))
			.catch(err => reject(err));
	});
};

const uploadFile = customParams => {
	// TODO: Throw error if  Bucket, filePath or Key is undefined
	const {filePath} = customParams;

	const params = {
		ACL: 'public-read',
		Bucket: BucketName,
		ContentLength: getFilesizeInBytes(filePath),
		Body: fs.createReadStream(filePath),
		...customParams
	};
	delete params.filePath; // Else it will throw error in putObjectPromise
	const {Bucket, Key} = params;

	const putObjectPromise = promisify(S3.putObject).bind(S3);
	return new Promise((resolve, reject) => {
		putObjectPromise(params)
			.then(response => {
				const url = `https://${Bucket}.s3.amazonaws.com/${Key}`;
				resolve({...response, url});
			})
			.catch(err => reject(err));
	});
};

const listFiles = promisify(S3.listObjectsV2).bind(S3);

const deleteFiles = customParams => {
	const files = customParams.files.map(file => ({Key: file}));
	const params = {
		Bucket: BucketName,
		Delete: {
			Objects: files
		}
	};
	const deleteObjectsPromise = promisify(S3.deleteObjects).bind(S3);
	return new Promise((resolve, reject) => {
		deleteObjectsPromise(params)
			.then(response => resolve(response))
			.catch(err => reject(err));
	});
};

module.exports = {
	updateCredentials,
	updateRegion,
	getAllBuckets,
	getUploadUrl,
	uploadFile,
	listFiles,
	deleteFiles
};
