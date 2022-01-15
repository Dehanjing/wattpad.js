const WattPads = require("../src/wattpad");
let wattpad = new WattPads();

wattpad.userMetadata("Tobi__", function (error, response, options) {
   if (error) return console.log(error.stack);
   console.log(response);
});