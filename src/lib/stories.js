let utils = require('../utils');

module.exports = function (options) {
	return new Promise((resolve, reject) => {
		wp.get(options.stories)
			.then((response) => {
				const $ = cheerio.load(response.data);
				let nextPage = $('a.on-navigate.next-part-link').attr('href');
				let story = $('.panel.panel-reading.text-center > h1').text().trim();
				let result = {
					story: story,
					author: $('.author.hidden-lg > a.on-navigate:nth-child(2)').text().trim(),
					stats: {
						views: $('span.reads').text().trim(),
						votes: $('span.votes').text().trim(),
						comments: $('span.comments > a').text().trim(),
					},
					contents: [],
					next: {
						page: nextPage ? nextPage : 'Last Page!',
						hasNext: nextPage ? true : false,
						content: nextPage
							? utils.nextContent(nextPage, options)
							: () => 'this is the last parts of wattpad ' + story,
					},
				};
				$('pre > p').each(function (i, elem) {
					result.contents.push($(this).text().trim().replace(/  +/g, ''));
				});
				resolve({
					status: response.status,
					options: options,
					result: result,
				});
			})
			.catch((error) => reject(error));
	});
};
