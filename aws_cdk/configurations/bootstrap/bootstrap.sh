#!/bin/bash
set -x

# Create a custom bootstrap policy for limiting permissions
createBootstrapPolicy() {
  aws iam create-policy \
    --policy-name cdkCfExecutionPolicy \
    --policy-document file://cdkCfExecutionPolicy.json
}

# Create a custom bootstrap policy for limiting permissions
updateBootstrapPolicy() {
  ACCOUNT_ID=$(aws sts get-caller-identity --query "Account" --output text)
  aws iam create-policy-version \
    --policy-arn arn:aws:iam::$ACCOUNT_ID:policy/cdkCfExecutionPolicy \
    --policy-document file://cdkCfExecutionPolicy.json \
    --set-as-default
}

# Bootstrap cdk toolkit with custom CF execution policy
bootstrapAccount() {
  ACCOUNT_ID=$(aws sts get-caller-identity --query "Account" --output text)

  cdk bootstrap \
    aws://$ACCOUNT_ID/eu-central-1 \
    --cloudformation-execution-policies "arn:aws:iam::$ACCOUNT_ID:policy/cdkCfExecutionPolicy"
}

case $1 in
createBootstrapPolicy) createBootstrapPolicy ;;
updateBootstrapPolicy) updateBootstrapPolicy ;;
bootstrapAccount) bootstrapAccount ;;
esac