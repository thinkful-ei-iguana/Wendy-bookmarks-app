import $ from 'jquery';
import store from './store';
import api from './api';

// call this function when submitting new bookmark

function serializeJson(form) {
  const formData = new FormData(form);
  const jsonObj = {};
  formData.forEach((val, name) => jsonObj[name] = val);
  return JSON.stringify(jsonObj);
}


// generates <li> element for added bookmark
const generateBookmarkElement = function(page) {
  // if expanded propert is false, add class of title-expand__collapsed. Otherwise, set to __expanded
  // got this to toggle on and off by clicking on each dropdown HOW DO I GET THE PAGE TO RE-RENDER?
  let pageTitle = `
    <span class="bookmark-page-title ${!page.expanded ? 'title-expand__collapsed' : 'title-expand__expanded'}">
      ${page.title}
    </span>
  `;
  
  return `
    <li class="js-bookmark" data-page-id="${page.id}">
    <i class="fa fa-caret-square-o-down" data-expand-id="${page.id}"></i>
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


// generates a list of all bookmarks in array, uses map method to return the <li> elements from above
const generateBookmarkString = function(bookmarkArray) {
  const pages = bookmarkArray.map(page => generateBookmarkElement(page));
  return pages.join('');
};

// generate error function to send user a message and allow them to cancel out
const generateError = function(message) {
  return `
      <section class="error-container">
        <button id="cancel-error">X</button>
        <p>${message}</p>
      </section>
    `;
};

// render the error when error caught
const renderError = function() {
  if (store.error) {
    const displayError = generateError(store.error);
    $('.error-container').html(displayError);
  } else {
    $('.error-container').empty();
  }
};

// allows user to close the error using button generated in generateError()
const handleCloseError = function () {
  $('.error-container').on('click', '#cancel-error', event => {
    store.setError(null);
    renderError();
  });
};

// render bookmarks (first renderError)
// filter pages list by ratings
// render the shopping list in the DOM

const render = function() {
  renderError();

  let pages = [...store.pages];
  // //filter by rating
  // if (this is higher than the id of the rating) {
  //   pages = pages.filter(page => page.id);
  // }

  //render the bookmarks in the DOM
  const bookmarksString = generateBookmarkString(pages);

  //insert that HTML into the DOM
  $('.js-bookmarks-list').html(bookmarksString);
};

const getItemIdFromElement = function (page) {
  return $(page)
    .closest('.js-bookmark')
    .data('page-id');
};

const handleExpandTitle = function () {
  $('.js-bookmarks-list').on('click', '.fa-caret-square-o-down', event => {
    const id = getItemIdFromElement(event.currentTarget);
    const page = store.findById(id);
    page.expanded = !page.expanded;
    //got this to toggle on and off, now I need to api.updatePage(id , expanded: !page:expanded)
    //.then(() => { store.findAndUpdate (id , expanded: !page:expanded })
    render();
    //.catch(error)
    console.log(page);
  });
};

const generateNewBookmark = function() {
  //UPDATE FOR EACH ID
  return `
  <form class="bookmark" id="js-add-bm">
    <fieldset>
        <label class="title" for="bookmark-id-1">Name:
            <input class="hidden-add" type="text" minlength="1" id="bookmark-id-1" name="title" placeholder="Thinkful">
        </label>
        <label class="url" for="url-id-2">Website:
            <input type="url" minlength="5" size="30" id="url-id-2" name="url" placeholder="https://www.thinkful.com">
        </label>
        <label class="stars" for="rating">Rate Me!
          <label><input type="radio" name="rating" value="1"><span></span></label>
          <input type="radio" name="rating" value="2">
          <input type="radio" name="rating" value="3">
          <input type="radio" name="rating" value="4">
          <input type="radio" name="rating" value="5">        
        </label>
        <label for="description">Description
            <input type="text" id="description" name="desc" placeholder="What do you like about me?">
        </label>
        <button type="button" name="cancel" id="js-cancel form-button">Cancel</button> 
        <button type="submit" name="submit" id="js-add-bm form-button">Create</button> 
    </fieldset>
  </form>
  `;
};

// const generateNewBookmarkString = function(bookmarkArray) {
//   const pages = bookmarkArray.map(page => generateNewBookmark(page));
//   return pages.join('');
// };

//when new bookmark clicked, generates html for the add bookmark view
const handleAddNewBookmarkForm = function() {
  let formAdd = generateNewBookmark(); 
  $('.js-new-bookmark-form').on('click', '.js-add-bm',event => {
    event.preventDefault();
    $('.js-bookmarks-list').html(formAdd);  
    $('.js-add-bm').hide();
    console.log('adding form');
  });
};

const handleNewBookmarkSubmit = function() {
  $('.js-bookmarks-list').on('submit', '#js-add-bm', event => {
    event.preventDefault();
    let submittedBookmarkForm = serializeJson(event.currentTarget);
    console.log(submittedBookmarkForm);
    api.createBookmark(submittedBookmarkForm)
      .then((submittedBookmark) => {
        store.addPage(submittedBookmark);
        console.log(submittedBookmark);
        render();
      })
      .catch((err) => {
        store.setError(err.message);
        renderError();
      });
    $('.js-add-bm').show();
  });
};

// const handleRating = function() {
//   $('.fa-star').on('click', event => {
//     let ratingId = $(event.currentTarget).data('rating-id');
//     let bookmarkId = $(event.currentTarget).parent().parent().data('page-id');
//     console.log(`${bookmarkId}: ${ratingId}`);
//   });
// };

const bindEventListeners = function () {
  //handleRating();
  handleCloseError();
  handleAddNewBookmarkForm();
  handleNewBookmarkSubmit();
  handleExpandTitle();
};

export default {
  render,
  generateNewBookmark,
  bindEventListeners
};