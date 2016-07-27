var common = require("./common");

module.exports.run = _run;

/**
 * Run the compile task
 * @param config
 * @returns {boolean}
 * @private
 */
function _run(config) {

    // TODO: Add app settings from config
    cd(config.compile.projectPath);

    // Close the process
    common.exec("taskkill /F /IM App.exe");

    // Compile
    if (!common.exec("qmake App.pro -r -spec win32-msvc2013")) {
        return false;
    }

    // Make
	cd(config.compile.makePath);
    common.exec("nmake");
		
    // Run process again in async and log output to console
	exec("release\\App.exe", function(code, stdout, stderr) {
		console.log(code, stdout, stderr);
	});
	
}