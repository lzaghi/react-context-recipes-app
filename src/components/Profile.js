import React from 'react';
import { useHistory } from 'react-router-dom';
import Header from './Header';
import profileCircle from '../images/profileCircle.svg';
import '../CSS/Profile.css';

function Profile() {
  const history = useHistory();
  const profileEmail = localStorage.getItem('user');
  const profileEmailParse = JSON.parse(profileEmail);
  const logoutFunc = () => {
    localStorage.clear();
    history.push('/');
  };
  return (

    <>
      <Header />
      <div className="profile-wrapper">
        <div className="profile-box">
          <img className="profile-icon" src={ profileCircle } alt="profile icon" />
          <h3 data-testid="profile-email">{ profileEmailParse?.email }</h3>
        </div>
        <div className="buttons-container">
          <button
            style={ { marginRight: '10px' } }
            className="btn btn-outline-dark"
            data-testid="profile-done-btn"
            type="button"
            onClick={ () => history.push('/done-recipes') }
          >
            Done Recipes
          </button>
          <button
            style={ { marginRight: '10px' } }
            className="btn btn-outline-dark"
            data-testid="profile-favorite-btn"
            type="button"
            onClick={ () => history.push('/favorite-recipes') }
          >
            Favorite Recipes
          </button>
          <button
            className="logout"
            data-testid="profile-logout-btn"
            type="button"
            onClick={ logoutFunc }
          >
            Logout
          </button>
        </div>
      </div>
    </>
  );
}

export default Profile;
