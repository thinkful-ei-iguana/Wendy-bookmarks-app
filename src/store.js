import page from './page';

const pages = [
  {
    'id': '8sdfbvbs65sd',
    'title': 'Google',
    'url': 'http://google.com',
    'desc': 'An indie search engine startup',
    'rating': 4,
    'expanded': false
  },
  {
    'id': '9sdfbvbs65sd',
    'title': 'Thinkful',
    'url': 'http://thinkful.com',
    'desc': 'A bootcamp',
    'rating': 4,
    'expanded': false
  }
];
let adding = false;
let error = null;
let filter = 0;

const findById = function (id) {
  return this.pages.find(currentPage => currentPage.id === id);
};

const setError = function(error) {
  this.error = error;
};

const addPage = function(bookmark) {
  try {
    this.pages.push(page.createPage(bookmark));
    console.log(this.pages);
  } catch(e) {
    console.log(e.message);
  }
};

export default {
  pages,
  adding,
  error,
  filter,
  findById,
  setError,
  addPage
};