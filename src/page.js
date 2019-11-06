import cuid from 'cuid';

const createPage = function ({title, url, desc, rating}) {
  return {
    id: cuid(),
    title,
    url,
    desc,
    rating,
    expanded: false
  };
};

export default {
  createPage
};