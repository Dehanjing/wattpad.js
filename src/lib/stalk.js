const cheerio = require('cheerio').default;
let utils = require('../utils');

module.exports = function wattpadStalk(wp, options, BASEURL, hasil = []) {
	let userIndexes;
	let BASEURI = BASEURL;
	BASEURL = decodeURIComponent(
		BASEURL +
			'/v4/search/users/?query=' +
			options.user +
			'&limit=20&offset=0&fields=username%2Cname%2Cavatar%2Cdescription%2CnumLists%2CnumFollowers%2CnumStoriesPublished%2Cbadges%2Cfollowing%2Cstories'
	);
	if (options.hasOwnProperty('userUrl')) BASEURL = options['userUrl'];
	if (options.hasOwnProperty('userIndexes')) {
		userIndexes = parseInt(options.userIndexes) || 0;
		if (isNaN(userIndexes)) throw new TypeError('userIndexes must be typeof number but given input of ' + userIndexes);
	}
	return new Promise((resolve, reject) => {
		wp.get(BASEURL)
			.then((response) => {
				if (typeof response.data === 'object') {
					hasil = response.data.map((data) => {
						data.url = BASEURI + '/user/' + data.username;
						data.userPage = utils.userPage(wp, data.url, options);
						return data;
					});
					if (!userIndexes) {
						resolve({
							status: response.status,
							total: hasil.length,
							options: options,
							result: hasil,
						});
					}
					if (userIndexes > hasil.length)
						throw new RangeError(
							'could not find wattpad story at index position ' +
								userIndexes +
								' from result length ' +
								hasil.length
						);
					return resolve({
						status: response.status,
						total: hasil.length,
						indexes: userIndexes,
						options: options,
						result: hasil[userIndexes - 1],
						raw: JSON.stringify(hasil[userIndexes - 1], null, 2),
					});
				}
				let $ = cheerio.load(response.data);
				$("script[type='text/javascript']").each(function (i, elem) {
					let strScript = $(this).html();
					let queries = $('div.search-term').text().trim().split(' ').join('+');
					let queriesRegExp = new RegExp(queries, 'gi');
					if (queriesRegExp.test(strScript)) {
						let parseScript = JSON.parse(strScript.split(' = ')[1].split(/\n/g)[0].slice(0, -1));
						hasil = parseScript[Object.keys(parseScript)[1]].data.map((data) => {
							data.url = BASEURI + '/user/' + data.username;
							data.userPage = utils.userPage(wp, data.url, options);
							return data;
						});
					}
				});
				if (!userIndexes) {
					return resolve({
						status: response.status,
						total: hasil.length,
						options: options,
						result: hasil,
					});
				}
				if (userIndexes > hasil.length)
					throw new RangeError(
						'could not find wattpad story at index position ' + userIndexes + ' from result length ' + hasil.length
					);
				return resolve({
					status: response.status,
					total: hasil.length,
					indexes: userIndexes,
					options: options,
					result: hasil[userIndexes - 1],
					raw: JSON.stringify(hasil[userIndexes - 1], null, 2),
				});
			})
			.catch((error) => {
				reject(error);
			});
	});
};
