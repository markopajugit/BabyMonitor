#!/bin/bash

# Owlet Sync Service Launcher for Linux/Mac
# This script starts the Python Owlet sync service

echo ""
echo "===================================="
echo "Owlet Sync Service Launcher"
echo "===================================="
echo ""

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "ERROR: Python 3 is not installed"
    echo "Please install Python 3.7 or higher"
    exit 1
fi

python3 --version
echo ""
echo "Checking for required packages..."

# Check if required packages are installed
python3 -c "import pyowletapi" 2>/dev/null
if [ $? -ne 0 ]; then
    echo "Installing required packages..."
    pip3 install -r requirements.txt
    if [ $? -ne 0 ]; then
        echo "ERROR: Failed to install required packages"
        exit 1
    fi
fi

echo ""
echo "Starting Owlet Sync Service..."
echo ""
echo "Make sure owlet_config.json is properly configured!"
echo ""
read -p "Press Enter to continue..."

# Start the Python service
python3 owlet_sync.py

# If the script exits, show a message
echo ""
echo "Owlet Sync Service has stopped."

