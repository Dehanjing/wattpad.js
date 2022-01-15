const cheerio = require('cheerio');
let utils = require('../utils');

module.exports = function userMetadata(wp, options, BASEURL) {
	let user = BASEURL + '/user/' + options.user;
	var username = options.user;
	if (options.hasOwnProperty('userMetadata')) {
		user = options['userMetadata'];
		username = new URL(user).pathname
			.split('/')
			.filter((i) => i)
			.pop();
	}
	return new Promise((resolve, reject) => {
		utils
			.userPage(wp, user, options)()
			.then((response) => {
				response.result.followingPage = utils.userFollowingPage(
					wp,
					utils.parseApi('user_following').replace('<user>', username),
					options
				);
				resolve(response);
			})
			.catch((error) => reject(error));
	});
};
