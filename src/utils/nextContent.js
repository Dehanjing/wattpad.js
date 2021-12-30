const getContent = require('./getContent');

const parseContent = (wp, nextPageUrl, options) => async () => {
	let { status, result } = await getContent(wp, nextPageUrl);
	if (result.nextPage) {
		let nextPage = result.nextPage;
		let nextContents = nextContent(wp, result.nextPage, options);
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

function nextContent(wp, nextPageUrl, options) {
	return parseContent(wp, nextPageUrl, options);
}

module.exports = nextContent;
