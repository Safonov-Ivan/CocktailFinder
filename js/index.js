document.addEventListener('DOMContentLoaded', () =>{
    document.getElementById('search-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const query = document.getElementById('search-input').value;
        await fetchCocktails(query);
    });
    
    async function fetchCocktails(query) {
        const res = await fetch(`https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${query}`);
        if(res.ok){
            const data = await res.json();
            displayCocktails(data.drinks);
        }else(console.log('Ошибка HTTP запроса'))
    }
    
    function displayCocktails(cocktails) {
        const resultsDiv = document.getElementById('cocktail-results');
        resultsDiv.innerHTML = '';
    
        if (!cocktails) {
            resultsDiv.innerHTML = '<p>Коктейли не найдены.</p>';
            return;
        }
    
        cocktails.forEach(cocktail => {
            const cocktailDiv = document.createElement('div');
            cocktailDiv.classList.add('cocktail');
            cocktailDiv.innerHTML = `
                <img src="${cocktail.strDrinkThumb}" alt="${cocktail.strDrink}">
                <h3>${cocktail.strDrink}</h3>
            `;
    
            cocktailDiv.addEventListener('click', () => showModal(cocktail));
            resultsDiv.appendChild(cocktailDiv);
        });
    }
    
    function showModal(cocktail) {
        const modal = document.getElementById('modal');
        const modalBody = document.getElementById('modal-body');
    
        const ingredients = getIngredients(cocktail);
    
        modalBody.innerHTML = `
            <h2>${cocktail.strDrink}</h2>
            <img src="${cocktail.strDrinkThumb}" alt="${cocktail.strDrink}">
            <p><strong>Category:</strong> ${cocktail.strCategory}</p>
            <p><strong>Glass:</strong> ${cocktail.strGlass}</p>
            <p><strong>Alcoholic:</strong> ${cocktail.strAlcoholic}</p>
            <h3>Ingredients</h3>
            <ul>
                ${ingredients.map(ingredient => `<li>${ingredient}</li>`).join('')}
            </ul>
            <h3>Instructions</h3>
            <p>${cocktail.strInstructions}</p>
        `;
    
        modal.classList.remove('hidden');
    }
    
    function getIngredients(cocktail) {
        const ingredients = [];
        for (let i = 1; i <= 15; i++) {
            const ingredient = cocktail[`strIngredient${i}`];
            const measure = cocktail[`strMeasure${i}`];
            if (ingredient) {
                ingredients.push(`${measure ? measure : ''} ${ingredient}`);
            }
        }
        return ingredients;
    }
    
    document.querySelector('.close-btn').addEventListener('click', () => {
        document.getElementById('modal').classList.add('hidden');
    });
})