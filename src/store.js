const pages = [];
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