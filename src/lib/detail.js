module.exports = function wattpadS(options, BASEURL) {
	return new Promise((resolve, reject) => {
		wp.get(options.detail)
			.then(async (response) => {
				let $ = cheerio.load(response.data);
				let details = {
					title: $('.story-info__title').text().trim(),
					url: options.detail,
					cover: $('.story-cover > img').attr('src'),
					author: $('.author-info__username').eq(0).text().trim(),
					stats: {
						status: $('.story-badges > .sr-only').text().trim().split(', ')[0],
						publish: $('.story-badges > .sr-only').text().trim().split(', ')[1],
						views: $('span.stats-value').eq(0).text().trim(),
						votes: $('span.stats-value').eq(1).text().trim(),
						parts: $('span.stats-value').eq(2).text().trim(),
						time: $('span.stats-value').eq(3).text().trim(),
					},
					tagList: [],
					description: $('pre.description-text').text().trim().replace(/  +/g, ''),
					tableOfContents: {
						lastUpdate: $('.table-of-contents.hidden-xxs')
							.find('.table-of-contents__last-updated')
							.text()
							.trim(),
						firstContent: BASEURL + $('a.btn-primary.read-btn').attr('href'),
						contents: [],
					},
				};
				$('.left-container')
					.find('ul.tag-items > li > a')
					.each(function (i, elem) {
						details.tagList.push($(this).text().trim());
					});
				$('.table-of-contents.hidden-xxs')
					.find('a.story-parts__part')
					.each(function (i, elem) {
						details.tableOfContents.contents.push({
							[$(this).find('div').text().trim()]: BASEURL + $(this).attr('href'),
						});
					});
				resolve({
					status: response.status,
					options: options,
					result: details,
				});
			})
			.catch((error) => reject(error));
	});
};
