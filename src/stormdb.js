class StormDB {
  constructor(engine) {
    this.engine = engine;

    this.state = this.engine.init();
    this.pointers = [];
  }

  default(defaultValue) {
    let stateEmpty = Object.keys(this.state).length === 0 && this.state.constructor === Object;

    if (stateEmpty)
    this.state = defaultValue;

    return this;
  }

  length() {
    this.pointers.push("length");
    return this;
  }

  delete() {
    let enclosing = this.state;
    for (let i = 0; i < this.pointers.length - 1; i++) {
      enclosing = enclosing[this.pointers[i]];
    }

    let final = this.pointers[this.pointers.length - 1];
    delete enclosing[final];
  }

  push(value) {
    let list = this.value();

    if (!Array.isArray(list))
      throw new Error("You can only push to lists.");

    list.push(value);
    this.set(list);

    return this;
  }

  map(func) {
    let list = this.value();

    if (typeof func !== "function")
      throw new Error("You can only pass functions to .map().");
    if (!Array.isArray(list))
      throw new Error("You can only map lists.");

    list = list.map(func);
    this.set(list);

    return this;
  }

  filter(func) {
    let list = this.value();

    if (typeof func !== "function")
      throw new Error("You can only pass functions to .filter().");
    if (!Array.isArray(list))
      throw new Error("You can only filter lists.");

    list = list.filter(func);
    this.set(list);

    return this;
  }

  sort(func) {
    let list = this.value();

    if (typeof func !== "function" && func !== undefined)
      throw new Error("You can only pass functions or nothing to .sort().");
    if (!Array.isArray(list))
      throw new Error("You can only sort lists.");

    list.sort(func);
    this.set(list);

    return this;
  }

  reduce(func) {
    let list = this.value();

    if (typeof func !== "function")
      throw new Error("You can only pass functions to .reduce().");
    if (!Array.isArray(list))
      throw new Error("You can only reduce lists.");

    let reducedValue = list.reduce(func);
    this.set(reducedValue);

    return this;
  }

  get(value) {
    if (Object.hasOwnProperty(value)) {
      let clone = Object.assign(Object.create(Object.getPrototypeOf(this)), this);
      clone.pointers = [...clone.pointers, value];
      return clone;
    } else
    throw new Error("Key does not exist.");
  }

  set(key, value) {
    if (value === undefined) {
      this.setValue(key);
    } else {
      let extraPointers;
      if (typeof key === "string")
        extraPointers = key.split(".");
      else
        extraPointers = [key];

      this.setValue(value, extraPointers);
    }
    return this;
  }

  value() {
    let data = this.state;
    for (let i = 0; i < this.pointers.length; i++) {
      data = data[this.pointers[i]];
    }

    return data;
  }

  setValue(value, pointers = [], setrecursively = true) {
    let depth = 0;

    pointers = [...this.pointers, ...pointers];

    const func = (a, b) => {
      depth += 1;

      let finalLevel = depth === pointers.length;
      if (setrecursively && typeof a[b] === "undefined" && !finalLevel) {
        a[b] = {};
        return a[b];
      }

      if (finalLevel) {
        a[b] = value;
        return value;
      } else {
        return a[b];
      }
    };
    pointers.reduce(func, this.state);
  }

  save() {
    return this.engine.write(this.state);
  }
}

module.exports = StormDB;
