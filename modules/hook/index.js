var githubhook = require('githubhook'),
    express = require('express'),
    app = express(),
    nodegit = require("nodegit"),
    path = require("path"),
    runner = require("../runner");

module.exports.hookGithub = _github;
module.exports.hookBitBucket = _bitbucket;

/**
 * Load from github
 * @param config
 * @private
 */
function _github(config) {

    var github = githubhook( {port: config.port} );
    
    github.on('*', function (event, repo, ref, data) {

        if (event == config.event && ref == config.ref) {
            _merge(config);
        }
    });

    github.listen();
}

/**
 * Load from BitBucket
 * @param config
 * @private
 */
function _bitbucket(config) {

    app.post('/', function (req, res) {
        var identity = req.header('user-agent');
        var type = req.header('x-event-key');

        if (identity == 'Bitbucket-Webhooks/2.0' && type == 'repo:push') {
            _merge(config);
        }

        res.send('OK');
    });

    app.listen(config.port, function() {
        console.log('Listening for hooks!');
    });
}

/**
 * Merge repository
 * @param config
 * @private
 */
function _merge(config) {
    nodegit.Repository.open(config.repoPath)
        .then(function(repo) {
            repository = repo;

            return repository.fetchAll({
                callbacks: {
                    credentials: function(url, userName) {

                        if (config.authType == 'ssh') {
                            return cred = nodegit.Cred.sshKeyNew(
                                config.git.username,
                                config.git.sshPub,
                                config.git.sshPrivate,
                                "");
                        } else {
                            return nodegit.Cred.userpassPlaintextNew(config.git.username, config.git.pass);
                        }
                    },
                    certificateCheck: function() {
                        return 1;
                    }
                }
            });
        })
        // Merge branches
        .then(function() {
            return repository.mergeBranches("master", "origin/master");
        })
        .done(function() {

            console.log("Successfully retrieved and merged repository!");
            
            // Run tasks after compile if that is enabled and will be run in order
            if (config.tasks.length != 0) {
                for (var i = 0;i < config.tasks.length; i++) {
                    console.log("Running task: " + config.tasks[i]);
                    runner.run(config.tasks[i]);
                }
            }
        });
}