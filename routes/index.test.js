var app = require("../app")
var request = require("supertest")

test("name", async (done) => {
    await request(app).post("/signup")
    .send({ "firstname": "John", "lastName":"doe", "email" : 'john.doe@gmail.com',
    "password" : 'azert' })
    .expect(200)
    .expect({ firstname : "John", lastName:"doe", email : 'john.doe@gmail.com',
    password : 'azert' })
    
    done()
    })


    //test route myrecipe mettre en place une entrée une sortie 
    test("name", async (done) => {
        await request(app).post("/myrecipe")
        .send({ token})
        .expect(200)
        .expect({ recipe })
        
        done()
        })