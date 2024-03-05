#!/bin/bash



# Define variables
DOCKER_IMAGE_NAME="user-service"

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
multipass exec microk8s-vm -- microk8s ctr images remove docker.io/library/$DOCKER_IMAGE_NAME:latest

# Transfer files to multipass node
echo "Transferring files to multipass node"
multipass exec microk8s-vm -- mkdir -p /tmp/$DOCKER_IMAGE_NAME
multipass transfer $DOCKER_IMAGE_NAME.tar microk8s-vm:/tmp/$DOCKER_IMAGE_NAME/$DOCKER_IMAGE_NAME.tar
multipass transfer $DOCKER_IMAGE_NAME.yaml microk8s-vm:/tmp/$DOCKER_IMAGE_NAME/$DOCKER_IMAGE_NAME.yaml
multipass transfer .env-deployment microk8s-vm:/tmp/$DOCKER_IMAGE_NAME/.env-deployment

# Load tar file to k8s
echo "Loading Docker image to k8s"
multipass exec microk8s-vm -- microk8s ctr images import /tmp/$DOCKER_IMAGE_NAME/$DOCKER_IMAGE_NAME.tar

# Remove tar file from local
echo "Removing tar file from local"
rm $DOCKER_IMAGE_NAME.tar

# Create Kubernetes secret
echo "Creating Kubernetes secret"
multipass exec microk8s-vm -- microk8s kubectl delete secret $DOCKER_IMAGE_NAME-secret --ignore-not-found
multipass exec microk8s-vm -- microk8s kubectl create secret generic $DOCKER_IMAGE_NAME-secret --from-env-file=/tmp/$DOCKER_IMAGE_NAME/.env-deployment

# Remove existing Kubernetes deployment and service
echo "Removing existing Kubernetes deployment and service"
multipass exec microk8s-vm -- microk8s kubectl delete deployment $DOCKER_IMAGE_NAME --ignore-not-found

# Apply Kubernetes deployment and service configurations
echo "Applying Kubernetes deployment and service configurations"
multipass exec microk8s-vm -- microk8s kubectl apply -f /tmp/$DOCKER_IMAGE_NAME/$DOCKER_IMAGE_NAME.yaml

# Show Kubernetes pods status
echo "Pods status:"
multipass exec microk8s-vm -- microk8s kubectl get pods

# Delete tmp folder
echo "Deleting tmp folder"
#multipass exec microk8s-vm -- rm -rf /tmp/$DOCKER_IMAGE_NAME

echo "Deployment completed."
