 const scanner = require('sonarqube-scanner').default;

scanner(
    {
        serverUrl: 'http://localhost:9000',
        token: "sqp_733f38ec752fdcf3e71dbe7e1926a6d0f7b7c9c2",
        options: {
            'sonar.projectName': 'sonarqube-spc-node',
            'sonar.projectDescription': 'Here I can add a description of my project',
            'sonar.projectKey': 'sonarqube-spc-node',
            'sonar.projectVersion': '0.0.1',
            'sonar.sourceEncoding': 'UTF-8',
            'sonar.login':'sqp_733f38ec752fdcf3e71dbe7e1926a6d0f7b7c9c2',
            'sonar.exclusions': 'public/**/*'

        }
    },
    error => {
        if (error) {
            console.error(error);
        }
        process.exit();
    },
)