const fs = require('fs');

function readFileAsync(filePath) {
	return new Promise(function (resolve, reject) {
		fs.readFile(filePath, 'utf8', function (err, contents) {
			if (err) {
				reject(err);
			}
			resolve(contents);
		});
	});
}

function fileStat(filePath) {
	return new Promise(function (resolve, reject) {
		fs.stat(filePath, function (err, stats) {
			if (err) {
				reject(err);
			}

			resolve(stats);
		});
	});
}

module.exports = {
	readFileAsync,
	fileStat
};
