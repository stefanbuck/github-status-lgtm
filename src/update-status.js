'use strict';

const ghGot = require('gh-got');

module.exports = function(repo, sha, state, description) {
  const url = `repos/${repo}/statuses/${sha}`;

  const body = {
    state: state || 'pending',
    description: description || '',
    context: 'stefanbuck/lgtm'
  };

  return ghGot.post(url, {
    token: process.env.TOKEN,
    body: JSON.stringify(body)
  });
}
