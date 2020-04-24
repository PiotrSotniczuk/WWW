import {fib} from './modulfib';
import {expect} from "chai";
import "mocha";
describe("Fibonacci", () => {
    it("should equal for call with", () => {
        expect(fib(0)).to.equal(0);
        expect(fib(1)).to.equal(1);
        expect(fib(2)).to.equal(1);
        expect(fib(3)).to.equal(2);
    })
})
