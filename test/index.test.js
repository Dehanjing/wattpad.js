const WattPads = require("../src/wattpad");
let wattpad = new WattPads();

wattpad.stalk((e, r, o) => {
   console.log(r);
}, {
   user: "kaguya sama"
});