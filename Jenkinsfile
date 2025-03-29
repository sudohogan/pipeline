pipeline {
    agent none

    stages {
        stage('Install & Run Node.js App') {
            agent {
                docker { image 'node:20-alpine' }
            }
            steps {
                sh '''
                    echo "Installing dependencies..."
                    npm install -g pnpm
                    pnpm setup                         # This creates the required global bin directory
                    source ~/.bashrc                   # Refresh environment
                    pnpm install -g typescript ts-node # Install TypeScript globally
                    pnpm install                       # Install project dependencies
                    
                    echo "Running app.ts..."
                    ts-node src/app.ts                 # Execute the TypeScript file
                '''
            }
        }
    }

    post {
        success {
            echo "✅ Success: Test app ran successfully!"
        }
        failure {
            echo "❌ Failure: Pipeline failed! Check logs for errors."
        }
    }
}