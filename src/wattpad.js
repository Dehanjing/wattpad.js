const axios = require('axios').default;
const wp = axios.create({
	headers: {
		Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
		Cookie: 'lang=1; locale=en_US; wp_id=04d53990-6919-4b2b-9053-29ada5b3b44d; fs__exp=1; sn__time=j:null; adMetrics=0; _pbeb_=0; ff=1; dpr=2; tz=-8; signupFrom=search; prSu=true;',
		'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/93.0.4577.22 Safari/537.36',
	},
});
const lib = require('./lib');

// wattpad hostname
const BASEURL = 'https://www.wattpad.com';

// WattPads Constructor (class.prototype)
const WattPads = function WattPads() {
	this.BASEURL = BASEURL;
	this.RegExp = {
		BASEURL: /^(?:http(?:s)):\/\/(?:www\.)?wattpad(\.com)/gi,
		search: /^(?:http(?:s)):\/\/(?:www\.)?wattpad(\.com)\/(search)/gi,
		detail: /^(?:http(?:s)):\/\/(?:www\.)?wattpad(\.com)\/(story)+\/(\d+)/gi,
		stories: /^(?:http(?:s)):\/\/(?:www\.)?wattpad(\.com)\/(\d+)/gi,
	};
	this.validURI = WattPads.validURI;
	this.__options__ = WattPads.__options__;
	this.methods = {};
	this.options = {};
};

// WattPads EndPoint URI (static)
WattPads.validURI = {
	BASEURL: BASEURL + '/',
	search: BASEURL + '/search/naruto',
	url: BASEURL + '/search/naruto',
	detail: BASEURL + '/story/232343303',
	stories: BASEURL + '/632122261',
};

// Options default
WattPads.__options__ = {
	query: String,
	url: String,
	getIndexes: Number,
	detail: String,
	story: String,
};

/**
 *
 * Set your options
 * @param {String|Object} Keys - Arguments[0] is a Key | Object key
 * @param {String} Values - if first arguments is a key (string)
 * @example .set("query", "fury") | .set({ query: "fury" })
 *
 */

WattPads.prototype.set = function set(keys, values) {
	this.methods['set'] = this.set;
	if (typeof keys !== 'string') {
		for (var key in keys) {
			this.options[key] = keys[key] === 'true' ? true : keys[key] === 'false' ? false : keys[key];
		}
		return this;
	}
	if (!values) throw new SyntaxError('values must be set after keys!');
	this.options[keys] = values === 'true' ? true : values === 'false' ? false : values;
	return this;
};

/**
 *
 * setQuery | option of search query
 * @param {String} Query - required option to call search[method]
 * @example .setQuery("fury")
 *
 */

WattPads.prototype.setQuery = function setQuery(query) {
	if (!query) throw new Error('Please insert query to search wattpad');
	this.options['query'] = query;
	this.methods['setQuery'] = this.setQuery;
	return this;
};

/**
 *
 * setOptions | similar method .set()
 * @param {String|Object} Keys - Arguments[0] is a Key | Object key
 * @param {String} Values - if first arguments[0] is a key (string)
 * @example .setOptions("query", "fury") | .setOptions({ query: "fury" })
 *
 */

WattPads.prototype.setOptions = function setOptions(keys, values) {
	this.methods['setOptions'] = this.setOptions;
	if (typeof keys !== 'string') {
		for (var key in keys) {
			this.options[key] = keys[key] === 'true' ? true : keys[key] === 'false' ? false : keys[key];
		}
		return this;
	}
	if (!values) throw new SyntaxError('values must be set after keys!');
	this.options[keys] = values === 'true' ? true : values === 'false' ? false : values;
	return this;
};

/**
 *
 * Search | main method uses for search story(wattpad)
 * @param {Null|String|Function|Object} arguments[0] - if options[query] been set, first argument can be null(promise)|callback(error, response, options)|object(options)
 * @param {Null|Function|Object} arguments[1] - if method call is asynchronous second arguments can be null(promise) <callback(error, response, options)|object(options)>
 * @returns {Promise} search result[object]
 *
 */

