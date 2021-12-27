#!/bin/bash -e

tf_version=$(terraform --version)

if [[ ${tf_version} != *"1.0.11"* ]]; then
  echo "Please set your terraform version to 1.0.11 before deploying."
  exit 1
fi