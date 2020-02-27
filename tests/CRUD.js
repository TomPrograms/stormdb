const assert = require("assert");
const path = require("path");
const fs = require("fs");
const StormDB = require("../index.js");

const exampleDBPath = path.resolve(__dirname, "./fixtures/example.stormdb");
const emptyDBPath = path.resolve(__dirname, "./fixtures/empty-db.stormdb");

const deleteFile = function(fileName) {
  fs.unlinkSync(fileName);
};

describe("StormDB", function() {
  it("should successfully load local database", function() {
    const engine = new StormDB.localFileEngine(exampleDBPath);
    new StormDB(engine);
  });

  describe(".get()", function() {
    it("should successfully get values from database", function() {
      const engine = new StormDB.localFileEngine(exampleDBPath);
      const db = new StormDB(engine);

      let value = db.get("test-string").value();
      assert.equal(value, "string");
    });
  });

  describe(".set()", function() {
    it("should successfully change value in database", function() {
      const engine = new StormDB.localFileEngine(exampleDBPath);
      const db = new StormDB(engine);

      db.get("test-string").set("changed");

      let value = db.get("test-string").value();
      assert.equal(value, "changed");
    });

    it("should successfully set value in database", function() {
      const engine = new StormDB.localFileEngine(exampleDBPath);
      const db = new StormDB(engine);

      db.get("newValue").set("data");

      let value = db.get("newValue").value();
      assert.equal(value, "data");
    });

    it("should successfully set nested values", function() {
      const engine = new StormDB.localFileEngine(exampleDBPath);
      const db = new StormDB(engine);

      db.set("one.two", "test");

      let value = db
        .get("one")
        .get("two")
        .value();
      assert.equal(value, "test");
    });

    it("should successfully set on nested object", function() {
      const engine = new StormDB.localFileEngine(exampleDBPath);
      const db = new StormDB(engine);

      db.get("test-obj").set("data", "test");

      let value = db
        .get("test-obj")
        .get("data")
        .value();
      assert.equal(value, "test");
    });

    describe("setting key-value pair", function() {
      it("should successfully set key-value pair", function() {
        const engine = new StormDB.localFileEngine(exampleDBPath);
        const db = new StormDB(engine);

        db.set("newAttribute", "testing");

        let value = db.get("newAttribute").value();
        assert.equal(value, "testing");
      });

      it("should successfully set key-value pair with shorthand syntax", function() {
        const engine = new StormDB.localFileEngine(exampleDBPath);
        const db = new StormDB(engine);

        db.set("one.two", "testing");

        let value = db
          .get("one")
          .get("two")
          .value();
        assert.equal(value, "testing");
      });

      it("should be able to use non-strings as key", function() {
        const engine = new StormDB.localFileEngine(exampleDBPath);
        const db = new StormDB(engine);

        db.set(1, "testing");

        let value = db.get(1).value();
        assert.equal(value, "testing");
      });
    });
  });

  describe(".delete()", function() {
    it("should successfully remove value from database", function() {
      const engine = new StormDB.localFileEngine(exampleDBPath);
      const db = new StormDB(engine);

      db.get("test-string").delete();

      let value = db.get("test-string").value();
      assert.equal(value, undefined);
    });

    it("should successfully remove nested values", function() {
      const engine = new StormDB.localFileEngine(exampleDBPath);
      const db = new StormDB(engine);

      db.get("test-obj")
        .get("nested-key")
        .delete();

      let value = db
        .get("test-obj")
        .get("nested-key")
        .value();
      assert.equal(value, undefined);
    });
  });

  describe(".save()", function() {
    it("should successfully save data back to database", function() {
      // ensure an existing database isn't used for the test
      if (fs.existsSync("tempDB.stormdb")) deleteFile("tempDB.stormdb");

      const engine = new StormDB.localFileEngine("tempDB.stormdb");
      const db = new StormDB(engine);

      db.set("newValue", "value");
      db.save();

      // reload database
      const engine2 = new StormDB.localFileEngine("tempDB.stormdb");
      const db2 = new StormDB(engine2);

      let value = db2.get("newValue").value();
      assert.equal(value, "value");

      deleteFile("tempDB.stormdb");
    });
  });

  describe(".push()", function() {
    it("should push data to an array", function() {
      const engine = new StormDB.localFileEngine(exampleDBPath);
      const db = new StormDB(engine);

      db.get("test-list").push("newData");

      let newDataIncluded = db
        .get("test-list")
        .value()
        .includes("newData");
      assert(newDataIncluded);
    });

    it("should refuse to push data to a non-array", function() {
      const engine = new StormDB.localFileEngine(exampleDBPath);
      const db = new StormDB(engine);

      const tryPush = () => {
        db.get("test-string").push("newData");
      };

      // should refuse to push to string and therefore should raise an exception
      assert.throws(tryPush, Error);
    });
  });

  describe(".map()", function() {
    it("should map array", function() {
      const engine = new StormDB.localFileEngine(exampleDBPath);
      const db = new StormDB(engine);

      db.get("test-list").map(x => x ** 2);

      let updatedList = db.get("test-list").value();
      assert.deepEqual(updatedList, [1, 4, 9, 16, 25]);
    });

    it("should refuse to map a non-array", function() {
      const engine = new StormDB.localFileEngine(exampleDBPath);
      const db = new StormDB(engine);

      const tryMap = () => {
        db.get("test-string").map(x => x ** 2);
      };

      // should refuse to map string and therefore should raise an exception
      assert.throws(tryMap, Error);
    });
  });

  describe(".sort()", function() {
    it("should sort array", function() {
      const engine = new StormDB.localFileEngine(exampleDBPath);
      const db = new StormDB(engine);

      db.get("test-list").sort((a, b) => b - a);

      let updatedList = db.get("test-list").value();
      assert.deepEqual(updatedList, [5, 4, 3, 2, 1]);
    });

    it("should refuse to sort a non-array", function() {
      const engine = new StormDB.localFileEngine(exampleDBPath);
      const db = new StormDB(engine);

      const trySort = () => {
        db.get("test-string").sort((a, b) => a - b);
      };

      // should refuse to sort string and therefore should raise an exception
      assert.throws(trySort, Error);
    });

    it("should refuse to sort not using function or undefined", function() {
      const engine = new StormDB.localFileEngine(exampleDBPath);
      const db = new StormDB(engine);

      const trySort = () => {
        db.get("test-list").sort("non-function");
      };

      // should refuse to sort with non-function, not undefined and therefore should raise an exception
      assert.throws(trySort, Error);
    });
  });

  describe(".reduce()", function() {
    it("should reduce array", function() {
      const engine = new StormDB.localFileEngine(exampleDBPath);
      const db = new StormDB(engine);

      db.get("test-list").reduce(
        (accumulator, currentValue) => accumulator + currentValue
      );

      let updatedList = db.get("test-list").value();
      assert.deepEqual(updatedList, 15);
    });

    it("should refuse to reduce a non-array", function() {
      const engine = new StormDB.localFileEngine(exampleDBPath);
      const db = new StormDB(engine);

      const tryReduce = () => {
        db.get("test-string").reduce(
          (accumulator, currentValue) => accumulator + currentValue
        );
      };

      // should refuse to reduce string and therefore should raise an exception
      assert.throws(tryReduce, Error);
    });

    it("should refuse to reduce not using function or undefined", function() {
      const engine = new StormDB.localFileEngine(exampleDBPath);
      const db = new StormDB(engine);

      const tryReduce = () => {
        db.get("test-list").reduce("non-function");
      };

      // should refuse to reduce with non-function and therefore should raise an exception
      assert.throws(tryReduce, Error);
    });
  });

  describe(".filter()", function() {
    it("should filter array", function() {
      const engine = new StormDB.localFileEngine(exampleDBPath);
      const db = new StormDB(engine);

      db.get("test-list").filter(i => i > 3);

      let updatedList = db.get("test-list").value();
      assert.deepEqual(updatedList, [4, 5]);
    });

    it("should refuse to filter using non-function", function() {
      const engine = new StormDB.localFileEngine(exampleDBPath);
      const db = new StormDB(engine);

      const tryFilter = () => {
        db.get("test-list").filter(null);
      };

      // should refuse to filter with non-function and therefore should raise an exception
      assert.throws(tryFilter, Error);
    });

    it("should refuse to filter non-array", function() {
      const engine = new StormDB.localFileEngine(exampleDBPath);
      const db = new StormDB(engine);

      const tryFilter = () => {
        db.get("test-string").filter(() => true);
      };

      // should refuse to filter string and therefore should raise an exception
      assert.throws(tryFilter, Error);
    });
  });

  describe(".default()", function() {
    it("default value should be used in place of empty db", function() {
      // load empty database
      const engine = new StormDB.localFileEngine(emptyDBPath);
      const db = new StormDB(engine);

      db.default({ defaulted: "defaultString" });

      let defaultedKey = db.get("defaulted").value();
      assert.equal(defaultedKey, "defaultString");
    });

    it("default value shouldn't be used with non-empty db", function() {
      // load non-empty database
      const engine = new StormDB.localFileEngine(exampleDBPath);
      const db = new StormDB(engine);

      db.default({ defaulted: "defaultString" });

      let defaultedKey = db.get("defaulted").value();
      // if default value not used, key should be undefined in db
      assert.equal(defaultedKey, undefined);
    });
  });

  describe(".length()", function() {
    it("should get lengths of db entries on .value()", function() {
      const engine = new StormDB.localFileEngine(exampleDBPath);
      const db = new StormDB(engine);

      let length = db
        .get("test-list")
        .length()
        .value();
      assert.equal(length, 5);
    });
  });
});
