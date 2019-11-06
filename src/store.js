const pages = [
  {
    'id': '8sdfbvbs65sd',
    'title': 'Google',
    'url': 'http://google.com',
    'desc': 'An indie search engine startup',
    'rating': 4
  },
  {
    'id': '9sdfbvbs65sd',
    'title': 'Thinkful',
    'url': 'http://thinkful.com',
    'desc': 'A bootcamp',
    'rating': 4
  }
];
let error = null;
let ratingChecked = false;

const setError = function(error) {
  this.error = error;
};

export default {
  pages,
  error,
  ratingChecked,
  setError
};