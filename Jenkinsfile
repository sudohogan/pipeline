pipeline {
  agent node

  stages {
        stage('Checkout') {
            steps {
                git branch: 'main', url: 'https://github.com/sudohogan/pipeline.git'
            }
        }
    stage('Build and Test') {
        agent {  // Add agent here or to individual stages
            docker {
                image 'node:18-alpine'  // Example: Use Node.js container
                //args '-u root'  // Optional: Run as root for installations
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
                    
                    echo "Tesing app.ts..."
                    ts-node test/app.test.ts
                '''
        }
    }
    stage('Static Code Analysis') {
      environment {
        SONAR_URL = "https://congenial-doodle-6xp9qj46xjr2545-9000.app.github.dev"
      }
      steps {
        withCredentials([string(credentialsId: 'sonar', variable: 'sonar')]) {
        //   sh 'cd java-maven-sonar-argocd-helm-k8s/spring-boot-app && mvn sonar:sonar -Dsonar.login=$SONAR_AUTH_TOKEN -Dsonar.host.url=${SONAR_URL}'
        }
      }
    }
    // stage('Build and Push Docker Image') {
    //   environment {
    //     DOCKER_IMAGE = "abhishekf5/ultimate-cicd:${BUILD_NUMBER}"
    //     // DOCKERFILE_LOCATION = "java-maven-sonar-argocd-helm-k8s/spring-boot-app/Dockerfile"
    //     REGISTRY_CREDENTIALS = credentials('docker-cred')
    //   }
    //   steps {
    //     script {
    //         sh 'cd java-maven-sonar-argocd-helm-k8s/spring-boot-app && docker build -t ${DOCKER_IMAGE} .'
    //         def dockerImage = docker.image("${DOCKER_IMAGE}")
    //         docker.withRegistry('https://index.docker.io/v1/', "docker-cred") {
    //             dockerImage.push()
    //         }
    //     }
    //   }
    // }
    stage('Update Deployment File') {
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
                    git push https://${github}@github.com/${GIT_USER_NAME}/${GIT_REPO_NAME} HEAD:main
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