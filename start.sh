#!/bin/bash

# Cariton Hotel - Quick Start Script
# This script helps you view the website locally

echo "========================================="
echo "  Cariton Hotel Website - Quick Start"
echo "========================================="
echo ""

# Check if we're in the right directory
if [ ! -f "index.html" ]; then
    echo "Error: Please run this script from the caritonhotel directory"
    exit 1
fi

echo "Starting local web server..."
echo ""
echo "The website will be available at:"
echo "  http://localhost:8000"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""
echo "Opening website in your default browser..."
echo ""

# Open the website in default browser
sleep 2
open http://localhost:8000

# Start Python HTTP server
python3 -m http.server 8000
