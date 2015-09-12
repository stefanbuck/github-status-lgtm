'use strict';

const Hapi = require('hapi');
const server = new Hapi.Server();
const updateStatus = require('./src/update-status');
const prDetails = require('./src/pr-details');
const countComments = require('./src/count-comments');

const ISSUE_COMMENT = 'issue_comment';
const PULL_REQUEST = 'pull_request';
const allowedEvents = [ISSUE_COMMENT, PULL_REQUEST];

server.connection({
  routes: {
    cors: true
  },
  port: process.env.PORT || 3000
});

server.route({
  method: 'POST',
  path: '/',
  handler: function(request, reply) {
    const webHookEvent = request.headers['x-github-event'];

    // Ignore unrelated events if WebHook is misconfigured.
    if (allowedEvents.indexOf(webHookEvent) === -1) {
      return reply(200);
    }

    prDetails(request.payload).then((obj) => {
      updateStatus(obj.repo, obj.sha, 'pending');

      return countComments(obj.commentsUrl).then((msg) => {
        updateStatus(obj.repo, obj.sha, msg.state, msg.description);
        reply(200);
      });
    }).catch((req) => {
      console.error(req.response.body);
      reply(req.response.body);
    })
  }
});

server.start(function () {
  console.log('Server running at:', server.info.uri);
});