WattPads.prototype.search = async function search() {
	let fn = () => {};
	this.methods['search'] = this.search;
	let query = typeof arguments[0] === 'string' ? arguments[0] : '';
	if (!query && this.options['query']) query = this.options['query'];
	this.options['query'] = query;
	if (query.match(this.RegExp['BASEURL']) || (this.options['url'] && this.options['url'].match(this.RegExp['BASEURL']))) {
		query = query || this.options['url'];
		if (!this.RegExp['search'].test(query)) throw new URIError('Invalid WattPad [search] URI!');
		this.options['url'] = query;
	}
	if (typeof arguments[2] === 'object' || typeof arguments[1] === 'object' || typeof arguments[0] === 'object') {
		let thisArguments = arguments[2] || arguments[1] || arguments[0];
		if (Array.isArray(thisArguments) || thisArguments === null) this;
		typeof thisArguments === 'object' ? this.set(thisArguments) : '';
	}
	if (!this.options['query']) throw new Error('please fill in query || url parameter!');
	if (this.options['url']) delete this.options['query'];
	return new Promise((resolve, reject) => {
		lib.search(wp, this.BASEURL, this.options)
			.then((response) => {
				fn = typeof arguments[1] === 'function' ? arguments[1] : typeof arguments[0] === 'function' ? arguments[0] : fn;
				fn(null, response, this.options);
				resolve(response);
			})
			.catch((error) => {
				reject(error);
				if (typeof fn === 'function') fn(error, null, this.options);
			});
	});
};

/**
 *
 * Detail | get full information of wattpad story<URI>
 * @param {Null|String|Function|Object} arguments[0] - if options[detail] been set, first argument can be null(promise) callback(error, response, options)|object(options)
 * @param {Null|Function|Object} arguments[1] - if method call is asynchronous second arguments can be null(promise) <callback(error, response, options)|object(options)>
 * @returns {Promise} detail information result[object]
 *
 */

WattPads.prototype.detail = async function () {
	let fn = () => {};
	this.methods['detail'] = this.detail;
	let detail = typeof arguments[0] === 'string' ? arguments[0] : '';
	if (!detail && this.options['detail']) detail = this.options['detail'];
	this.options['detail'] = detail;
	if (typeof arguments[2] === 'object' || typeof arguments[1] === 'object' || typeof arguments[0] === 'object') {
		let thisArguments = arguments[2] || arguments[1] || arguments[0];
		if (Array.isArray(thisArguments) || thisArguments === null) this;
		typeof thisArguments === 'object' ? this.set(thisArguments) : '';
		detail = thisArguments['detail'] ? thisArguments['detail'] : '';
	}
	if (!this.options['detail'] && !arguments[0]) throw new Error('arguments at position [0] must be fill in!');
	if (!detail || !this.options['detail']) throw new Error('please fill in detail[url] parameter!');
	if (!this.RegExp['detail'].test(this.options['detail'])) throw new URIError('Invalid WattPad [story] URI');
	return new Promise(async (resolve, reject) => {
		lib.detail(wp, this.options, this.BASEURL)
			.then((response) => {
				fn = typeof arguments[1] === 'function' ? arguments[1] : typeof arguments[0] === 'function' ? arguments[0] : fn;
				fn(null, response, this.options);
				resolve(response);
			})
			.catch((error) => {
				fn(error, null, this.options);
				reject(error);
			});
	});
};

/**
 *
 * Stories | main method use to get content of stories story(wattpad)
 * @param {Null|String|Function|Object} arguments[0] - if options[stories] been set, first argument can be null(promise)|callback(error, response, options)|object(options)
 * @param {Null|Function|Object} arguments[1] - if method call is asynchronous second arguments can be null(promise) <callback(error, response, options)|object(options)>
 * @returns {Promise} story content result[object]
 *
 */

WattPads.prototype.stories = async function () {
	let fn = () => {};
	this.methods['stories'] = this.stories;
	let stories = typeof arguments[0] === 'string' ? arguments[0] : '';
	if (!stories && this.options['stories']) stories = this.options['stories'];
	if (typeof arguments[2] === 'object' || typeof arguments[1] === 'object' || typeof arguments[0] === 'object') {
		let thisArguments = arguments[2] || arguments[1] || arguments[0];
		if (Array.isArray(thisArguments) || thisArguments === null) this;
		typeof thisArguments === 'object' ? this.set(thisArguments) : '';
		stories = thisArguments['stories'] ? thisArguments['stories'] : '';
	}
	this.options['stories'] = stories;
	if (!this.options['stories'] && !arguments[0]) throw new Error('arguments at position [0] must be fill in!');
	if (!stories || !this.options['stories']) throw new Error('please fill in stories[url] parameter!');
	if (!this.RegExp['stories'].test(this.options['stories'])) throw new URIError('Invalid WattPad stories[story] URI');
	return new Promise((resolve, reject) => {
		lib.stories(wp, this.options)
			.then((response) => {
				fn = typeof arguments[1] === 'function' ? arguments[1] : typeof arguments[0] === 'function' ? arguments[0] : fn;
				fn(null, response, this.options);
				resolve(response);
			})
			.catch((error) => {
				fn(error, null, this.options);
				reject(error);
			});
	});
};

module.exports = WattPads;
