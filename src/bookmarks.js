import $ from "jquery";
import store from "./store";
import api from "./api";

// call this function when submitting new bookmark, returns form object as string
function serializeJson(form) {
  const formData = new FormData(form);
  const jsonObj = {};
  formData.forEach((val, name) => (jsonObj[name] = val));
  return JSON.stringify(jsonObj);
}

// generates the HTML for the star rating
const generateRatingString = function() {
  return `
    <span class="fa fa-star checked"></span>
    `;
};

// creates an array of the html from generateRatingString. Used to display rating visually in initial view.
const generateRatingRepeat = function(num) {
  let ratingArr = [];
  for (let i = 0; i < num; i++) {
    let stringResult = generateRatingString();
    ratingArr.push(stringResult);
  }
  return ratingArr;
};

// generates <li> element for added bookmark
// runs star rating function to display correct rating when generating the bookmark
const generateBookmarkElement = function(page) {
  let pageRating = generateRatingRepeat(page.rating).join("");

  // if expanded property is false, add class of title-expand__collapsed. Otherwise, set to __expanded
  let pageTitle = `
    <span class="bookmark-page-title ${
      !page.expanded ? "title-expand__collapsed" : "title-expand__expanded"
    }">
      ${page.title}
    </span>
  `;

  return `
    <li class="js-bookmark" data-page-id="${page.id}">
    <i class="fa fa-caret-square-o-down" data-expand-id="${page.id}"></i>
    ${pageTitle}
      <span class="rating-controls">
      ${pageRating}
      </span>
    </li>
    `;
};

// generates a list of all bookmarks in array, uses map method to return the <li> elements from above
const generateBookmarkString = function(bookmarkArray) {
  const pages = bookmarkArray.map(page => generateBookmarkElement(page));
  return pages.join("");
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
    $(".error-container").html(displayError);
  } else {
    $(".error-container").empty();
  }
};

// allows user to close the error using button generated in generateError()
const handleCloseError = function() {
  $(".error-container").on("click", "#cancel-error", () => {
    store.setError(null);
    renderError();
  });
};

// render bookmarks (first renderError to check for existence of value in
// error prop (default is set to null) and display the message if found)
const render = function() {
  renderError();

  let pages = [...store.pages];

  // filter pages list by ratings
  if (store.filter > 0) {
    pages = pages.filter(page => {
      return page.rating >= store.filter;
    });
  }
  //render the bookmarks in the DOM
  const bookmarksString = generateBookmarkString(pages);

  //insert that HTML into the DOM
  $(".js-bookmarks-list").html(bookmarksString);
};

const getItemIdFromElement = function(page) {
  return $(page)
    .closest(".js-bookmark")
    .data("page-id");
};

const generateExpandBookmarkHtml = function(page) {
  let pageRating = generateRatingRepeat(page.rating).join("");
  return `
    <h2 class="title" <i class="fa fa-caret-square-o-down" data-expand-id="${
      page.id
    }"></i>
    ${page.title}
      <span class="rating-controls">
        ${pageRating}
      </span>
      </h2>
      <div class="site-link">
        <button><a href="${page.url}">Visit Site</a></button>
      </div>
      <p class="description-expanded">${
        page.desc === null ? "" : page.desc
      }</p>  
      <span>
        <button type="button" id="list-view"><< Bookmarks List</button>
        <button type="button" id="delete-bookmark" data-id="${
          page.id
        }"><i class="fa fa-trash-o"></i></button>
      </span>
      
  `;
};

const handleExpandTitle = function() {
  $(".js-bookmarks-list").on("click", ".js-bookmark", event => {
    const id = getItemIdFromElement(event.currentTarget);
    const page = store.findById(id);
    page.expanded = !page.expanded;

    if (page.expanded === true) {
      let expandedView = generateExpandBookmarkHtml(page);
      $(".js-bookmarks-list").html(expandedView);
    }
    //got this to toggle on and off, now I need to api.updatePage(id , expanded: !page:expanded)
    //.then(() => { store.findAndUpdate (id , expanded: !page:expanded })fa-caret-square-o-down
    //render();
    //.catch(error)
  });
};

