import $ from 'jquery';
import api from './api';

function main() {
  api.getItems()
    .then(res => console.log(res));  
  
}

$(main);