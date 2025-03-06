import express from "express";
import serverless from "serverless-http";
import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();

const api = express();
const router = express.Router();

const SPOONACULAR_API_KEY = process.env.SPOONACULAR_API_KEY;

router.get("/recipes", async (req, res) => {
    const { diet, ingredients } = req.query;

    if (!diet || !ingredients) {
        return res.status(400).json({ error: "Dietary preference and ingredients are required." });
    }

    const ingredientsList = ingredients.split(",");

    try {
        const response = await fetch(
            `https://api.spoonacular.com/recipes/complexSearch?apiKey=${SPOONACULAR_API_KEY}&diet=${diet}&includeIngredients=${ingredientsList.join(",")}`
        );

        const data = await response.json();
        
        if (!data.results) return res.status(404).json({ error: "No recipes found." });

        const recipes = data.results.map(recipe => ({
            title: recipe.title,
            id: recipe.id,
            image: recipe.image,
        }));

        res.json({ recipes });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to fetch recipe data." });
    }
});

router.get("/recipes/:id", async (req, res) => {
    const recipeId = req.params.id;

    try {
        const response = await fetch(
            `https://api.spoonacular.com/recipes/${recipeId}/information?apiKey=${SPOONACULAR_API_KEY}&includeNutrition=false`
        );

        const recipe = await response.json();

        if (!recipe || !recipe.extendedIngredients) {
            return res.status(404).json({ error: "No ingredients found for this recipe." });
        }

        const ingredientsList = recipe.extendedIngredients.map(ingredient => ingredient.original);

        res.json({
            title: recipe.title,
            ingredients: ingredientsList,
        });
    } catch (error) {
        console.error("Error fetching recipe:", error);
        res.status(500).json({ error: "There was an error fetching the recipe. Please try again later." });
    }
});

api.use("/api/", router);

export const handler = serverless(api);
