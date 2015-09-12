'use strict';

const ghGot = require('gh-got');
const TERM = 'LGTM';
const MIN_TERM_COUNT = 2;

module.exports = function(url) {

  return ghGot.get(url, {
    token: process.env.TOKEN
  }).then(function(res) {
    const ret = res.body.filter(function(comment) {
      return comment.body.indexOf(TERM) > -1;
    });

    if (ret.length >= MIN_TERM_COUNT) {
      return {
        state: 'success',
        description: `Awesome, you've got ${ret.length} times a ${TERM}`
      }
    }

    return {
      state: 'failure',
      description: `Waiting for ${MIN_TERM_COUNT - ret.length} more ${TERM}`
    }
  });
}
