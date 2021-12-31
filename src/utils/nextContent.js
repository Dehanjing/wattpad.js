const getContent = require('./getContent');
let previousContent = require('./previousContent');

const parseContent = (wp, nextPageUrl, options) => async () => {
	return new Promise((resolve, reject) => {
		getContent(wp, nextPageUrl, options, nextContent)
			.then((response) => {
				return resolve(response);
			})
			.catch((error) => reject(error));
	});
};

function nextContent(wp, nextPageUrl, options) {
	return parseContent(wp, nextPageUrl, options);
}

module.exports = nextContent;
