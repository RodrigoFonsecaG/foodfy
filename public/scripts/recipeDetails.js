function showRecipe(){
  const recipes = document.querySelectorAll('.receita')

  recipes.forEach((recipe,index) => {
    console.log(recipe,index)
    recipe.addEventListener('click', () =>{
      window.location = `/recipes/${index}`
    })
  })
}

showRecipe();

