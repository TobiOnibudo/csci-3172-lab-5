import request from "supertest";
import { handler } from "../netlify/functions/api.js";

describe("Recipes API", () => {
    
    it("should return recipes for valid diet and ingredients", async () => {
        const res = await request(handler).get("/api/recipes?diet=vegetarian&ingredients=tomato,cheese");
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty("recipes");
        expect(Array.isArray(res.body.recipes)).toBe(true);
    });

    it("should return an error for missing diet or ingredients", async () => {
        const res = await request(handler).get("/api/recipes");
        expect(res.statusCode).toBe(400);
        expect(res.body.error).toBe("Dietary preference and ingredients are required.");
    });

    it("should return a specific recipe's details for a valid ID", async () => {
        const validRecipeId = 12345; // Use a valid ID for real tests
        const res = await request(handler).get(`/api/recipes/${validRecipeId}`);
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty("title");
        expect(res.body).toHaveProperty("ingredients");
    });

    it("should return an error for an invalid recipe ID", async () => {
        const invalidRecipeId = 999999;
        const res = await request(handler).get(`/api/recipes/${invalidRecipeId}`);
        expect(res.statusCode).toBe(404);
        expect(res.body.error).toBe("No ingredients found for this recipe.");
    });

});
