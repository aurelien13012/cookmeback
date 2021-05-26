var app = require("../app")
var request = require("supertest")

//test route pour sign up 
test("name", async (done) => {
    await request(app).post("/signin")
        .send({ "firstname": "John" })
        .expect(200)
        .expect({ prenom: "John" })
    done()
})

//test route myrecipe mettre en place une entrée une sortie 
test("name", async (done) => {
    await request(app).post("/infoUser")
        .send({ token })
        .expect(200)
        .expect({ recipe })
    done()
})