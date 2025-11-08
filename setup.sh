#!/bin/bash

# NutriBot Installation Script
# This script helps set up the NutriBot application

set -e

echo "=========================================="
echo "NutriBot Installation Script"
echo "=========================================="
echo ""

# Check prerequisites
echo "Checking prerequisites..."

# Check Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 14+ from https://nodejs.org/"
    exit 1
fi
echo "✓ Node.js $(node --version) found"

# Check npm
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm"
    exit 1
fi
echo "✓ npm $(npm --version) found"

# Check Python
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is not installed. Please install Python 3.10+"
    exit 1
fi
echo "✓ Python $(python3 --version) found"

# Check pip
if ! command -v pip3 &> /dev/null; then
    echo "❌ pip3 is not installed. Please install pip3"
    exit 1
fi
echo "✓ pip3 found"

echo ""
echo "Installing dependencies..."
echo ""

# Install Node.js dependencies
echo "Installing Node.js dependencies..."
npm install
echo "✓ Node.js dependencies installed"
echo ""

# Install Python dependencies
echo "Installing Python dependencies..."
pip3 install -r requirements.txt || pip3 install --user -r requirements.txt
echo "✓ Python dependencies installed"
echo ""

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "Creating .env file from .env.example..."
    cp .env.example .env
    echo "✓ .env file created"
    echo ""
    echo "⚠️  IMPORTANT: Please edit .env file and update the configuration values!"
    echo "   Especially: DB_PASSWORD, JWT_SECRET"
else
    echo "✓ .env file already exists"
fi

# Create data directory
if [ ! -d data ]; then
    echo "Creating data directory..."
    mkdir -p data
    echo "✓ data directory created"
fi

echo ""
echo "=========================================="
echo "Installation Complete!"
echo "=========================================="
echo ""
echo "Next steps:"
echo "1. Edit .env file with your configuration"
echo "2. Create MySQL database: CREATE DATABASE nutribot;"
echo "3. Start the Node.js server: npm start"
echo "4. Start the Python AI service: python3 app.py"
echo "5. Start the frontend: npm run dev (in a new terminal)"
echo ""
echo "For more information, see README.md"
echo ""
