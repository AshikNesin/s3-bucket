// Native
const fs = require('fs');

const getFilesizeInBytes = filename => {
	const stats = fs.statSync(filename);
	const fileSizeInBytes = stats.size;
	return fileSizeInBytes;
};

module.exports = {
	getFilesizeInBytes
};

