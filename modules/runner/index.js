var config = require("../../config/config");

module.exports.run = _run;

function _run(task) {
    var taskRun = require("./tasks/" + task);

    taskRun.run(config.runner.tasks);
}