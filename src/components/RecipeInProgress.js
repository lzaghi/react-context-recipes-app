import React, { useContext, useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import RecipesContext from '../context/RecipesContext';
import { RequestDrinkId, RequestMealsId } from '../services/RequestRecipesDetails';
import FavBtn from './FavBtn';
import Header from './Header';
import ShareBtn from './ShareBtn';
import '../CSS/RecipeInProgress.css';

function RecipeInProgress() {
  const { setArray } = useContext(RecipesContext);
  const { id } = useParams();
  const history = useHistory();
  const slug = history.location.pathname;
  const [disabled, setDisabled] = useState(true);
  const [arrayRecipe, setArrayRecipe] = useState([]);
  const [ingredientsCheck, setIngredientsCheck] = useState(
    JSON.parse(localStorage.getItem('inProgressRecipes'))?.meals[id]
    || JSON.parse(localStorage.getItem('inProgressRecipes'))?.drinks[id] || [],
  );

  useEffect(() => {
    setArray(arrayRecipe);
  });
  useEffect(() => {
    if ((history.location.pathname === `/drinks/${id}/in-progress`)) {
      const requestDrink = async () => {
        const dataDrink = await RequestDrinkId(id);
        return setArrayRecipe(dataDrink);
      };
      requestDrink();
    } else {
      const requestMeals = async () => {
        const dataMeals = await RequestMealsId(id);
        return setArrayRecipe(dataMeals);
      };
      requestMeals();
    }
  }, [id, history]);

  const ingredients = arrayRecipe.map((el) => Object.entries(el)
    .filter((entry) => entry[0]
      .includes('strIngredient') && entry[1] !== '' && entry[1] !== null))
    .map((arr) => arr.map((el) => el[1]))
    .flat();

  const measures = arrayRecipe.map((el) => Object.entries(el)
    .filter((entry) => entry[0]
      .includes('strMeasure') && entry[1] !== ' ' && entry[1] !== null))
    .map((arr) => arr.map((el) => el[1]))
    .flat();

  const objInstructions = {};
  ingredients.forEach((element, index) => {
    objInstructions[element] = measures[index];
  });

  const arrayInstructions = Object.entries(objInstructions);

  function addToProgressLocal(value) {
    const obj = JSON.parse(localStorage.getItem('inProgressRecipes'));
    if (history.location.pathname.includes('meals')) {
      const newObj = {
        ...obj,
        meals: {
          ...obj.meals,
          [id]: value,
        },
      };
      if (!newObj.meals[id].length) delete newObj.meals[id];
      localStorage.setItem('inProgressRecipes', JSON.stringify(newObj));
    } else {
      const newObj = {
        ...obj,
        drinks: {
          ...obj.drinks,
          [id]: value,
        },
      };
      if (!newObj.drinks[id].length) delete newObj.drinks[id];
      localStorage.setItem('inProgressRecipes', JSON.stringify(newObj));
    }
  }

  function handleChange({ target }, index) {
    if (target.checked) {
      const addArray = [...ingredientsCheck, index];
      setIngredientsCheck(addArray);
      addToProgressLocal(addArray);
    } else {
      const subArray = ingredientsCheck.filter((e) => e !== index);
      setIngredientsCheck(subArray);
      addToProgressLocal(subArray);
    }
  }

  function handleArrayTags(key) {
    if (key?.includes(',')) {
      const array = key.split(',');
      return array;
    }
    return [key];
  }

  const handleclick = () => {
    if (localStorage.getItem('doneRecipes') === null) {
      localStorage.setItem('doneRecipes', JSON.stringify([]));
    }
    const recipe = {
      id,
      type: ((history.location.pathname === `/meals/${id}/in-progress`))
        ? 'meal' : 'drink',
      nationality: ((history.location.pathname === `/meals/${id}/in-progress`))
        ? arrayRecipe[0].strArea : '',
      category: arrayRecipe[0].strCategory,
      alcoholicOrNot: ((history.location.pathname === `/meals/${id}/in-progress`))
        ? '' : arrayRecipe[0].strAlcoholic,
      name: ((history.location.pathname === `/meals/${id}/in-progress`))
        ? arrayRecipe[0].strMeal : arrayRecipe[0].strDrink,
      image: ((history.location.pathname === `/meals/${id}/in-progress`))
        ? arrayRecipe[0].strMealThumb : arrayRecipe[0].strDrinkThumb,
      doneDate: new Date().toLocaleDateString(),
      tags: ((history.location.pathname === `/meals/${id}/in-progress`))
        ? handleArrayTags(arrayRecipe[0].strTags) : [],
    };

    const newDone = [
      ...JSON.parse(localStorage.getItem('doneRecipes')),
      recipe,
    ];
    localStorage.setItem('doneRecipes', JSON.stringify(newDone));
    history.push('/done-recipes');
  };

  useEffect(() => {
    if (ingredientsCheck.length === arrayInstructions.length) {
      setDisabled(false);
    } else {
      setDisabled(true);
    }
  }, [ingredientsCheck, arrayInstructions]);

  function startLocal() {
    if (localStorage.getItem('inProgressRecipes') === null) {
      return localStorage.setItem('inProgressRecipes', JSON.stringify({
        drinks: {},
        meals: {},
      }));
    }
  }

  if (!arrayRecipe.length > 0) {
    return (
      <>
        <Header />
        <div
          className="load-row"
          style={ { marginTop: '130px' } }
        >
          <span />
          <span />
          <span />
          <span />
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="details-wrapper">
        {startLocal()}
        {
          (arrayRecipe.length === 0)
            ? <p>carregando...</p> : arrayRecipe.map((el, index) => (
              <div key={ index }>
                <div className="img-title">
                  <img
                    className="img img-fluid details-img"
                    data-testid="recipe-photo"
                    src={ slug.includes('meals') ? el.strMealThumb : el.strDrinkThumb }
                    alt={ slug.includes('meals') ? el.strMeal : el.strDrink }
                  />
                  <h4 data-testid="recipe-title">
                    { slug.includes('meals') ? el.strMeal : el.strDrink }
                  </h4>
                  <p data-testid="recipe-category">
                    Category:
                    {' '}
                    { el.strCategory }
                  </p>
                </div>
                <p data-testid="instructions">
                  { el.strInstructions }
                </p>
              </div>
            ))
        }
        <div className="group">
          {
            arrayInstructions.map((ingredient, index) => (
              <div className="list-group" key={ index }>
                <label
                  data-testid={ `${index}-ingredient-step` }
                  htmlFor={ ingredient[0] }
                  className="styled-label form-check-label"
                >
                  <div className="list-group-item input">
                    <input
                      defaultChecked={ ingredientsCheck.includes(index) }
                      className="form-check-input"
                      type="checkbox"
                      name={ ingredient[0] }
                      id={ ingredient[0] }
                      onChange={ (event) => handleChange(event, index) }
                    />
                    <span>
                      {' '}
                      {ingredient.join(' - ')}
                    </span>
                  </div>
                </label>
                <br />
              </div>
            ))
          }
        </div>
        <div className="footer">
          <button
            className="finishButton"
            data-testid="finish-recipe-btn"
            type="button"
            disabled={ disabled }
            onClick={ handleclick }
          >
            Finish Recipe
          </button>
          <div className="fav-share">
            <FavBtn />
            <ShareBtn />
          </div>
        </div>
      </div>
    </>
  );
}

export default RecipeInProgress;
