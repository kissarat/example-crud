const { assert } = require("chai");
const _ = require("lodash");
const common = require("./common");

describe("main", function () {
  it("server", function () {
    assert.isTrue(_.isObject(common.server));
    assert.isTrue(common.server.listening);
  })
})

before(common.setup);

after(function (done) {
  if (common.server) {
    common.server.close(function() {
      // console.log("Server is closed");
      done();
    });
  }
  else {
    done(new Error("Server not found"));
  }
})
