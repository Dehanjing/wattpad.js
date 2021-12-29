module.exports = function (contentURI) {
	return new Promise((resolve, reject) => {
		wp.get(contentURI)
			.then((response) => {
				const $ = cheerio.load(response.data);
				let nextPage = $('a.on-navigate.next-part-link').attr('href');
				let result = {
					story: $('.panel.panel-reading.text-center > h1').text().trim(),
					author: $('.author.hidden-lg > a.on-navigate:nth-child(2)').text().trim(),
					stats: {
						views: $('span.reads').text().trim(),
						votes: $('span.votes').text().trim(),
						comments: $('span.comments > a').text().trim(),
					},
					contents: [],
					nextPage: nextPage,
				};
				$('pre > p').each(function (i, elem) {
					result.contents.push($(this).text().trim().replace(/  +/g, ''));
				});
				resolve({
					status: response.status,
					result: result,
				});
			})
			.catch((error) => reject(error));
	});
};
