var githubhook = require('githubhook'),
    nodegit = require("nodegit"),
    path = require("path");

require('shelljs/global');

var github = githubhook( {port: 9900} );

var repoPath = "../TestRep";
var projectPath = "proj";
var qtPath = "\\Qt\\Qt.5.5.1\\mscv2013_64\\bin\\";
var vcvarsAll = "\\Program Files (x86)\\Microsoft Visual Studio 12.0\\VC\\vcvarsall.bat";
var makeDir = "";


github.listen();

github.on('*', function (event, repo, ref, data) {
    
    if (event == 'push' && ref == 'refs/heads/master') {
        nodegit.Repository.open(path.resolve(__dirname, repoPath))
            .then(function(repo) {
                repository = repo;

                return repository.fetchAll({
                    callbacks: {
                        credentials: function(url, userName) {
                            return nodegit.Cred.sshKeyFromAgent(userName);
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
                console.log("Successfully retrieved repository!");

                console.log("Trying to compile binaries...");

                cd(projectPath);

                // List of the commands which will be executed in sequence
                var commands = [qtPath + "qmake -project",
                    qtPath + "qmake",
                    vcvarsAll,
                    makeDir + "make"];

                for (var i = 0; i < commands.length; i++) {

                    var compiled = exec(commands[i]);
                    if (compiled.code !== 0) {
                        console.log(compiled);
                        exit(0);
                    }

                    console.log(compiled);
                }
            });
    }
    
    //console.log(event, repo, ref, data);
});
