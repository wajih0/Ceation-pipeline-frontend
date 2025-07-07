pipeline {
  agent any

  tools {
    nodejs 'node-lts' // Assure-toi que tu as ajouté Node.js dans Jenkins → Global Tool Configuration
  }

  environment {
    IMAGE_NAME = "wajihdocker/demoproduit"
    IMAGE_TAG = "latest"
    DOCKER_REGISTRY = "" // <-- change selon ton DockerHub ou Nexus
  }

  stages {
    stage('git') {
     steps {
                    git branch: 'master', url: 'https://github.com/wajih0/Ceation-pipeline-frontend.git'
                }
    }

       stage('Clean') {
                 steps {
                   bat '''
                   if exist dist (
                     rmdir /s /q dist
                   ) else (
                     echo Folder dist does not exist.
                   )
                   '''
                 }
            }

    stage('Build') {
              steps {
                  bat 'npm install'
                  bat 'npm run build -- --configuration=production'
                  bat 'ls -al' // Vérifiez le contenu du répertoire
              }
          }



    stage('Build Docker Image') {
      steps {
        bat "docker build -t ${IMAGE_NAME}:${IMAGE_TAG} ."
      }
    }

//     stage('Push Docker Image') {
//       steps {
//         script {
//           def fullImage = "${DOCKER_REGISTRY}/${IMAGE_NAME}:${IMAGE_TAG}"
//           bat "docker tag ${IMAGE_NAME}:${IMAGE_TAG} ${fullImage}"
//           bat "docker push ${fullImage}"
//         }
//       }
//     }
  }

  post {
    always {
      cleanWs()
    }
  }
}
