'use strict';
const fs = require('fs');
const AWS = require('aws-sdk');
const {fileStat} = require('./utils');

const config = {
	accessKeyId: process.env.AWS_ACCESS_KEY_ID,
	secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
	region: process.env.AWS_S3_REGION
};
const BucketName = process.env.AWS_S3_BUCKET_NAME;

const S3 = new AWS.S3(config);

const getSignedUrl = ({
	Key,
	ContentType,
	Bucket = BucketName,
	Expires = 60,
	ACL = 'public-read'
}) => {
	const params = {
		Bucket,
		Key,
		ContentType,
		Expires,
		ACL
	};
	return new Promise(function (resolve, reject) {
		S3.getSignedUrl('putObject', params, function (error, signedRequest) {
			if (error) {
				reject(error);
			} else {
				const response = {
					signedRequest: signedRequest,
					url: `http://${Bucket}.s3.amazonaws.com/${Key}`
				};
				resolve(response);
			}
		});
	});
};

const putObject = ({Key, Body, ContentLength, Bucket = BucketName}) => {
	const params = {
		Bucket,
		Key,
		Body,
		ContentLength,
		ACL: 'public-read'
	};
	console.log(params);
	return new Promise(function (resolve, reject) {
		S3.putObject(params, (error, data) => {
			if (error) {
				reject(error);
			} else {
				const response = {
					url: `http://${Bucket}.s3.amazonaws.com/${Key}`,
					data
				};
				resolve(response);
			}
		});
	});
};

const uploadFile = ({filePath, Key}) => {
	return new Promise(function (resolve, reject) {
		fileStat(filePath)
			.then(fileInfo => {
				const bodyStream = fs.createReadStream(filePath);
				return putObject({
					Key,
					Body: bodyStream,
					ContentLength: fileInfo.size
				});
			})
			.then(res => resolve(res))
			.catch(err => reject(err));
	});
};

module.exports = {
	getSignedUrl,
	uploadFile
};
