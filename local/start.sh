#!/bin/bash

# Set up local ENV variables
export PORT="5000"
export NODE_ENV="local"
export DB_HOST="localhost"
export DB_NAME="mydb"
export DB_USER="root"
export DB_PASSWORD="rootpassword"

echo "Local ENV variabes all set up for example $DB_USER, $DB_HOST"

docker-compose build --no-cache && docker-compose up -d
echo "Waiting for about 10 seconds for mysql to boot up"

sleep 10