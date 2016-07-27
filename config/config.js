


module.exports = {

    // Hooks configuration
    hook : {
        event :'push',
        ref :'refs/heads/master',
        repoPath : "C:\\Inetpub\\vhosts\\yoursite.com\\httpdocs",
        port : 9900,
		
		// Git
        git: {
            authType: 'ssh', // Could be 'plain' or 'ssh'
            username: "git",
            pass: "",
            sshPrivate: "~/.ssh/id_rsa",
            sshPub: "~/.ssh/id_rsa.pub"
        },

        type: 'bitbucket', // Hook type, could be 'bitbucket' or 'github',
        
        // After party tasks
        tasks: [''] // You may add tasks below ( as you can see two tasks are available: 'compile' )
                    // Tasks will be run after in order ['compile', 'something' ...]

    },

    runner : {
        tasks : {
            compile : {
                projectPath : "C:\\work\\release",
				makePath : "C:\\work\\release"
            }
        }
    }
};