import React, { useState, useEffect } from 'react';
import copy from 'clipboard-copy';
import { useHistory, useParams } from 'react-router-dom';

function ShareBtn() {
  const [btnCopy, setBtnCopy] = useState(false);
  const { id } = useParams();
  const history = useHistory();
  const url = history.location.pathname;
  const twoSeconds = 2000;

  useEffect(() => {
    let timeoutId;

    const handleButtonClick = () => {
      const shareUrl = url.includes('meals')
        ? `http://localhost:3000/meals/${id}`
        : `http://localhost:3000/drinks/${id}`;

      copy(shareUrl);
      setBtnCopy(true);

      // Clear the previous timeout (if any)
      if (timeoutId) {
        clearTimeout(timeoutId);
      }

      // Set a new timeout to reset btnCopy after 3 seconds
      timeoutId = setTimeout(() => {
        setBtnCopy(false);
      }, twoSeconds);
    };

    // Attach the event listener to the button
    const shareButton = document.querySelector('[data-testid="share-btn"]');
    if (shareButton) {
      shareButton.addEventListener('click', handleButtonClick);
    }

    // Cleanup function
    return () => {
      // Remove the event listener when the component unmounts
      if (shareButton) {
        shareButton.removeEventListener('click', handleButtonClick);
      }

      // Clear the timeout to prevent memory leaks
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [url, id]);

  return (
    <div className="share-btn">
      <button
        className="btn btn-outline-dark"
        data-testid="share-btn"
        type="button"
      >
        Share
      </button>
      {btnCopy && <p className="share-text">Link copied!</p>}
    </div>
  );
}

export default ShareBtn;
