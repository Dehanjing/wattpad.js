const WattPads = require("../src/wattpad");
let wattpad = new WattPads();

wattpad.stalk({
   user: "kaguya",
   userIndexes: 3
})
.then(console.log)
.catch(console.error);