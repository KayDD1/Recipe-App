const mealsContainer = document.getElementById('meals')
const favMealContainer = document.getElementById('favorite-meal-container')
const searchInput = document.getElementById('search-input')
const searchBtn = document.getElementById('search-btn')
const closeBtnPopup = document.getElementById('close-popup')
const closeElPopup = document.getElementById('meal-info-popup')
const mealInfoEl = document.getElementById('meal-info')

fetchFavMeals()
getRandomMeal()

async function getRandomMeal(){
    const resp = await fetch('https://www.themealdb.com/api/json/v1/1/random.php')
    const respData = await resp.json()
    const randomMeal = respData.meals[0]

    addMeal(randomMeal, true)
}

async function getMealById(id){
    const resp = await fetch('https://www.themealdb.com/api/json/v1/1/lookup.php?i='+id)
    const respData = await resp.json()

    const meal = respData.meals[0]

    return meal;
}

async function getMealBySearch(term){
    const resp = await fetch('https://www.themealdb.com/api/json/v1/1/search.php?s='+term)

    const respData = await resp.json()

    const meals = respData.meals

    return meals;
}

function addMeal(mealData, random = false){
    const meal = document.createElement('div')
    meal.classList.add('meals')

    meal.innerHTML = `${random ? `<span class="random-recipe">
    <h3>Random Recipe</h3>
</span>` : ''}
<div class="meal">
    <div class="meal-header">
        <img src="${mealData.strMealThumb}" alt="${mealData.strMeal}">
    </div>
    <div class="meal-body">
        <h4>${mealData.strMeal}</h4>
        <button class="fav-btn"><i class="fa fa-heart" aria-hidden="true"></i></button>
    </div>
</div>`

const btn = meal.querySelector('.meal-body .fav-btn')
btn.addEventListener('click', ()=>{
    if(btn.classList.contains('active')){
        removeMealLs(mealData.idMeal)
        btn.classList.remove('active')
    }else{
        addMealsToLs(mealData.idMeal)
        btn.classList.add('active')
    }
    fetchFavMeals()
})

mealsContainer.appendChild(meal)

meal.addEventListener('click', ()=>{
 showMealInfo(mealData)
})
}

function addMealsToLs(mealId){
 const mealIds = getMealsLs()

 localStorage.setItem('mealIds', JSON.stringify([...mealIds, mealId]))
}

function removeMealLs(mealId){
const mealIds = getMealsLs()

localStorage.setItem('mealIds', JSON.stringify(mealIds.filter(id => id !== mealId)))
}
function getMealsLs(){

const mealIds = JSON.parse(localStorage.getItem('mealIds'))

return mealIds === null ? [] : mealIds;
}

async function fetchFavMeals(){
// clear favorite container
    favMealContainer.innerHTML = ''
   const mealIds = getMealsLs()

   for(let i = 0; i < mealIds.length; i++){
       const mealId = mealIds[i]
       meal = await getMealById(mealId)

       addMealToFav(meal)
   }
}


function addMealToFav(mealData){
    const fav = document.createElement('li')

    fav.innerHTML = `<li><img src="${mealData.strMealThumb}" alt="${mealData.strMeal}">
    <span class="title">${mealData.strMeal}</span></li>
    <button class="clear"><i class="fas fa-times"></i></button>`

    const btn = fav.querySelector('.clear')
    console.log(btn);
    btn.addEventListener('click', ()=>{
        removeMealLs(mealData.idMeal)

        fetchFavMeals()
    })

    fav.addEventListener('click', ()=>{
        showMealInfo(mealData)
    })

favMealContainer.appendChild(fav)
}

function showMealInfo(mealData){
// clean container 
mealInfoEl.innerHTML = '';

// update meal info
 const mealEl = document.createElement('div')


//  get Ingredients and measures
 const ingredient = []

    
for(let i = 1; i <= 20; i++){
    if(mealData['strIngredient' +i]){
        ingredient.push(`${mealData['strIngredient' + i]} - ${mealData['strMeasure' + i]}`)
    }else {
        break
    }
}


 mealEl.innerHTML = `
       <h2>${mealData.strMeal}</h2>
       <img src="${mealData.strMealThumb}" alt="${mealData.strMeal}">
       <p>${mealData.strInstructions}.</p>

       <h3>Ingredients:</h3>
     <ul>
      ${ingredient.map((ing) => `<li>${ing}</li>`).join('')}
    </ul>
   `

   mealInfoEl.appendChild(mealEl)

 closeElPopup.classList.remove('hidden')

}

searchBtn.addEventListener('click', async ()=>{
    // clean container before adding new search term
    mealsContainer.innerHTML = "";
    const search = searchInput.value

    const meals = await getMealBySearch(search)

    if(meals){
        meals.forEach(meal => {
            addMeal(meal)
        });
    }
})

closeBtnPopup.addEventListener('click', ()=>{
    closeElPopup.classList.add('hidden')
})




