const WattPads = require("../src/wattpad");
const wattpad = new WattPads();

// TODO: Set Options

// 1. use .set() method
wattpad.set({
   query: "naruto", // search required option!
   url: WattPads.validURI.url, // parse content (search) option!
   getIndexes: 3, // get instant indexes of result[array]
   detail: WattPads.validURI.detail, // get full information of stories
   stories: WattPads.validURI.stories, // stories required option!
   user: "kaguya sama", // stalk required option to stalk wattpad user!
   userUrl: wattpad.validURI.stalk // parse content (stalk) option
});
// 2. set key and value use .set("key", "value")
wattpad.set("query", "fury");
// 3. only set query use .setQuery("string")
wattpad.setQuery("fury");
// 4. set specific options use .setOptions({ object:"Object" })
wattpad.setOptions({ url: "https://www.wattpad.com/search/fury" });

// TODO: list of wattpad url

console.log(wattpad.validURI);
/*
   output:
   {
      BASEURL: 'https://www.wattpad.com/',
      search: 'https://www.wattpad.com/search/naruto',
      url: 'https://www.wattpad.com/search/naruto',
      detail: 'https://www.wattpad.com/story/232343303',
      stories: 'https://www.wattpad.com/632122261',
      stalk: 'https://www.wattpad.com/search/kaguya+sama/people',
   }
*/

// TODO: example of parse method

// you can pass any wattpad url [only that has prefetched data]
wattpad.parse("https://www.wattpad.com/stories/killmill", function(error, response, options) {
   if (error) return console.log(error.stack);
   console.log(response);
});

// TODO: example of search method

wattpad.set({
   query: "fury" // set option for query <string|required>
});
wattpad.search((error, response, options) => {
   if (error) return console.error(error.stack);
   console.log(response, options);
});

// TODO: example of detail method

wattpad.detail((error, response, options) => {
   if (error) return console.error(error.stack);
   console.log(response, options);
}, { detail: "https://www.wattpad.com/story/232343303" });

// TODO: example of stories method

wattpad.stories("https://www.wattpad.com/917284601-naruto-life-sadness")
.then((response) => console.log(response))
.catch((error) => console.error(error.stack));

// TODO: example of stalk method

wattpad.stalk({ user: "kaguya sama", userIndexes: 3 }, function (error, response, options) {
   if (error) return console.log(error.stack);
   console.log(response);
});

// TODO: example of userMetadata method

// 1. use user url wattpad
wattpad.userMetadata("https://www.wattpad.com/user/Tobi__", function (error, response, options) {
   if (error) return console.log(error.stack);
   console.log(response);
});

// 2. use user username wattpad
wattpad.userMetadata("Tobi__", function (error, response, options) {
   if (error) return console.log(error.stack);
   console.log(response);
});

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

// TODO: Example chain promise to get stories content!

wattpad.search("fury", {
   getIndexes: 2
})
.then(({ result }) => wattpad.detail(result.url))
.then(({ result }) => wattpad.stories(result.tableOfContents.firstContent))
.then(async (response) => {
   let partOne = response.result;
   console.log("first part - story " + partOne.story, partOne);
   let partTwo = partOne.next();
   console.log("second parts - story " + partTwo.result.story, partTwo);
   let partThree = partTwo.result.next();
   console.log("third parts - story " + partThree.result.story, partThree);
   let previous = await response.result.previous(); // get previous part
   console.log("previous part of current part", previous);
   let next = await response.result.next(); // get next part
   console.log("next part of current part", next);
});