pipeline {
    agent none

    stages {
        stage('Install & Run Node.js App') {
            agent {
                docker { 
                    image 'node:20-alpine'
                    args '-u root --env SHELL=/bin/sh'  // Explicitly set shell
                }
            }
            steps {
                sh '''
                    echo "Installing dependencies..."
                    npm install -g pnpm

                    # Manual setup for Alpine compatibility
                    export PNPM_HOME="/usr/local/bin"
                    export PATH="$PNPM_HOME:$PATH"
                    
                    echo "Installing TypeScript..."
                    pnpm add -g typescript ts-node
                    
                    echo "Installing project dependencies..."
                    pnpm install
                    
                    echo "Running app.ts..."
                    ts-node src/app.ts
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