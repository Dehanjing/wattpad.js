const WattPads = require("../src/wattpad");
let wattpad = new WattPads();

wattpad.stories("https://www.wattpad.com/954613667-naruto-life-kebangkitan-kaguya", async (error, response) => {
   if (error) return console.log(error.stack);
   let previous = await response.result.previous();
   let doubleNext = await response.result.next();
   console.log(doubleNext);
});