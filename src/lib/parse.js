const cheerio = require('cheerio');

module.exports = function parse(wp, options) {
	return new Promise((resolve, reject) => {
		wp.get(options.url)
			.then((response, result = {}) => {
				const $ = cheerio.load(response.data);
				result['status'] = response.status;
				result['options'] = options;
				$('script[type="text/javascript"]').each(function (i, elem) {
					let getScript = $(this).html().trim();
					if (/window\.prefetched/gi.test(getScript)) {
						let parser =
							JSON.parse(
								getScript
									.split('prefetched = ')[1]
									.split(/(;$)/gi)[0]
									.replace(/(sjsjsjdjdemndnx)/g, '')
									.trim()
							) || {};
						result['result'] = Object.keys(parser).map((key) => parser[key]) || {};
					}
				});
				resolve(result);
			})
			.catch((error) => reject(error));
	});
};
