const request = require('supertest');
import "regenerator-runtime/runtime";

describe("Post endpoints", () => {
    it("should create a new post", async () => {
        
        const data={
            lat: 52.52437,
            lng: 13.41053,
            geonameId: 2950159,
            name: "Berlin",
            countryName: "Germany" 
        }
        const res = await request.agent('http://localhost:3001')
        .post('/newPlacePost')
        .send(data)
        expect(res.statusCode).toEqual(201)
    })
})