const handleToggleExpandTitle = function() {
  $("js-bookmarks-list").click(() => {
    store.toggleExpandedView();
    render();
  });
};

const generateNewBookmark = function() {
  return `
  <form class="bookmark" id="js-add-bm-form">
    <fieldset>
        <label class="title" for="bookmark-id-1">Title:
            <input class="title" type="text" minlength="1" id="bookmark-id-1" name="title" placeholder="Thinkful" required>
        </label>
        <label class="url" for="url-id-2">Website:
            <input type="url" minlength="5" size="30" id="url-id-2" name="url" placeholder="https://thinkful.com" required>
        </label>
        <label class="stars" for="rating">Rate Me!
          <span class="rating-controls">
            <li><label for="rating-1"><i class="fa fa-star"></i></label><input type="radio" name="rating" id="rating-1" value="1" required></li>
            <li><label for="rating-2"><i class="fa fa-star"></i></label><input type="radio" name="rating" id="rating-2" value="2" required></li>
            <li><label for="rating-3"><i class="fa fa-star"></i></label><input type="radio" name="rating" id="rating-3" value="3" required></li>
            <li><label for="rating-4"><i class="fa fa-star"></i></label><input type="radio" name="rating" id="rating-4" value="4" required></li> 
            <li><label for="rating-5"><i class="fa fa-star"></i></label><input type="radio" name="rating" id="rating-5" value="5" required></li>
          </span>
        </label>
        <label for="description">Description:
            <input type="text" id="description" name="desc">
        </label>
       
        <span class="js-bookmark-submission">
          <button type="button" class="in-add-form" name="cancel" id="js-cancel">Cancel</button> 
          <button type="submit" class="in-add-form" name="submit" id="js-add-bm">Create</button> 
        </span>
         
    </fieldset>
  </form>
  `;
};

//when new bookmark clicked, generates html for the add bookmark view
const handleAddNewBookmarkForm = function() {
  let formAdd = generateNewBookmark();
  $(".js-new-bookmark-form").on("click", ".js-add-bm", event => {
    event.preventDefault();
    $(".js-bookmarks-list").html(formAdd);
    $(".new-bookmark").hide();
  });
};

const handleCancelNewBookmarkForm = function() {
  $(".container").on("click", "#js-cancel", () => {
    $(".new-bookmark").show();
    render();
  });
};

const handleNewBookmarkSubmit = function() {
  $(".container").on("submit", "#js-add-bm-form", event => {
    event.preventDefault();
    let submittedBookmarkForm = serializeJson(event.currentTarget);

    api
      .createBookmark(submittedBookmarkForm)
      .then(submittedBookmark => {
        store.addPage(submittedBookmark);
        render();
      })
      .catch(err => {
        store.setError(err.message);
        renderError();
      });
    $(".new-bookmark").show();
  });
};

const handleDeleteBookmarkClicked = function() {
  $(".container").on("click", "#delete-bookmark", event => {
    const id = $(event.currentTarget).data("id");

    api
      .deleteBookmark(id)
      .then(() => {
        store.findAndDelete(id);
        render();
      })
      .catch(err => {
        store.setError(err.message);
        renderError();
      });
  });
};

const handleBackToListViewOnClick = function() {
  $(".container").on("click", "#list-view", () => {
    render();
  });
};

const handleFilter = function() {
  $(".filter-select").on("change", event => {
    let result = $(event.currentTarget).val();
    store.filter = parseInt(result, 10);
    render();
  });
};

const handleRating = function() {
  $(".container").on("click", ".fa-star", event => {
    $(".fa-star").removeClass("active");
    $(".fa-star").removeClass("active-adjacent");
    $(event.currentTarget).addClass("active");
    $(event.currentTarget)
      .prevAll()
      .addClass("active-adjacent");
  });
};

const bindEventListeners = function() {
  handleFilter();
  handleRating();
  handleCloseError();
  handleAddNewBookmarkForm();
  handleNewBookmarkSubmit();
  handleExpandTitle();
  handleCancelNewBookmarkForm();
  handleDeleteBookmarkClicked();
  handleToggleExpandTitle();
  handleBackToListViewOnClick();
};

export default {
  render,
  bindEventListeners
};
