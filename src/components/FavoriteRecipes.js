import React, { useState } from 'react';
import { Link } from 'react-router-dom/cjs/react-router-dom.min';
import copy from 'clipboard-copy';
import Header from './Header';
import blackHeart from '../images/blackHeartIcon.png';
import shareIcon from '../images/shareIcon.svg';
import '../CSS/FavoriteRecipes.css';

function FavoriteRecipes() {
  const favoriteRecipes = JSON.parse(localStorage.getItem('favoriteRecipes'));
  const [filteredRecipes, setFilteredRecipes] = useState(favoriteRecipes);
  const [btnCopy, setBtnCopy] = useState(Array(favoriteRecipes.length).fill(false));

  const twoSeconds = 2000;

  function copiedLinkMsg(index) {
    let newBtnCopy = [...btnCopy];
    newBtnCopy[index] = true;
    setBtnCopy(newBtnCopy);

    newBtnCopy = Array(favoriteRecipes.length).fill(false);
    setTimeout(() => {
      setBtnCopy(newBtnCopy);
    }, twoSeconds);
  }

  const mealsFilter = () => {
    const aux = favoriteRecipes.filter((el) => el.type === 'meal');
    setFilteredRecipes(aux);
  };

  const drinksFilter = () => {
    const aux = favoriteRecipes.filter((el) => el.type === 'drink');
    setFilteredRecipes(aux);
  };

  const allFilter = () => {
    setFilteredRecipes(favoriteRecipes);
  };

  const removeLocal = ({ target }) => {
    const recipeId = target.parentNode.parentNode.id;
    const removedRecipe = favoriteRecipes.filter((el) => el.id !== recipeId);
    const removedRecipeFix = filteredRecipes.filter((el) => el.id !== recipeId);
    setFilteredRecipes(removedRecipeFix);
    localStorage.setItem('favoriteRecipes', JSON.stringify(removedRecipe));
  };

  const handleCopy = (type, id, index) => {
    copiedLinkMsg(index);
    if (type === 'meal') {
      copy(`http://localhost:3000/meals/${id}`);
    } else {
      copy(`http://localhost:3000/drinks/${id}`);
    }
  };

  if (favoriteRecipes === null || favoriteRecipes.length === 0) {
    return (
      <>
        <Header />
        <h4
          style={ { textAlign: 'center' } }
        >
          You do not have any favorite recipes yet!
        </h4>
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="wrapper">
        <div className="d-flex justify-content-center">
          <button
            style={ { marginRight: '10px' } }
            className="btn btn-outline-dark"
            type="button"
            onClick={ allFilter }
            data-testid="filter-by-all-btn"
          >
            All
          </button>
          <button
            className="btn btn-outline-dark"
            style={ { marginRight: '10px' } }
            type="button"
            onClick={ mealsFilter }
            data-testid="filter-by-meal-btn"
          >
            Meals
          </button>
          <button
            className="btn btn-outline-dark"
            type="button"
            onClick={ drinksFilter }
            data-testid="filter-by-drink-btn"
          >
            Drinks
          </button>
        </div>
        <div className="favCard">
          {
            filteredRecipes?.map((el, index) => (
              <div className="favItem" id={ el.id } key={ el.name }>
                <Link
                  className="link"
                  to={ el.type === 'meal' ? `meals/${el.id}` : `drinks/${el.id}` }
                >
                  <img
                    src={ el.image }
                    alt={ el.name }
                    className="img fav-img"
                    data-testid={ `${index}-horizontal-image` }
                  />
                  <p
                    className="name"
                    data-testid={ `${index}-horizontal-name` }
                  >
                    {el.name}
                  </p>
                  <p data-testid={ `${index}-horizontal-top-text` }>
                    Category:
                    {' '}
                    { el.type === 'meal'
                      ? `${el.category} (${el.nationality})` : el.alcoholicOrNot }
                  </p>
                </Link>
                <div className="fav-icons">
                  <button
                    type="button"
                    data-testid={ `${index}-horizontal-favorite-btn` }
                    src={ blackHeart }
                    onClick={ removeLocal }
                  >
                    <img src={ blackHeart } alt="coração" />
                  </button>
                  <div className="share-div">
                    <button
                      type="button"
                      data-testid={ `${index}-horizontal-share-btn` }
                      onClick={ () => handleCopy(el.type, el.id, index) }
                      src={ shareIcon }
                    >
                      <img src={ shareIcon } alt="compartilhar" />
                    </button>
                    { btnCopy[index] && <p className="copied">Link copied!</p>}

                  </div>
                </div>
              </div>
            ))
          }
        </div>
      </div>

    </>
  );
}

export default FavoriteRecipes;
