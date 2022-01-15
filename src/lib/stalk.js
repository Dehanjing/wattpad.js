const cheerio = require('cheerio').default;
let utils = require('../utils');

module.exports = function wattpadStalk(wp, options, BASEURL, hasil = []) {
	let getIndexes;
	let BASEURI = BASEURL;
	BASEURL = decodeURIComponent(
		BASEURL +
			'/v4/search/users/?query=' +
			options.user +
			'&limit=20&offset=0&fields=username%2Cname%2Cavatar%2Cdescription%2CnumLists%2CnumFollowers%2CnumStoriesPublished%2Cbadges%2Cfollowing%2Cstories'
	);
	if (options.hasOwnProperty('userUrl')) {
		BASEURL = options['userUrl'];
		options.user = /(?:http(?:s)):\/\/(?:www\.)?wattpad(\.com)\/(search)\/([\d\w\s].+)\/(people)/gi.exec(BASEURL)[3];
	}
	if (options.hasOwnProperty('getIndexes')) {
		getIndexes = parseInt(options.getIndexes) || 0;
		if (isNaN(getIndexes)) throw new TypeError('getIndexes must be typeof number but given input of ' + getIndexes);
	}
	return new Promise((resolve, reject) => {
		wp.get(BASEURL)
			.then((response) => {
				if (typeof response.data === 'object') {
					hasil = response.data.map((data) => {
						data.url = BASEURI + '/user/' + data.username;
						data.userPage = utils.userPage(wp, data.url, options);
						data.followingPage = utils.userFollowingPage(
							wp,
							utils.parseApi('user_following').replace('<user>', data.username),
							options
						);
						return data;
					});
					if (!getIndexes) {
						resolve({
							status: response.status,
							total: hasil.length,
							options: options,
							result: hasil,
						});
					}
					if (getIndexes > hasil.length)
						throw new RangeError(
							'could not find wattpad story at index position ' + getIndexes + ' from result length ' + hasil.length
						);
					return resolve({
						status: response.status,
						total: hasil.length,
						indexes: getIndexes,
						options: options,
						result: hasil[getIndexes - 1],
						raw: JSON.stringify(hasil[getIndexes - 1], null, 2),
					});
				}
				let $ = cheerio.load(response.data);
				$("script[type='text/javascript']").each(function (i, elem) {
					let strScript = $(this).html();
					let queries = $('div.search-term').text().trim().split(' ').join('+');
					let queriesRegExp = new RegExp(queries, 'gi');
					if (queriesRegExp.test(strScript)) {
						let parseScript = JSON.parse(strScript.split('prefetched = ')[1].split(/\n/g)[0].split(/(;$)/)[0]);
						hasil = parseScript[Object.keys(parseScript)[1]].data.map((data) => {
							data.url = BASEURI + '/user/' + data.username;
							data.userPage = utils.userPage(wp, data.url, options);
							data.followingPage = utils.userFollowingPage(
								wp,
								utils.parseApi('user_following').replace('<user>', data.username),
								options
							);
							return data;
						});
					}
				});
				if (!getIndexes) {
					return resolve({
						status: response.status,
						total: hasil.length,
						options: options,
						result: hasil,
					});
				}
				if (getIndexes > hasil.length)
					throw new RangeError(
						'could not find wattpad story at index position ' + getIndexes + ' from result length ' + hasil.length
					);
				return resolve({
					status: response.status,
					total: hasil.length,
					indexes: getIndexes,
					options: options,
					result: hasil[getIndexes - 1],
					raw: JSON.stringify(hasil[getIndexes - 1], null, 2),
				});
			})
			.catch((error) => {
				reject(error);
			});
	});
};
