#!/bin/bash



# Define variables
DOCKER_IMAGE_NAME="user-service"

# Remove existing Docker image
docker rmi -f $(docker images -q $DOCKER_IMAGE_NAME)

#K8S_DEPLOYMENT_FILE="deployment.yaml"

# Build Docker image
docker build -t $DOCKER_IMAGE_NAME .

# Apply Kubernetes deployment and service configurations
#kubectl apply -f $K8S_DEPLOYMENT_FILE

echo "Deployment completed."
