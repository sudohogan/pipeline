@Library("shared-lib@main") _

pipeline {
    agent any
    options {
        skipDefaultCheckout()
    }

    stages {
        stage('hello') {
            steps {
                helloWorld()
            }
        }
        
        stage('Build and Test') {
            agent { 
                docker {
                    image 'node:20-alpine'
                    args '-u root'
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
                    image 'node:20-bullseye'  // Has Java preinstalled
                    args '-u root'
                }
            }
            steps {
                withCredentials([string(credentialsId: 'sonar', variable: 'SONAR_TOKEN')]) {
                    sh '''
                        npm install -g sonarqube-scanner
                        sonar-scanner \
                            -Dsonar.projectKey=your-project-key \
                            -Dsonar.host.url=https://congenial-doodle-6xp9qj46xjr2545-9000.app.github.dev \
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
                        echo "$DOCKER_PASSWORD" | docker login -u "$DOCKER_USERNAME" --password-stdin
                        docker build -t ${DOCKER_IMAGE} .
                        docker push ${DOCKER_IMAGE}
                        docker logout
                    '''
                }
            }
        }
    }
    
    post {
        failure {
            script {
                def duration = currentBuild.durationString.replace(' and counting', '')
                def message = """
                🚨 *Pipeline Failed* 🚨
                *Duration*: ${duration}
                """.stripIndent()

                withCredentials([
                    string(credentialsId: 'telegram-bot-token', variable: 'BOT_TOKEN'),
                    string(credentialsId: 'telegram-chatId', variable: 'CHAT_ID')
                ]) {
                    sh """
                        curl -s -X POST \
                        "https://api.telegram.org/bot\$BOT_TOKEN/sendMessage" \
                        -d chat_id=\$CHAT_ID \
                        -d text="${message}" \
                        -d parse_mode=Markdown
                    """
                }
            }
        }
    }
}