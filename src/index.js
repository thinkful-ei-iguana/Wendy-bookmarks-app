import $ from 'jquery';
import './index.css';

import bookmarks from './bookmarks';
import store from './store';
import api from './api';

function main() {
  bookmarks.render(store.pages);
  bookmarks.bindEventListeners(); 

}

$(main);