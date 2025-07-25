pipeline {
  agent any

  tools {
    nodejs 'Node-24' // Assure-toi que tu as ajouté Node.js dans Jenkins → Global Tool Configuration
  }

  environment {
    IMAGE_NAME = "wajihdocker/frontend-kaddem2"
    IMAGE_TAG = "latest"
    DOCKER_REGISTRY = "" // <-- change selon ton DockerHub ou Nexus
    SONAR_TOKEN = credentials('sonar-token')
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




    stage('Build ') {
              steps {
                  bat 'npm install'
                  bat 'npm run build -- --configuration=production'
                  bat 'dir dist\\frontend-kaddem2' // lister le contenu du répertoire
              }
          }

          stage('SonarQube Analysis') {
            steps {
              withSonarQubeEnv('sonarqube_server') {
                bat '''
                  npx sonar-scanner ^
                  -Dsonar.projectKey=frontend-kaddem ^
                  -Dsonar.projectName=Frontend-Kaddem ^
                  -Dsonar.sources=src ^
                  -Dsonar.exclusions=**/*.spec.ts,^**/node_modules/** ^
                  -Dsonar.language=ts ^
                  -Dsonar.sourceEncoding=UTF-8 ^
                  -Dsonar.login=%SONAR_TOKEN%
                '''
              }
            }
          }
stage('Package') {
    steps {
        script {
            FRONTEND_VERSION = "1.0.0.${env.BUILD_NUMBER}"
            ARTIFACT_NAME = "kaddem-frontend-${FRONTEND_VERSION}.zip"

            bat """
                powershell -Command "Compress-Archive -Path dist\\frontend-kaddem2\\* -DestinationPath ${ARTIFACT_NAME}"
                dir ${ARTIFACT_NAME}
            """
        }
    }
}
stage('Upload Front to Nexus') {
    steps {
        script {
            def nexusRawRepoUrl = 'http://localhost:8081/repository/front-devops/'
            def distDir = 'dist\\frontend-kaddem2'
            def credentialsId = 'front-nexus'

            withCredentials([usernamePassword(credentialsId: credentialsId, passwordVariable: 'NEXUS_PASS', usernameVariable: 'NEXUS_USER')]) {
                bat """
                @echo off
                setlocal enabledelayedexpansion

                for /R "${distDir}" %%f in (*) do (
                    set "fullPath=%%f"
                    set "relPath=!fullPath:${distDir}=!"
                    set "relPath=!relPath:\\=/!"
                    curl -u "%NEXUS_USER%:%NEXUS_PASS%" --upload-file "!fullPath!" "${nexusRawRepoUrl}!relPath!"
                )

                endlocal
                """
            }
        }
    }
}









    stage(' Docker Build & Push') {
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
