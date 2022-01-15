const axios = require('axios').default;
const cheerio = require('cheerio').default;
const wp = axios.create({
	headers: {
		Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
		Cookie: 'wp_id=04d53990-6919-4b2b-9053-29ada5b3b44d; ff=1; dpr=2; tz=-8; fs__exp=3; G_ENABLED_IDPS=google; token=358653290:2:1640948701:EPeJA04AZ8PreZxeqmMw0ML3q1ZP63L6fMeX11iskS_c3gKzL7MAswMNq5hiF6nq; isStaff=1; signupFrom=search; uuid=b80854a9-bdea-4c56-e056-5a088ec80012; lang=20; locale=id_ID;',
		'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/93.0.4577.22 Safari/537.36',
	},
});
const lib = require('./lib');

// wattpad hostname
const BASEURL = 'https://www.wattpad.com';

// WattPads Constructor (class.prototype)
const WattPads = function WattPads() {
	this.BASEURL = BASEURL;
	this.RegExp = WattPads.RegExp;
	this.validURI = WattPads.validURI;
	this.__options__ = WattPads.__options__;
	this.methods = {};
	this.options = {};
	this.methods.prototype = Object.getOwnPropertyNames(WattPads.prototype);
};

// WattPads EndPoint RegExp (static)
WattPads.RegExp = {
	BASEURL: /(http(s)?):\/\/(?:www\.)?wattpad(\.com)/i,
	url: /(http(s)?):\/\/(?:www\.)?wattpad(\.com)\/([\d\w]+)\/([\d\s\w]+)/i,
	search: /(http(s)?):\/\/(?:www\.)?wattpad(\.com)\/(search)\/([\d\w\s].+)/i,
	detail: /(http(s)?):\/\/(?:www\.)?wattpad(\.com)\/(story)+\/(\d+)/i,
	stories: /(http(s)?):\/\/(?:www\.)?wattpad(\.com)\/(\d+)/i,
	stalk: /(http(s)?):\/\/(?:www\.)?wattpad(\.com)\/(search)\/([\d\w\s].+)\/(people)/i,
	userMetadata: /(http(?:s)?:\/\/)((?:www\.)?wattpad(?:\.com))\/(user)\/([\d\w]+)/i,
};

// WattPads EndPoint URI (static)
WattPads.validURI = {
	BASEURL: BASEURL + '/',
	url: BASEURL + '/any/any',
	search: BASEURL + '/search/naruto',
	detail: BASEURL + '/story/232343303',
	stories: BASEURL + '/632122261',
	stalk: BASEURL + '/search/kaguya+sama/people',
	userMetadata: BASEURL + '/user/Tobi__',
};

