
module.exports.exec_list = _exec_list;
module.exports.exec = _exec;


/**
 * Execute list of the commands
 * @param commands
 * @returns {boolean}
 * @private
 */
function _exec_list(commands) {

    // Exec commands
    for (var i = 0; i < commands.length; i++) {
		
		console.log("Executing command: " + commands[i]);
		
        var result = exec(commands[i]);
        if (result.code !== 0) {
            console.log(result);
            return false
        }

        console.log(result);
    }

    return true;
}

/**
 * Exec single task
 * @param command
 * @returns {boolean}
 * @private
 */
function _exec(command) {

    var result = exec(command);
    if (result.code !== 0) {
        console.log(result);
        return false
    }

    console.log(result);

    return true;
}