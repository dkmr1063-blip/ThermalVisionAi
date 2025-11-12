"""
Test script to verify the thermal detection system is working correctly.
Run this after starting the Flask server to test detection capabilities.
"""

import requests
import base64
import json
import sys
from pathlib import Path

def test_server():
    """Test if Flask server is running"""
    try:
        response = requests.get('http://localhost:5000/health', timeout=5)
        data = response.json()
        print("✓ Server is running")
        print(f"  Status: {data.get('status')}")
        print(f"  Model loaded: {data.get('model_loaded')}")
        print(f"  Model mode: {data.get('model_mode')}")
        return True
    except requests.exceptions.ConnectionError:
        print("✗ Cannot connect to server at http://localhost:5000")
        print("  Make sure you've run: python server.py")
        return False
    except Exception as e:
        print(f"✗ Server test failed: {e}")
        return False

def test_model_info():
    """Get model information"""
    try:
        response = requests.get('http://localhost:5000/model-info', timeout=5)
        data = response.json()
        print("✓ Model information retrieved")
        print(f"  Mode: {data.get('mode')}")
        print(f"  Path: {data.get('model_path')}")
        print(f"  Ultralytics available: {data.get('has_ultralytics_model')}")
        return True
    except Exception as e:
        print(f"✗ Model info test failed: {e}")
        return False

def test_detection():
    """Test detection with a sample thermal image"""
    # Create a simple test image (gradient image)
    try:
        import cv2
        import numpy as np
        
        # Create a simple grayscale gradient image
        print("\n→ Creating test thermal image...")
        img = np.zeros((480, 640, 3), dtype=np.uint8)
        
        # Add some gradients to simulate thermal data
        for i in range(480):
            img[i, :] = int(255 * i / 480)
        
        # Add a bright spot (simulated hot object)
        cv2.circle(img, (320, 240), 50, (255, 255, 255), -1)
        cv2.circle(img, (150, 100), 30, (200, 200, 200), -1)
        
        # Convert to grayscale
        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        
        # Save temporarily
        test_image_path = Path('test_thermal.png')
        cv2.imwrite(str(test_image_path), gray)
        
        print(f"✓ Test image created: {test_image_path}")
        
        # Send to detection endpoint
        print("→ Sending image to detection server...")
        with open(test_image_path, 'rb') as f:
            files = {'image': f}
            response = requests.post('http://localhost:5000/detect', 
                                   files=files, timeout=30)
        
        if response.status_code == 200:
            data = response.json()
            print("✓ Detection successful!")
            print(f"  Objects detected: {data.get('detection_count', 0)}")
            print(f"  Model mode: {data.get('model_mode')}")
            
            if data.get('detections'):
                print("  Detections:")
                for det in data['detections']:
                    print(f"    - {det['label']}: {det['confidence']:.1%} confidence")
            else:
                print("  No objects detected in test image (this is OK)")
            
            # Clean up
            test_image_path.unlink()
            return True
        else:
            print(f"✗ Detection failed with status {response.status_code}")
            try:
                error = response.json()
                print(f"  Error: {error.get('error', 'Unknown error')}")
            except:
                print(f"  Response: {response.text}")
            test_image_path.unlink()
            return False
            
    except ImportError:
        print("⚠ OpenCV not installed, skipping detection test")
        print("  Run: pip install opencv-python")
        return None
    except Exception as e:
        print(f"✗ Detection test failed: {e}")
        import traceback
        traceback.print_exc()
        return False

def main():
    print("=" * 50)
    print("Thermal Detection System - Test Suite")
    print("=" * 50)
    
    tests = [
        ("Server Connectivity", test_server),
        ("Model Information", test_model_info),
        ("Detection Capability", test_detection),
    ]
    
    results = {}
    for name, test_func in tests:
        print(f"\n[Testing] {name}")
        print("-" * 50)
        try:
            results[name] = test_func()
        except Exception as e:
            print(f"✗ Unexpected error: {e}")
            results[name] = False
    
    print("\n" + "=" * 50)
    print("Test Summary")
    print("=" * 50)
    
    for name, result in results.items():
        status = "✓ PASS" if result else ("? SKIP" if result is None else "✗ FAIL")
        print(f"{status}: {name}")
    
    passed = sum(1 for r in results.values() if r is True)
    total = len(results)
    
    print(f"\nResult: {passed}/{total} tests passed")
    
    if passed == total:
        print("\n🎉 All systems operational! You're ready to use the detection app.")
        return 0
    else:
        print("\n⚠ Some tests failed. Check the errors above.")
        return 1

if __name__ == '__main__':
    sys.exit(main())