// Options default
WattPads.__options__ = {
	query: String, // wp.search() <param> options
	user: String, // wp.stalk() <user> options
	url: String, // wp.parse() <url> options
	getIndexes: Number, // get indexes of result[array] <numeric> options
	search: String, // wp.search() <url> options
	detail: String, // wp.detail() <url> options
	stories: String, // wp.stories() <url> options
	stalk: String, // wp.stalk() <user-url> options
	userMetadata: String, // wp.userMetadata() <url> options
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
 * Parse | the method to parsing content [prefetched] of wattpad
 * @param {Null|String|Function|Object} arguments[0] - if options[url] been set, first argument can be null(promise)|callback(error, response, options)|object(options)
 * @param {Null|Function|Object} arguments[1] - if method call is asynchronous second arguments can be null(promise) <callback(error, response, options)|object(options)>
 * @returns {Promise} <json parse> result[object]
 *
 */

WattPads.prototype.parse = async function parseContent() {
	this.methods['parse'] = this.parse;
	let fn = () => {};
	let url = typeof arguments[0] === 'string' ? arguments[0] : '';
	if (!url && this.options['url']) url = this.options['url'];
	this.options['url'] = url;
	if (typeof arguments[2] === 'object' || typeof arguments[1] === 'object' || typeof arguments[0] === 'object') {
		let thisArguments = arguments[2] || arguments[1] || arguments[0];
		if (Array.isArray(thisArguments) || thisArguments === null) void 0;
		typeof thisArguments === 'object' ? this.set(thisArguments) : '';
	}
	if (!this.options['url']) throw new Error('please provide url[WattPad] to continue');
	if (!this.RegExp['BASEURL'].test(this.options['url'])) throw new URIError('Invalid Url[WattPad]');
	if (this.RegExp['stalk'].test(this.options['url'])) {
		this.options['stalk'] = this.options['url'];
		return this.stalk(...arguments);
	}
	if (this.RegExp['search'].test(this.options['url'])) {
		this.options['search'] = this.options['url'];
		return this.search(...arguments);
	}
	if (this.RegExp['detail'].test(this.options['url'])) {
		this.options['detail'] = this.options['url'];
		return this.detail(...arguments);
	}
	if (this.RegExp['stories'].test(this.options['url'])) {
		this.options['stories'] = this.options['url'];
		return this.stories(...arguments);
	}
	if (this.RegExp['userMetadata'].test(this.options['url'])) {
		this.options['userMetadata'] = this.options['url'];
		return this.userMetadata(...arguments);
	}
	return new Promise((resolve, reject) => {
		lib.parse(wp, this.options)
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
 * Search | main method use to search story(wattpad)
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
	if (typeof arguments[2] === 'object' || typeof arguments[1] === 'object' || typeof arguments[0] === 'object') {
		let thisArguments = arguments[2] || arguments[1] || arguments[0];
		if (Array.isArray(thisArguments) || thisArguments === null) this;
		typeof thisArguments === 'object' ? this.set(thisArguments) : '';
	}
	if (query.match(this.RegExp['BASEURL']) || (this.options['search'] && this.options['search'].match(this.RegExp['BASEURL']))) {
		query = query || this.options['search'];
		if (!this.RegExp['search'].test(query)) throw new URIError('Invalid WattPad [search] URI!');
		this.options['search'] = query;
	}
	if (!this.options['query']) throw new Error('please fill in query || url parameter!');
	if (this.options['search']) delete this.options['query'];
	return new Promise((resolve, reject) => {
		lib.search(wp, this.BASEURL, this.options)
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
 * Detail | get full information of wattpad story<URI>
 * @param {Null|String|Function|Object} arguments[0] - if options[detail] been set, first argument can be null(promise) callback(error, response, options)|object(options)
 * @param {Null|Function|Object} arguments[1] - if method call is asynchronous second arguments can be null(promise) <callback(error, response, options)|object(options)>
 * @returns {Promise} detail information result[object]
 *
 */

WattPads.prototype.detail = async function detail() {
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

WattPads.prototype.stories = async function stories() {
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

/**
 *
 * Stalk | search user in wattpad including userMetadata each user
 * @param {Null|String|Function|Object} arguments[0] - if options[user] been set, first argument can be null(promise)|callback(error, response, options)|object(options)
 * @param {Null|Function|Object} arguments[1] - if method call is asynchronous second arguments can be null(promise) <callback(error, response, options)|object(options)>
 * @returns {Promise} stalk result[object]
 *
 */

WattPads.prototype.stalk = async function stalk() {
	let fn = () => {};
	this.methods['stalk'] = this.stalk;
	let users = typeof arguments[0] === 'string' ? arguments[0] : '';
	if (!users && this.options['stalk']) users = this.options['users'];
	this.options['users'] = users;
	if (typeof arguments[2] === 'object' || typeof arguments[1] === 'object' || typeof arguments[0] === 'object') {
		let thisArguments = arguments[2] || arguments[1] || arguments[0];
		if (Array.isArray(thisArguments) || thisArguments === null) this;
		typeof thisArguments === 'object' ? this.set(thisArguments) : '';
	}
	if (users.match(this.RegExp['BASEURL']) || (this.options['stalk'] && this.options['stalk'].match(this.RegExp['BASEURL']))) {
		users = users || this.options['stalk'];
		if (!this.RegExp['stalk'].test(users)) throw new URIError('Invalid WattPad [search] user URI!');
		this.options['stalk'] = users;
	}
	this.options['users'] = this.options['users'].split(' ').join('+');
	if (!this.options['users']) throw new Error('please fill in user || stalk parameter!');
	if (this.options['stalk']) delete this.options['users'];
	return new Promise((resolve, reject) => {
		lib.stalk(wp, this.options, this.BASEURL, this.RegExp['stalk'])
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
 * userMetadata | get metadata of wattpad user <stalk>
 * @param {Null|String|Function|Object} arguments[0] - if options[user] been set, first argument can be null(promise)|callback(error, response, options)|object(options)
 * @param {Null|Function|Object} arguments[1] - if method call is asynchronous second arguments can be null(promise) <callback(error, response, options)|object(options)>
 * @returns {Promise} userMetadata result[object]
 *
 */

WattPads.prototype.userMetadata = async function userMetadata(fn = () => {}) {
	this.methods['userMetadata'] = this.userMetadata;
	let user = typeof arguments[0] === 'string' ? arguments[0] : '';
	if (!user && this.options['userMetadata']) user = this.options['userMetadata'];
	this.options['user'] = user;
	if (typeof arguments[2] === 'object' || typeof arguments[1] === 'object' || typeof arguments[0] === 'object') {
		let thisArguments = arguments[2] || arguments[1] || arguments[0];
		if (Array.isArray(thisArguments) || thisArguments === null) this;
		typeof thisArguments === 'object' ? this.set(thisArguments) : '';
	}
	if (
		user.match(this.RegExp['BASEURL']) ||
		(this.options['userMetadata'] && this.options['userMetadata'].match(this.RegExp['BASEURL']))
	) {
		user = user || this.options['userMetadata'];
		if (!this.RegExp['userMetadata'].test(user)) throw new URIError('Invalid WattPad [user] URI!');
		this.options['userMetadata'] = user;
	}
	this.options['user'] = this.options['user'].split(' ').join('-');
	if (!this.options['user']) throw new Error('please fill in user || userMetadata parameter!');
	if (this.options['userMetadata']) delete this.options['user'];
	return new Promise((resolve, reject) => {
		lib.userMetadata(wp, this.options, this.BASEURL)
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
