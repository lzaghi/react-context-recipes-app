/* eslint-disable react/jsx-max-depth */
import React, { useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import profilePicture from '../images/profileIcon.svg';
import iconePicture from '../images/searchIcon.svg';
import SearchBar from './SearchBar';
import '../CSS/Header.css';
import RecipesIcon from '../images/RecipesIcon.png';
import GoBack from '../images/GoBack.png';

function Header() {
  const history = useHistory();
  const { id } = useParams();

  const [inputSearch, setInputSearch] = useState(false);

  const slug = history.location.pathname;

  const searchButton = () => {
    if (inputSearch === false) {
      setInputSearch(true);
    } else {
      setInputSearch(false);
    }
  };

  function handleTitle() {
    if (slug === '/meals') return <p className="title">Meals</p>;
    if (slug === '/drinks') return <p className="title">Drinks</p>;
    if (slug === '/profile') return <p className="title">Profile</p>;
    if (slug === '/done-recipes') return <p className="title">Done Recipes</p>;
    if (slug === '/favorite-recipes') return <p className="title">Favorite Recipes</p>;
  }

  return (
    <header>
      <div className="navbar navbar-expand-lg fixed-top">
        <div className="header container-fluid">
          <button
            className="icon"
            type="button"
            onClick={ () => history.goBack() }
          >

            <img
              data-testid="goback"
              className="goback"
              src={ GoBack }
              alt="Go Back"
            />

          </button>
          <button
            data-testid="icon-id"
            className="icon"
            onClick={ () => history.push('/meals') }
            type="button"
          >
            <img
              className="recipe-icon"
              src={ RecipesIcon }
              alt="Recipes Icon"
            />

          </button>

          <div>
            <button
              className="icon"
              type="button"
              onClick={ () => history.push('/profile') }
            >
              <img
                data-testid="profile-top-btn"
                src={ profilePicture }
                alt="Foto de Perfil"
              />
            </button>
            {
              (slug !== '/profile' && slug !== '/done-recipes'
              && slug !== '/favorite-recipes'
              && slug !== `/meals/${id}` && slug !== `/drinks/${id}`)
                && (
                  <button
                    className="icon search"
                    type="button"
                    onClick={ searchButton }
                  >
                    <img
                      data-testid="search-top-btn"
                      src={ iconePicture }
                      alt="Ícone de Pesquisa"
                    />
                  </button>)
            }
          </div>
        </div>

      </div>

      <h1 className="text-center" data-testid="page-title">{ handleTitle() }</h1>
      { inputSearch && <SearchBar />}
    </header>
  );
}

export default Header;
