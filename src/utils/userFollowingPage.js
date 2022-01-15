const next = (wp, userFollowingNextPageUrl, options) => {
	return parseContent(wp, userFollowingNextPageUrl, options);
};

const parseContent = (wp, userFollowingUrl, options) => async () => {
	return new Promise((resolve, reject) => {
		wp.get(userFollowingUrl)
			.then((response) => {
				response.data.next = response.data.nextUrl
					? next(wp, response.data.nextUrl, options)
					: () => ({
							status: response.status,
							options: options,
							result: 'last pages of user following page!',
					  });
				delete response.data.nextUrl;
				resolve({
					status: response.status,
					options: options,
					result: response.data,
				});
			})
			.catch((error) => reject(error));
	});
};

function userFollowingPage(wp, userFollowingUrl, options) {
	return parseContent(wp, userFollowingUrl, options);
}

module.exports = userFollowingPage;
