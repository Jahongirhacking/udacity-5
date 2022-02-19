// Import the js file to test
import { saved_place } from "../src/client/js/saved_place"

describe("Testing the saved functionality", () => {
   test("Testing the saved_place() function", () => {
           expect(saved_place).toBeDefined();
})});