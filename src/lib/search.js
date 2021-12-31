const cheerio = require('cheerio').default;

module.exports = function wattpadSearch(wp, BASEURL, options, hasil = []) {
	let getIndexes;
	BASEURL = decodeURIComponent(
		BASEURL +
			'/v4/search/stories/?query=' +
			options.query +
			'&mature=true&limit=15&fields=stories(id%2Ctitle%2CvoteCount%2CreadCount%2CcommentCount%2Cdescription%2Cmature%2Ccompleted%2Ccover%2Curl%2CnumParts%2CisPaywalled%2Clength%2Clanguage(id)%2Cuser(name)%2ClastPublishedPart(createDate)%2Cpromoted%2Csponsor(name%2Cavatar)%2Ctags%2Ctracking(clickUrl%2CimpressionUrl%2CthirdParty(impressionUrls%2CclickUrls))%2Ccontest(endDate%2CctaLabel%2CctaURL))%2Ctotal%2Ctags%2CnextUrl'
	);
	if (options.hasOwnProperty('search')) BASEURL = options['search'];
	if (options.hasOwnProperty('getIndexes')) {
		getIndexes = parseInt(options.getIndexes) || 0;
		if (isNaN(getIndexes)) throw new TypeError('getIndexes must be typeof number but given input of ' + getIndexes);
	}
	return new Promise((resolve, reject) => {
		wp.get(BASEURL)
			.then((response) => {
				if (typeof response.data === 'object') {
					hasil = response.data.stories;
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
				$('ul > li')
					.find('.story-card')
					.each(function (i, elem) {
						hasil.push({
							title: $(this).find('.title').eq(0).text().trim(),
							url: 'https://www.wattpad.com' + $(this).attr('href').trim(),
							thumbnail: $(this).find('img').attr('src').trim(),
							status: $(this).find('.tag-item').eq(0).text().trim(),
							stats: {
								read: $(this).find('.stats-value').eq(0).text().trim(),
								vote: $(this).find('.stats-value').eq(1).text().trim(),
								chapter: $(this).find('.stats-value').eq(2).text().trim(),
							},
							description: $(this).find('.description').eq(0).text().trim().replace(/  +/g, ''),
						});
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
				return reject(error);
			});
	});
};
