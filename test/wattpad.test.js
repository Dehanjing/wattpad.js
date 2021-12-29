const WattPads = require("../src/wattpad");
const wattpad = new WattPads();

// TODO: Set Options

// 1. use .set() method
wattpad.set({
   query: "naruto", // search required option!
   url: WattPads.validURI.url, // parse content (search) option!,
   getIndexes: 3, // get instant indexes of result[array]
   detail: WattPads.validURI.detail, // get full information of stories
   stories: WattPads.validURI.stories, // stories required option!
});
// 2. only set query use .setQuery("string")
wattpad.setQuery("fury");
// 3. set specific options use .setOptions({ object:"Object" })
wattpad.setOptions({ url: "https://www.wattpad.com/search/fury" })

// TODO: example of method request

// 1. Asynchronous
(async() => {
   try {
      let response = await wattpad.search("fury");
      console.log(response);
   } catch (error) {
      console.log(error.stack);
   }
})();

// 2. Callback function
wattpad.detail("https://www.wattpad.com/story/232343303", function(error, response, options) {
   if (error) return console.log(error.stack);
   console.log(response, options);
});

// TODO: method arguments

// 1. first arguments {Null|Object|Function}
// a. it can be null after .set("query", "naruto") been set
const search$1 = async (query) => {
   wattpad.set("query", query);
   let response = await wattpad.search();
   return response;
};
// b. options arguments
const search$2 = async (query) => {
   let response = await wattpad.search({
      query: query
   });
   return response;
};
// c. callback function but the second arguments must be options!
wattpad.search(function(error, response, options) {
   console.log(response);
}, { query: "fury" });

// 2. second arguments {Object|Function}
// a. it can be object same as before
wattpad.detail(() => {}, {
   detail: "https://www.wattpad.com/story/232343303",
});
// b. callback function after first arguments fill in 
wattpad.stories("https://www.wattpad.com/632122261", function(error, response, options) {
   console.log(response);
});

// 3. third arguments {Object}
// a. last arguments only for options after first[string] & second[function] arguments fill in
wattpad.search("https://www.wattpad.com/search/naruto", () => {}, {
   getIndexes: 3
});