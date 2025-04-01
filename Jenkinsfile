pipeline {
    agent none  // Top-level agent none requires node blocks in stages

    stages {
        stage('Checkout') {
            agent any  // Add agent to this stage
            steps {
                git branch: 'main', url: 'https://github.com/sudohogan/pipeline.git'
            }
        }
        
        stage('Build and Test') {
            agent { 
                docker {
                    image 'node:20-alpine'
                    args '-u root'  // Needed for package installations
                }
            }
            steps {
                sh ''' 
                    echo "Installing dependencies..."
                    npm install -g pnpm
                    export PNPM_HOME="/usr/local/bin"
                    export PATH="$PNPM_HOME:$PATH"
                    pnpm add -g typescript ts-node
                    pnpm install
                    pnpm test
                '''
            }
        }
        
        stage('Static Code Analysis') {
            agent any  // Add agent
            environment {
                SONAR_URL = "https://congenial-doodle-6xp9qj46xjr2545-9000.app.github.dev"
            }
            steps {
                withCredentials([string(credentialsId: 'sonar', variable: 'sonar')]) {
                    // Your SonarQube analysis commands
                }
            }
        }
        
        stage('Build and Push to Docker Hub') {
            agent any
            environment {
                DOCKER_IMAGE = "sudohogan/my-node-app:${BUILD_NUMBER}"
            }
            steps {
                withCredentials([usernamePassword(
                    credentialsId: 'docker',
                    usernameVariable: 'DOCKER_USERNAME',
                    passwordVariable: 'DOCKER_PASSWORD'
                )]) {
                    sh '''
                        # Login to Docker Hub
                        echo "$DOCKER_PASSWORD" | docker login -u "$DOCKER_USERNAME" --password-stdin

                        # Build Docker image (adjust Dockerfile path as needed)
                        docker build -t ${DOCKER_IMAGE} .

                        # Push to Docker Hub
                        docker push ${DOCKER_IMAGE}

                        # Clean up
                        docker logout
                    '''
                }
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