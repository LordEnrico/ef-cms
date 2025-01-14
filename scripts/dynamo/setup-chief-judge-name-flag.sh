#!/bin/bash

# Creates and sets the deploy table value for the name of the chief judge

# Usage
#   ENV=dev ./setup-chief-judge-name-flag.sh

./check-env-variables.sh \
  "ENV" \
  "AWS_SECRET_ACCESS_KEY" \
  "AWS_ACCESS_KEY_ID"

ITEM=$(cat <<-END
{
    "pk": {
        "S": "chief-judge-name"
    },
    "sk":{
        "S": "chief-judge-name"
    },
    "current": {
        "S": "Maurice B. Foley"
    }
}
END
)

aws dynamodb put-item \
    --region us-east-1 \
    --table-name "efcms-deploy-${ENV}" \
    --item "${ITEM}"
