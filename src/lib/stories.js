let utils = require('../utils');
let cheerio = require('cheerio');
const BASEURL = 'https://www.wattpad.com';

module.exports = function wattpadStories(wp, options) {
	return new Promise((resolve, reject) => {
		wp.get(options.stories)
			.then((response) => {
				const $ = cheerio.load(response.data);
				let nextPage = $('a.on-navigate.next-part-link').attr('href');
				let mainStory = $('span.toc-full > span.info > h2.title.h5').text().trim();
				let story = $('.panel.panel-reading.text-center > h1').text().trim();
				let current = {};
				let previous;
				let previousPage = false;
				let nextPageTitle = '';
				$('ul.table-of-contents > li').filter(function (index, elem) {
					if ($(this).attr('class').includes('active')) {
						current.part = index + 1;
						current.pageTitle = $(this).find('.part-title').text().trim();
						current.page = BASEURL + $(this).find('a.on-navigate').attr('href');
						previousPage = $(this).prev().find('a.on-navigate').attr('href');
						previous = previousPage
							? utils.previousContent(wp, BASEURL + previousPage, options)
							: () => 'this is the first parts of wattpad ' + mainStory;
						previous.part = index || 'Begin of story!';
						previous.pageTitle = $(this).prev().find('.part-title').text().trim() || 'Begin of story!';
						previous.page = previousPage || 'First Page!';
						previous.content = previousPage
							? utils.previousContent(wp, BASEURL + previousPage, options)
							: () => 'this is the first part of wattpad ' + mainStory;
						current.hasPrevious = previousPage ? true : false || false;
						current.hasNext = nextPage ? true : false;
						nextPageTitle = $(this).next().find('.part-title').text().trim();
					}
				});
				let next = nextPage
					? utils.nextContent(wp, nextPage, options)
					: () => 'this is the last parts of wattpad ' + mainStory;
				next.part = nextPage ? current.part + 1 : 'End of story!';
				next.pageTitle = nextPage ? nextPageTitle : 'End of story!';
				next.page = nextPage ? nextPage : 'Last Page!';
				next.content = nextPage
					? utils.nextContent(wp, nextPage, options)
					: () => 'this is the last parts of wattpad ' + mainStory;
				let result = {
					wattpad: mainStory,
					story: story,
					author: $('.author.hidden-lg > a.on-navigate:nth-child(2)').text().trim(),
					stats: {
						views: $('span.reads').text().trim(),
						votes: $('span.votes').text().trim(),
						comments: $('span.comments > a').text().trim(),
					},
					contents: [],
					previous: previous,
					current: current,
					next: next,
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
