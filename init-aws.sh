#!/bin/bash

# Initialize DynamoDB table
awslocal dynamodb create-table \
    --table-name berth-scheduling-solutions \
    --attribute-definitions AttributeName=problem_id,AttributeType=S AttributeName=timestamp,AttributeType=S \
    --key-schema AttributeName=problem_id,KeyType=HASH AttributeName=timestamp,KeyType=RANGE \
    --billing-mode PAY_PER_REQUEST \
    --region us-east-1
