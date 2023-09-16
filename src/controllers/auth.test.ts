import { MainServer } from "..";
import request from 'supertest'
import { ClientCredentioal } from "../interfaces/auth.service";

describe("Login User Test", () => {
    test('Test Login Clinet Succsess', async () => {
        const res = await request(MainServer.app)
        .post('/auth/login')
        .send({email: "one@one.com", password: "one"} as ClientCredentioal)
        expect(res.status).toBe(200)
     }, 10000)
    test('Test Client Dosnot Exist', async () => {
        const res = await request(MainServer.app)
        .post('/auth/login')
        .send({email: "one@one.com", password: "on"} as ClientCredentioal)
        expect(res.status).toBe(400)
    }, 10000)
})