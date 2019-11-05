import store from './store';

// generates <li> element for added bookmark
const generateBookmarkElement = function(bookmark) {};

// generates a list of all bookmarks in array, uses map method
const generateBookmarkString = function(bookmarkArray) {};

// generate error function to send user a message and allow them to cancel out
const generateError = function(message) {};

// render the error when error caught
const renderError = function() {};

// allows user to close the error using button generated in generateError()
const closeError = function() {
  store.setError(null);
  renderError();
};

// render bookmarks (first renderError)
// sort item list by ratings
// render the shopping list in the DOM

const render = function() {
  renderError();

  let pages = [...store.pages];
  pages = pages.sort((a,b) => b-a);

  //render the bookmarks in the DOM
  const bookmarksString = generateBookmarkString(pages);

  //insert that HTML into the DOM
  $('.???').html(bookmarksString);
}

