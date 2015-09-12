'use strict';

const ghGot = require('gh-got');
const GITHUB_DOMAIN = 'https://api.github.com/';

function removeGitHubDomain(url) {
  return url.replace(GITHUB_DOMAIN, '')
}

module.exports = function(body) {
  var promise = new Promise((resolve, reject) => {
    if (body.pull_request && body.pull_request.head) {
      const head = body.pull_request.head;
      resolve({
        sha: head.sha,
        repo: head.repo.full_name,
        commentsUrl: removeGitHubDomain(body.pull_request.comments_url)
      });
    } else {
      ghGot.get(removeGitHubDomain(body.issue.pull_request.url), {
        token: process.env.TOKEN
      }).then(function(res) {
        const head = res.body.head;
        resolve({
          sha: head.sha,
          repo: head.repo.full_name,
          commentsUrl: removeGitHubDomain(res.body.comments_url)
        });

      }).catch(reject);
    }
  });

  return promise;
}
