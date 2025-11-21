"""
WSGI entry point for Gunicorn on Render
This file is used by Gunicorn to start the Flask app
"""

import os
import sys

# Add current directory to path
sys.path.insert(0, os.path.dirname(__file__))

# Import the Flask app
from server import app

if __name__ == '__main__':
    app.run()
