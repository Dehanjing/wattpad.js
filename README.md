## Wattpad Scrapper

> **_Simple Wattpad scrapper library_**

```diff
@@ Created on 24-12-21 | Dehanjing @@
+ Update: 1-01-22 | Dehanjing
! happy new year! xixixi
```

## Installation

<h4>
  using npm package manager
</h4>

> _npm install @dhnapi/wattpad.js_

<h4>
  using yarn package manager
</h4>

> _yarn add @dhnapi/wattpad.js_

## Example Request

```javascript
'use strict';
const WattPads = require('@dhnapi/news-api');
let wattpad = new WattPads();

(async () => {
	wattpad.set('query', 'fury');
	let response = await wattpad.search();
	console.log(JSON.stringify(response, null, 2));
})();
```

more examples at **[here](https://github.com/Dehanjing/wattpad.js/blob/master/test/wattpad.test.js)**

## Information

```diff
+ dont forget to star <3
! contribute to this project! ~~~
- please add issue if you having problem with installation

! github: https://github.com/Dehanjing/wattpad.js
```
