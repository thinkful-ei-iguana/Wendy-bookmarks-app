import $ from 'jquery';
import store from './store';
import page from './page';

// call this function when submitting new bookmark
$.fn.extend({
  serializeJson: function() {
    const formData = new FormData(this[0]);
    const jsonObj = {};
    formData.forEach((val, name) => jsonObj[name] = val);
    return JSON.stringify(jsonObj);
  },
});

// generates <li> element for added bookmark
const generateBookmarkElement = function(page) {
  let pageTitle = `<span class="bookmark-page-title">${page.title}</span>`;

  return `
    <li class="js-bookmark" data-page-id="${page.id}">
    ${pageTitle}
      <span class="rating-controls">
        <span class="fa fa-star" data-rating-id="1"></span>
        <span class="fa fa-star" data-rating-id="2"></span>
        <span class="fa fa-star" data-rating-id="3"></span>
        <span class="fa fa-star" data-rating-id="4"></span>
        <span class="fa fa-star" data-rating-id="5"></span>
      </span>
    </li>
    `;
};

// generates a list of all bookmarks in array, uses map method
const generateBookmarkString = function(bookmarkArray) {
  const pages = bookmarkArray.map(page => generateBookmarkElement(page));
  return pages.join('');
};

// generate error function to send user a message and allow them to cancel out
//const generateError = function(message) {};

// render the error when error caught
//const renderError = function() {};

// allows user to close the error using button generated in generateError()
// const closeError = function() {
//   store.setError(null);
//   renderError();
// };

// render bookmarks (first renderError)
// sort item list by ratings
// render the shopping list in the DOM

const render = function() {
  //renderError();

  let pages = [...store.pages];
  //pages = pages.sort((a,b) => b-a);

  //render the bookmarks in the DOM
  const bookmarksString = generateBookmarkString(pages);

  //insert that HTML into the DOM
  $('.js-bookmarks-list').html(bookmarksString);
};

const generateNewBookmark = function(page) {
  let bookmarkForm = page.createPage;
  return `
  <form class="bookmark" data-id="${bookmarkForm.id}">
        <label class="title" for="bookmark-id-${page.id}" name="title">Name:
            <input type="text" id="bookmark-id-${page.id}" name="title" placeholder="Thinkful" required>
        </label>
        <label class="url" for="url-id-${page.id}" name="url">Website:
            <input type="url" id="url-id-{page.id}" name="url" placeholder="https://www.thinkful.com" required>
        </label>
        <label class="stars" for="rating-{id}" name="rating">Rate Me!
                <span class="fa fa-star" id="rating-{id}"></span>
                <span class="fa fa-star" id="rating-{id}"></span>
                <span class="fa fa-star" id="rating-{id}"></span>
                <span class="fa fa-star" id="rating-{id}"></span>
                <span class="fa fa-star" id="rating-{id}"></span>       
        </label>
        <label for="description" name="describe-me">Description
            <input type="text" id="description" name="describe-me" placeholder="What do you like about this site?">
        </label>
        <button type="button" name="cancel" id="cancel button">Cancel</button> 
        <button type="submit" name="submit" id="add-bm button">Create</button> 
  </form>
  `;
};

// const generateNewBookmarkString = function(bookmarkArray) {
//   const pages = bookmarkArray.map(page => generateNewBookmark(page));
//   return pages.join('');
// };

//when new bookmark clicked, generates html for the add bookmark view
const handleAddNewBookmarkForm = function() {
  let formAdd = generateNewBookmark(page); 
  $('.new-bookmark').on('click', event => {
    event.preventDefault();
    $('.js-bookmarks-list').html(formAdd);  
    console.log('adding form');
  });
};

const submitNewBookmark = function() {
  
};

const handleRating = function() {
  $('.fa-star').on('click', event => {
    let ratingId = $(event.currentTarget).data('rating-id');
    let bookmarkId = $(event.currentTarget).parent().parent().data('page-id');
    console.log(`${bookmarkId}: ${ratingId}`);
  });
};


export default {
  render,
  handleRating,
  generateNewBookmark,
  handleAddNewBookmarkForm
};