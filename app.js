require('shelljs/global');

var config = require("./config/config"),
    hook = require("./modules/hook");


if (config.type == 'bitbucket') {
    // Setup BitBucket hook listener
    hook.hookBitBucket(config.hook);
} else {
    // Setup GitHub hook listener
    hook.hookGithub(config.hook);
}
