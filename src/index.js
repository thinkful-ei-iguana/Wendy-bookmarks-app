import $ from 'jquery';
import api from './api';

function main() {
  api.getItems()
    .then(res => console.log(res));  
  console.log(api.BASE_URL);

  const startMsg = $('<p>Webpack is working!</p>');
  $('#root').append(startMsg);
}

$(main);