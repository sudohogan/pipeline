@Library("shared-lib@main") _
pipeline {
    agent any  // Top-level agent none requires node blocks in stages

    stages {
        stage('hello') {
            steps{
                helloWorld()
            }
        }

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
            agent { 
                docker {
                    image 'node:20-alpine'
                    args '-u root'  // Needed for package installations
                }
            }
            environment {
                SONAR_URL = "https://congenial-doodle-6xp9qj46xjr2545-9000.app.github.dev"
            }
            steps {
                withCredentials([string(credentialsId: 'sonar', variable: 'SONAR_TOKEN')]) {
                    sh '''
                        # Install SonarScanner if not present
                        npm install -g sonarqube-scanner
                        
                        # Run analysis (for Node.js/TS projects)
                        sonar-scanner \
                            -Dsonar.projectKey=your-project-key \
                            -Dsonar.host.url=${SONAR_URL} \
                            -Dsonar.login=${SONAR_TOKEN} \
                            -Dsonar.sources=src \
                            -Dsonar.tests=test \
                            -Dsonar.javascript.lcov.reportPaths=coverage/lcov.info
                    '''
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
            echo "❌ Failure: Pipeline failed! Sending Telegram alert..."
            script {
                // Get basic build info
                def duration = currentBuild.durationString.replace(' and counting', '')
                // Message content
                def message = """
                🚨 *Pipeline Failed* 🚨
                *Duration*: ${duration}
                """.stripIndent()

                // Send to Telegram (using curl)
                withCredentials([
                    string(credentialsId: 'telegram-bot-token', variable: 'BOT_TOKEN'),
                    string(credentialsId: 'telegram-chatId', variable: 'CHAT_ID')
                    ]) {
                    sh '''
                        curl -s -X POST \
                        "https://api.telegram.org/bot$BOT_TOKEN/sendMessage" \
                        -d chat_id=$CHAT_ID \
                        -d text="${message}" \
                        -d parse_mode=Markdown
                    '''
                }
            }
        }
    }
}