import request from "supertest"
import { app } from "../app"

describe("Screenshot Capturing Service", () => 
{
    it("Capture screenshot", async () => 
    {
        const url = "https://nodejs.org"
        const result = await request(app).get(`/capture?url=${url}`).send()
        const res = JSON.parse(result.text)

        expect(result.status).toBe(200)
        expect(url).toBe(res.url)
    })
})