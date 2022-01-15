let fs = require('fs');
let apiTXT = fs.readFileSync(__dirname + '/api.txt').toString();

module.exports = function parseApi(keys, object = {}) {
	let parser = apiTXT.split('\n');
	parser.forEach((val, i, arr) => {
		let keys = val.split('=')[0].trim();
		let vals = val.split('=')[1].trim();
		object[keys] = vals;
	});
	if (!keys) return object;
	return object[keys] ? object[keys] : {};
};
