<div align="center">
  <img src="./docs/logo.png" alt="StormDB logo">

  <p>🌩️ StormDB is a tiny, lightweight, 0 dependency, easy-to-use JSON-based database that allows users to quickly and easily achieve data persistence by provided an engine to store and access JSON data, for NodeJS the browser or Electron.</p>

  <a href="https://travis-ci.org/TomPrograms/stormdb">
    <img src="https://travis-ci.org/TomPrograms/stormdb.svg?branch=master">
  </a>
  <a href="https://coveralls.io/github/TomPrograms/stormdb">
    <img src="https://coveralls.io/repos/github/TomPrograms/stormdb/badge.svg?branch=master&service=github">
  </a>
  <a href="https://npmjs.com/package/stormdb">
    <img src="https://img.shields.io/npm/v/stormdb?color=green">
  </a>
  <a href="https://bundlephobia.com/result?p=stormdb">
    <img src="https://img.shields.io/bundlephobia/minzip/stormdb?color=green">
  </a>
  <img src="https://img.shields.io/badge/dependencies-0-brightgreen?color=blue">
  <a href="./LICENSE">
    <img src="https://img.shields.io/badge/license-MIT-blue">
  </a>
</div>

<br>

> Example: Add a post entry under users.tom and save it to the database.

```js
db.get("users")
  .get("tom")
  .push({ title: "Post 1" })
  .save();
```

## Features

- 🏎️ [Blazingly Fast Speeds](./docs/speed.md) - Fast read and write speeds, even when handling large data.
- 📦 [Tiny Size](https://bundlephobia.com/result?p=stormdb) - Tiny source code size allows for blazingly fast loading when speed matters.
- ⚡️ Versatile - Can be used with NodeJS, in the browser or in Electron.

## Usage

Install StormDB through NPM:

```
$ npm i stormdb
```

Basic usage with NodeJS:

```js
const StormDB = require("stormdb");

// start db with "./db.stormdb" storage location
const engine = new StormDB.localFileEngine("./db.stormdb");
const db = new StormDB(engine);

// set default db value if db is empty
db.default({ users: [] });

// add new users entry
db.get("users").push({ name: "tom" });

// update username of first user
db.get("users")
  .get(0)
  .get("name")
  .set("jeff");

// save changes to db
db.save();
```

The `db.stormdb` database file is updated to:

```js
{
  "users": [
    {"name":"jeff"}
  ]
}
```

Typescript Usage:

```ts
import StormDB from "stormdb";

// start db with "./db.stormdb" storage location
const engine = new StormDB.localFileEngine("./db.stormdb");
const db = new StormDB(engine);
```

StormDB is designed to be flexible, and can be used in NodeJS, the browser or even Electron with very small adaptations to the code. Examples usages can be seen below:

- [Browser Usage](./examples/browser.md)
- [NodeJS Server](./examples/node.md)

## Engine API

For expanding functionality, each database initialized can be expanded with the following options, in the format `new Engine(path, options);`.

- `serialize` - function to serialize data before writing it to the database.
- `deserialize` - function to deserialize data from the database.

## Database Operations Examples

Change Value of Key in Database:

```js
db.get("old").set("newData");
// before: {"old": "oldData"}
// after: {"old": "newData"}
```

Set Key-Value Pair on Dictionary Property:

```js
db.set("key", "value").save();
// before: {}
// after: {"key": "value"}
```

Delete Value:

```js
db.delete("key");
// before: {'key': 'value', 'key2': 'value2'}
// after: {'key2': 'value2'}
```

Set Key-Value Pair on Dictionary with Shorthand Syntax:

```js
db.set("key.key2", "value").save();
// before: {}
// after: {"key": {"key2": "value"}}
```

Set Default Data for Empty Database:

```js
db.default({ name: "tom" });

// actual db: {}
console.log(db.get("name")); // prints "tom"
```

Push Item to Array Property:

```js
db.get("list")
  .push(1)
  .save();

// before: {'list': []}
// after: {'list': [1]}
```

Filter Out All Elements under 5:

```js
// before = {'list': [1,2,6,1]}
// output = {'list': [6]}

db.get("list").filter(i => i >= 5);

// save db
db.save();
```

Change Element with Highest Value:

```js
// before = {'users': [{value: 10}, {value: 5}, {value: 6}]}
// after = {'users': [{value: "changed"}, {value: 6}, {value: 5}]}

db.get("users").sort((a, b) => b.value - a.value);

// change value of highest element
db.get("users")
  .get(0)
  .get("value")
  .set("changed");

// save db
db.save();
```

Map List, Squaring Each Number in List:

```js
// before = {'data': [1,2,3,4,5]}
// after = {'data': [1,4,9,16,25]}

// square each number in the list
db.get("data").map(x => x ** 2);

// save db
db.save();
```

Reduce List, Finding Value of All Values in List Summed:

```js
// before = {'data': [1,2,3,4,5]}
// after = {'data': 15}

// find value of all numbers in list summed together
db.get("data").reduce(
  (accumulator, currentValue) => accumulator + currentValue
);

// save db
db.save();
```

Leverage Serialize and Deserialize functions to encrypt and decrypt data:

```js
const engine = new StormDB.localFileEngine("./db.stormdb", {
  serialize: data => {
    // encrypt and serialize data
    return encrypt(JSON.stringify(data));
  },
  deserialize: data => {
    // decrypt and deserialize data
    return JSON.parse(decrypt(data));
  }
});
const db = new StormDB(engine);
```

## Credit

Author: [Tom](https://github.com/TomPrograms)

## License

[MIT](LICENSE)
