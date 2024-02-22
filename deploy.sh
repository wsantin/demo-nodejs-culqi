#!/bin/bash

APP_NAME="demo-culqi"
AWS_REGION="us-east-1"
AWS_ACCOUNT_ID="xxxxxxx"
IMAGE_TAG="latest"
REPO_URI ="public.ecr.aws/d5d5p5r5/demo-demo-culqi"

echo "Create image docker.."
docker build -t ${APP_NAME}:${IMAGE_TAG} .

echo "Authentication AWS ECR..."#
aws ecr-public get-login-password --region ${AWS_REGION} | docker login --username AWS --password-stdin public.ecr.aws

echo "Tag AWS ECR..."#
docker tag demo/demo-culqi:latest <${REPO_URI}>:latest

echo "Deploying application in Kubernetes..."
kubectl apply -f deployment.yaml

echo "Deployment completed"