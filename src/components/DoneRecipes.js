import React, { useState, useEffect } from 'react';
import copy from 'clipboard-copy';
import { Link } from 'react-router-dom';
import shareIcon from '../images/shareIcon.svg';
import Header from './Header';
import '../CSS/DoneRecipes.css';

function DoneRecipes() {
  const data = JSON.parse(localStorage.getItem('doneRecipes'));
  const [btnCopy, setBtnCopy] = useState(Array(data?.length).fill(false));
  const [search, setSearch] = useState([]);

  const twoSeconds = 2000;

  function copiedLinkMsg(index) {
    let newBtnCopy = [...btnCopy];
    newBtnCopy[index] = true;
    setBtnCopy(newBtnCopy);

    newBtnCopy = Array(data.length).fill(false);
    setTimeout(() => {
      setBtnCopy(newBtnCopy);
    }, twoSeconds);
  }

  const handleFilterMeal = () => {
    const mealFilter = data.filter((el) => (el.type === 'meal'));
    setSearch(mealFilter);
  };

  const handleFilterDrink = () => {
    const drinkFilter = data.filter((el) => (el.type === 'drink'));
    setSearch(drinkFilter);
  };

  const handleFilterAll = () => {
    setSearch(data);
  };

  useEffect(() => {
    setSearch(data);
  }, []);

  const handleCopy = (type, id, index) => {
    copiedLinkMsg(index);
    if (type === 'meal') {
      copy(`http://localhost:3000/meals/${id}`);
    } else {
      copy(`http://localhost:3000/drinks/${id}`);
    }
  };

  if (data === null || data.length === 0) {
    return (
      <>
        <Header />
        <h4 style={ { textAlign: 'center' } }>You do not have any done recipes yet!</h4>
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
            data-testid="filter-by-all-btn"
            onClick={ handleFilterAll }
          >
            All
          </button>
          <button
            style={ { marginRight: '10px' } }
            className="btn btn-outline-dark"
            type="button"
            data-testid="filter-by-meal-btn"
            onClick={ handleFilterMeal }
          >
            Meals
          </button>
          <button
            className="btn btn-outline-dark"
            type="button"
            data-testid="filter-by-drink-btn"
            onClick={ handleFilterDrink }
          >
            Drinks
          </button>
        </div>

        <div className="favCard">
          {search !== null && search.map((el, index) => (
            <div className="favItem" key={ index }>
              <Link
                className="link"
                to={ `/${`${el.type}s`}/${el.id}` }
              >
                <img
                  className="img fav-img"
                  src={ el.image }
                  key={ index }
                  alt={ el.name }
                  data-testid={ `${index}-horizontal-image` }
                />
                <p
                  className="name"
                  data-testid={ `${index}-horizontal-name` }
                >
                  {el.name}
                </p>
                <p
                  data-testid={ `${index}-horizontal-top-text` }
                >
                  Category:
                  {' '}
                  {el.type === 'meal'
                    ? `${el.category} (${el.nationality})` : el.alcoholicOrNot}
                </p>
              </Link>
              <p
                data-testid={ `${index}-horizontal-done-date` }
              >
                {el.doneDate}
              </p>
              <div className="share-div">
                <button
                  type="button"
                  className="btnShare"
                  data-testid={ `${index}-horizontal-share-btn` }
                  src={ shareIcon }
                  onClick={ () => handleCopy(el.type, el.id, index) }
                >
                  <img src={ shareIcon } alt="Compartilhar" />
                </button>
                { btnCopy[index] && <p className="done-copied">Link copied!</p> }
              </div>
              {/* {el.type === 'meal' && el.tags.map((value) => (
                <p
                  data-testid={ `${index}-${value}-horizontal-tag` }
                  key={ index }
                >
                  {value}
                </p>))} */}
            </div>
          ))}
        </div>
      </div>
    </>

  );
}

export default DoneRecipes;
