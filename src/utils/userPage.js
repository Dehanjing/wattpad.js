const cheerio = require('cheerio').default;

const parseUserContent = ($, status, options) => {
	const result = {
		status: status,
		options: options,
	};
	$("script[type='text/javascript']").each(function (i, elem) {
		let strScript = $(this).html();
		let username = $('a.username.on-navigate').text().trim();
		let userRegExp = new RegExp(username, 'gi');
		if (userRegExp.test(strScript)) {
			userRegExp = new RegExp(`user\.${username}`, 'gi');
			let parseUser = JSON.parse(strScript.replace(userRegExp, 'user').split(' = ')[1].split(/\n/g)[0].slice(0, -1));
			result.result = {
				...parseUser.user.data[0],
				activities: parseUser['user.profile.works'].data,
				recentActivities: parseUser['user.latest.activity.'].data,
			};
		}
	});
	return result;
};

const parseContent = (wp, userPageUrl, options) => async () => {
	return new Promise((resolve, reject) => {
		wp.get(userPageUrl)
			.then((response) => {
				const $ = cheerio.load(response.data);
				const userContent = parseUserContent($, response.status, options);
				return resolve(userContent);
			})
			.catch((error) => reject(error));
	});
};

function userPage(wp, userPageUrl, options) {
	return parseContent(wp, userPageUrl, options);
}

module.exports = userPage;
