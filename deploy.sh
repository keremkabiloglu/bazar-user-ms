#!/bin/bash



# Define variables
DOCKER_IMAGE_NAME="user-service"
K8S_DEPLOYMENT_FILE="user-service.yaml"

# Remove existing Docker image
echo "Removing existing Docker image"
docker rmi -f $(docker images -q $DOCKER_IMAGE_NAME)

# Build Docker image
echo "Building Docker image"
docker buildx build -t $DOCKER_IMAGE_NAME --platform linux/arm64 --load . 

# Save Docker image to tar file
echo "Saving Docker image to tar file"
docker save -o $DOCKER_IMAGE_NAME.tar $DOCKER_IMAGE_NAME

# Remove existing image from k8s
echo "Removing existing Docker image from k8s"
microk8s ctr images remove docker.io/library/$DOCKER_IMAGE_NAME:latest

# Transfer tar file to k8s node
echo "Transferring Docker image to k8s"
multipass transfer $DOCKER_IMAGE_NAME.tar microk8s-vm:/tmp/$DOCKER_IMAGE_NAME.tar

# Load tar file to k8s
echo "Loading Docker image to k8s"
microk8s ctr images import /tmp/$DOCKER_IMAGE_NAME.tar



# Remove tar file from k8s node
echo "Removing tar file from k8s node"
multipass exec microk8s-vm -- rm /tmp/$DOCKER_IMAGE_NAME.tar

# Remove tar file from local
echo "Removing tar file from local"
rm $DOCKER_IMAGE_NAME.tar

# Create Kubernetes secret
echo "Creating Kubernetes secret"
microk8s kubectl delete secret $DOCKER_IMAGE_NAME-secret --ignore-not-found
microk8s kubectl create secret generic $DOCKER_IMAGE_NAME-secret --from-env-file=.env-deployment

# Remove existing Kubernetes deployment and service
echo "Removing existing Kubernetes deployment and service"
microk8s kubectl delete deployment $DOCKER_IMAGE_NAME --ignore-not-found

# Apply Kubernetes deployment and service configurations
echo "Applying Kubernetes deployment and service configurations"
microk8s kubectl apply -f $K8S_DEPLOYMENT_FILE


# Show Kubernetes pods status
echo "Pods status:"
microk8s kubectl get pods

echo "Deployment completed."
