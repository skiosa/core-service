import { paginate } from "../../../src/util/paginate";
import { assert } from "chai";

describe("Paginate-Test", () => {
  it("should return first element", () => {
    assert.deepEqual(paginate([1, 3, 4], { take: 1 }), [1]);
  });
  it("should return first two elements", () => {
    assert.deepEqual(paginate([1, 3, 4], { take: 2 }), [1, 3]);
  });
  it("should skip the first element", () => {
    assert.deepEqual(paginate([1, 3, 4], { skip: 1, take: 2 }), [3, 4]);
  });
  it("should take all elements", () => {
    assert.deepEqual(paginate([1, 3, 4]), [1, 3, 4]);
  });
  it("should take second and third element", () => {
    assert.deepEqual(paginate([1, 3, 4, 6], { skip: 1, take: 2 }), [3, 4]);
  });
});
