#!/bin/bash

./mvnw clean package -DskipTests

docker build -t ecommerce-backend .

docker tag ecommerce-backend us-central1-docker.pkg.dev/ecommerce-backend-461805/ecommerce-repo/ecommerce

docker push us-central1-docker.pkg.dev/ecommerce-backend-461805/ecommerce-repo/ecommerce

gcloud run deploy ecommerce --image=us-central1-docker.pkg.dev/ecommerce-backend-461805/ecommerce-repo/ecommerce --add-cloudsql-instances=ecommerce-backend-461805:us-central1:ecommerce --platform=managed --region=us-central1 --allow-unauthenticated