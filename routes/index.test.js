var app = require("../app")
var request = require("supertest")

// test route pour sign up 
test("name", async (done) => {
    await request(app).post("/users/signin")
        .send({
            "firstname": "a",
            "surname": "a",
            "email": "a@a.a",
            "password": "a"
        })
        .expect(200)
        // .expect(result)
    done()
})

test('Homepage OK', async (done) => {
    await request(app).get('/')
        .send()
        .expect(200)

    done();
})

test('fridge', async (done) => {
    await request(app).get('/ingredients/allIngredients')
        .send()
        .expect(200)
    done();
})