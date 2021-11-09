# settingz

Dead simple config loader.

[![npm][npm-badge]][npm-url]
[![github][github-badge]][github-url]
![node][node-badge]

[npm-url]: https://www.npmjs.com/package/settingz
[npm-badge]: https://img.shields.io/npm/v/settingz.svg?style=flat-square&logo=npm
[github-url]: https://github.com/airkro/settingz
[github-badge]: https://img.shields.io/npm/l/settingz.svg?style=flat-square&colorB=blue&logo=github
[node-badge]: https://img.shields.io/node/v/settingz.svg?style=flat-square&colorB=green&logo=node.js

## Installation

```bash
npm install settingz --save
```

## Usage

```cjs
const { isReachable, reaching } = require('settingz');

console.log(isReachable('react'));
console.log(isReachable('./file.js'));
console.log(reaching('config.json'));
```
