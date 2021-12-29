const getContent = require('./getContent');

const parseContent = (nextPageUrl, options) => async () => {
	let { status, result } = await getContent(nextPageUrl);
	if (result.nextPage) {
		let nextPage = result.nextPage;
		let nextContents = nextContent(result.nextPage, options);
		delete result.nextPage;
		return {
			status: status,
			options: options,
			result: {
				...result,
				next: {
					page: nextPage,
					hasNext: true,
					content: nextContents,
				},
			},
		};
	} else {
		delete result.nextPage;
		return {
			status: status,
			options: options,
			result: {
				...result,
				next: {
					page: 'Last Part!',
					hasNext: false,
					content: () => 'this is the last parts of wattpad ' + pageContent.story,
				},
			},
		};
	}
};

function nextContent(nextPageUrl, options) {
	return parseContent(nextPageUrl, options);
}

module.exports = nextContent;
