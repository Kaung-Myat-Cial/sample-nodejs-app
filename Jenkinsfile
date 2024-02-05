pipeline {
    agent any
    environment {
        AWS_ACCOUNT_ID="085391393117"
        AWS_DEFAULT_REGION="ap-southeast-2"
	    CLUSTER_NAME="Prod-ECS-Cluster-JenkinsASG"
	    SERVICE_NAME="sample-nodejs-web-service"
	    TASK_DEFINITION_NAME="sample-nodejs-webserver-td"
	    DESIRED_COUNT="1"
        IMAGE_REPO_NAME="sample-nodejs-app"
        //Do not edit the variable IMAGE_TAG. It uses the Jenkins job build ID as a tag for the new image.
        IMAGE_TAG="${env.BUILD_ID}"
        //Do not edit REPOSITORY_URI.
        REPOSITORY_URI = "${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_DEFAULT_REGION}.amazonaws.com/${IMAGE_REPO_NAME}"
	    registryCredential = "jenkins-access-to-aws"
	    JOB_NAME = "sample-nodejs-pipeline"
	    TEST_CONTAINER_NAME = "${JOB_NAME}-test-server"
    
}
   
    stages {

    // Building Docker image
    stage('Building image') {
      steps{
        script {
          dockerImage = docker.build "${IMAGE_REPO_NAME}:${IMAGE_TAG}"
        }
      }
     }
    // Run container locally and perform tests
    stage('Running tests') {
      steps{
        sh 'docker run -i --rm --name "${TEST_CONTAINER_NAME}" "${IMAGE_REPO_NAME}:${IMAGE_TAG}" npm test -- --watchAll=false'
      }
    }

    // Uploading Docker image into AWS ECR
    stage('Releasing') {
     steps{  
         script {
			docker.withRegistry("https://" + REPOSITORY_URI, "ecr:${AWS_DEFAULT_REGION}:" + registryCredential) {
                    	dockerImage.push()
            }
         }
       }
     }

    // Update task definition and service running in ECS cluster to deploy
    stage('Deploy') {
     steps{
            withAWS(credentials: registryCredential, region: "${AWS_DEFAULT_REGION}") {
                script {
			sh "chmod +x -R ${env.WORKSPACE}"
			sh './script.sh'
                }
            } 
         }
       }
     }
   // Clear local image registry. Note that all the data that was used to build the image is being cleared.
   // For different use cases, one may not want to clear all this data so it doesn't have to be pulled again for each build.
   post {
       always {
       sh 'docker system prune -a -f'
     }
   }
 }
