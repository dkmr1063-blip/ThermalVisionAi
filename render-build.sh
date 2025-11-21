#!/bin/bash
set -e

# Install Node dependencies
npm install

# Build the React app
npm run build

# Install Python dependencies
pip install --upgrade pip
pip install -r requirements.txt

echo "Build completed successfully!"
