import { JSDOM } from "jsdom";
import fs from "fs";
import path from "path";

const html = fs.readFileSync(path.resolve(__dirname, "../frontend/index.html"), "utf8");


describe("Recipe Recommender Frontend", () => {
    let dom, document;
    beforeEach(() => {
        dom = new JSDOM(html, { runScripts: "dangerously" });
        document = dom.window.document;
        global.document = document;
        global.window = dom.window;
        global.fetch = jest.fn();
    });
    
    it("should trigger form submission and make an API call", async () => {
        fetch.mockResolvedValueOnce({
            json: jest.fn().mockResolvedValue({ recipes: [{ id: 1, title: "Pasta", image: "pasta.jpg" }] })
        });

        const form = document.getElementById("recipeForm");
        document.getElementById("ingredients").value = "tomato,cheese";
        form.dispatchEvent(new dom.window.Event("submit"));

        expect(fetch).toHaveBeenCalledWith("http://localhost:3000/api/recipes?diet=none&ingredients=tomato,cheese");
    });

    it("should display 'No recipes found' message when no recipes are returned", async () => {
        fetch.mockResolvedValueOnce({
            json: jest.fn().mockResolvedValue({ recipes: [] })
        });

        const form = document.getElementById("recipeForm");
        document.getElementById("ingredients").value = "tomato,cheese";
        form.dispatchEvent(new dom.window.Event("submit"));

        await new Promise((resolve) => setTimeout(resolve, 100));

        expect(document.getElementById("recipeResults").innerHTML).toContain("No recipes found");
    });

    it("should display fetched recipes", async () => {
        fetch.mockResolvedValueOnce({
            json: jest.fn().mockResolvedValue({ recipes: [{ id: 1, title: "Pasta", image: "pasta.jpg" }] })
        });

        const form = document.getElementById("recipeForm");
        document.getElementById("ingredients").value = "tomato,cheese";
        form.dispatchEvent(new dom.window.Event("submit"));

        await new Promise((resolve) => setTimeout(resolve, 100));

        expect(document.getElementById("recipeResults").innerHTML).toContain("Pasta");
    });
});
