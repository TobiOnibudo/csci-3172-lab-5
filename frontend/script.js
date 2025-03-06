document.getElementById('recipeForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const diet = document.getElementById('diet').value;
    const ingredients = document.getElementById('ingredients').value.split(',');

    document.getElementById('recipeResults').innerHTML = '';

    try {
        
        const response = await fetch(`/api/recipes?diet=${diet}&ingredients=${ingredients.join(',')}`);
        const data = await response.json();

        // Check if recipes are found and fetch their ingredients
        if (data.recipes && data.recipes.length > 0) {
            for (const recipe of data.recipes) {
                const recipeId = recipe.id;

                // Fetch detailed information (including ingredients) for each recipe
                const recipeDetailsResponse = await fetch(`/api/recipes/${recipeId}`);
                const recipeDetails = await recipeDetailsResponse.json();

                // Create and append the recipe element with ingredients
                const recipeElement = document.createElement('div');
                recipeElement.classList.add('mb-4', 'p-4', 'bg-gray-50', 'rounded-md', 'shadow-sm');
                recipeElement.innerHTML = `
                    <h2 class="text-xl font-bold">${recipeDetails.title}</h2>
                    <p class="text-gray-600">Ingredients: ${recipeDetails.ingredients.join(', ')}</p>
                    <a href="#" class="text-blue-500 recipe-image-link" data-image="${recipe.image}">View Image</a>
                `;

                document.getElementById('recipeResults').appendChild(recipeElement);
            }
        } else {
            document.getElementById('recipeResults').innerHTML = '<p>No recipes found. Try different ingredients or preferences.</p>';
        }
    } catch (error) {
        console.error('Error fetching recipes:', error);
        document.getElementById('recipeResults').innerHTML = '<p>There was an error fetching the recipes. Please try again later.</p>';
    }
});

// Create modal structure
const modal = document.createElement('div');
modal.id = 'imageModal';
modal.classList.add('hidden', 'fixed', 'inset-0', 'bg-gray-900', 'bg-opacity-75', 'flex', 'items-center', 'justify-center', 'z-50');
modal.innerHTML = `
    <div class="bg-white p-4 rounded-lg relative max-w-lg">
        <span id="closeModal" class="absolute top-2 right-2 cursor-pointer text-xl">&times;</span>
        <img id="modalImage" src="" class="w-full rounded-lg" alt="Recipe Image">
    </div>
`;
document.body.appendChild(modal);

// Handle opening the modal
document.addEventListener('click', (event) => {
    if (event.target.classList.contains('recipe-image-link')) {
        event.preventDefault();
        const imageUrl = event.target.getAttribute('data-image');
        document.getElementById('modalImage').src = imageUrl;
        modal.classList.remove('hidden');
    }
});

// Handle closing the modal
document.getElementById('closeModal').addEventListener('click', () => {
    modal.classList.add('hidden');
});

// Close modal when clicking outside of the image
modal.addEventListener('click', (event) => {
    if (event.target === modal) {
        modal.classList.add('hidden');
    }
});
