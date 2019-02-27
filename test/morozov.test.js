const { assert } = require("chai");
const common = require("./common");

describe("morozov", function() {
  it("about", async function() {
    const {data} = await common.axios.get("/about");
    assert.isTrue(data.ok);
  })
});
