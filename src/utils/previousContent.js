const getContent = require('./getContent');

const parseContent = (wp, previousPageUrl, options) => async () => {
	return new Promise((resolve, reject) => {
		getContent(wp, previousPageUrl, options, previousContent)
			.then((response) => {
				return resolve(response);
			})
			.catch((error) => reject(error));
	});
};

function previousContent(wp, previousPageUrl, options) {
	return parseContent(wp, previousPageUrl, options);
}

module.exports = previousContent;
