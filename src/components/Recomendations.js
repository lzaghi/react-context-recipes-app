import React, { useContext, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import RecipesContext from '../context/RecipesContext';
import '../CSS/RecipeDetails.css';
import rightArrow from '../images/rightArrow.svg';
import leftArrow from '../images/leftArrow.svg';

function Recomendations() {
  const history = useHistory();
  const { id } = useParams();
  const { recomendations } = useContext(RecipesContext);
  const [currentIndex, setCurrentIndex] = useState(0);

  // const slug = history.location.pathname;

  function sixRecomendations() {
    const SIX = 6;
    const newArray = recomendations.slice(0, SIX);
    return newArray;
  }

  const LENGTH = sixRecomendations().length;

  const carouselInfinite = (direction) => {
    if (direction === 'next') {
      if (currentIndex === LENGTH - 2) {
        return setCurrentIndex(0);
      }
      return setCurrentIndex(currentIndex + 1);
    }
    if (currentIndex === 0) {
      return setCurrentIndex(LENGTH - 2);
    }
    return setCurrentIndex(currentIndex - 1);
  };

  // const changeVisibility = (index) => {
  //   let result;
  //   if (currentIndex === index || currentIndex + 1 === index) {
  //     result = 'visible';
  //   } else {
  //     result = 'hidden';
  //   }
  //   return result;
  // };

  // function handleRedirect(recipe) {
  //   console.log('entrou?');
  //   if (slug.includes('meals')) history.push(`/drinks/${recipe.idDrink}`);
  //   if (slug.includes('drinks')) history.push(`/meals/${recipe.idMeal}`);
  // }

  return (
    <div>
      {
        !recomendations.length > 0
          ? (
            <div className="load-row">
              <span />
              <span />
              <span />
              <span />
            </div>)
          : (
            <>
              <h3
                className="instructions-title"
                style={ { marginTop: '15px' } }
              >
                {
                  history.location.pathname.includes('meals')
                    ? 'Recommended side drinks'
                    : 'Recommended side meals'
                }
              </h3>
              <div className="slider-container">
                <button
                  className="slider-button previous"
                  type="button"
                  onClick={ () => carouselInfinite('previous') }
                >
                  <img src={ leftArrow } alt="previous-carousel-item" />
                </button>
                <button
                  className="slider-button next"
                  type="button"
                  onClick={ () => carouselInfinite('next') }
                >
                  <img src={ rightArrow } alt="next-carousel-item" />
                </button>
                {
                  sixRecomendations().map((recipe, index) => (
                    <div
                      className="slider-item"
                      key={ index }
                      data-testid={ `${index}-recommendation-card` }
                      style={ { transform: `translate(-${currentIndex * 100}%)` } }
                    >
                      <div
                        className="slider-card"
                      >
                        <p data-testid={ `${index}-recommendation-title` }>
                          {(history.location.pathname === `/meals/${id}`)
                            ? recipe.strDrink : recipe.strMeal}
                        </p>
                        <img
                          src={ (history.location.pathname === `/meals/${id}`)
                            ? recipe.strDrinkThumb : recipe.strMealThumb }
                          alt={ (history.location.pathname === `/meals/${id}`)
                            ? recipe.strDrink : recipe.strMeal }
                        />
                      </div>
                    </div>
                  ))
                }
              </div>
            </>
          )
      }
    </div>
  );
}

export default Recomendations;
