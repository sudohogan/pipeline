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
        
        stage('Update Deployment File') {
            agent any  // Add agent
            environment {
                GIT_REPO_NAME = "pipeline"
                GIT_USER_NAME = "sudohogan"
            }
            steps {
                withCredentials([string(credentialsId: 'github', variable: 'GITHUB_TOKEN')]) {
                    sh '''
                        git config user.email "hoganizy85@gmail.com"
                        git config user.name "Isreal Hogan"
                        BUILD_NUMBER=${BUILD_NUMBER}
                        sed -i "s/replaceImageTag/${BUILD_NUMBER}/g" java-maven-sonar-argocd-helm-k8s/spring-boot-app-manifests/deployment.yml
                        git add java-maven-sonar-argocd-helm-k8s/spring-boot-app-manifests/deployment.yml
                        git commit -m "Update deployment image to version ${BUILD_NUMBER}"
                        git push https://${GITHUB_TOKEN}@github.com/${GIT_USER_NAME}/${GIT_REPO_NAME} HEAD:main
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