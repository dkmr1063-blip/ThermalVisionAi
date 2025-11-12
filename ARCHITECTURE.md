# System Architecture & Data Flow

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    USER COMPUTER (Windows)                  │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐   │
│  │          WEB BROWSER (Chrome/Edge/Firefox)           │   │
│  │  ┌────────────────────────────────────────────────┐  │   │
│  │  │  Vite Development Server (Port 5173)           │  │   │
│  │  │                                                │  │   │
│  │  │  React Application                             │  │   │
│  │  │  ├── Navigation                                │  │   │
│  │  │  ├── Login / Auth Page                         │  │   │
│  │  │  ├── Detect Page (Image Upload)                │  │   │
│  │  │  └── Display Results                           │  │   │
│  │  │                                                │  │   │
│  │  │  [IMAGE UPLOAD] ────→ Flask Backend            │  │   │
│  │  │                          (localhost:5000)      │  │   │
│  │  │                       ↓                        │  │   │
│  │  │  [SHOW INPUT IMAGE] ← Returns JSON             │  │   │
│  │  │  [SHOW OUTPUT + DETECTIONS]                    │  │   │
│  │  └────────────────────────────────────────────────┘  │   │
│  └──────────────────────────────────────────────────────┘   │
│                          ↓ HTTP                              │
│  ┌──────────────────────────────────────────────────────┐   │
│  │   Flask Backend Server (Port 5000)                   │   │
│  │                                                      │   │
│  │   server.py                                         │   │
│  │   ├── /health - Server status check                 │   │
│  │   ├── /model-info - Model info                      │   │
│  │   └── /detect - Main detection endpoint             │   │
│  │                                                      │   │
│  │   POST /detect Process:                             │   │
│  │   1. Receive image file                             │   │
│  │   2. Decode from upload                             │   │
│  │   3. Preprocess (CLAHE enhancement)                 │   │
│  │   4. Run YOLO model inference                       │   │
│  │   5. Draw bounding boxes                            │   │
│  │   6. Return images + detections (JSON)              │   │
│  │                                                      │   │
│  └──────────────────────────────────────────────────────┘   │
│          ↓ Image Processing & ML Inference                  │
│  ┌──────────────────────────────────────────────────────┐   │
│  │          Model & Processing Components              │   │
│  │                                                      │   │
│  │  model.py (ModelWrapper)                            │   │
│  │  ├── Load best.pt (YOLO weights)                    │   │
│  │  └── predict(image) → [detections]                  │   │
│  │                                                      │   │
│  │  Image Processing (server.py)                       │   │
│  │  ├── cv2.imread() - Load image                      │   │
│  │  ├── CLAHE - Enhance thermal contrast               │   │
│  │  ├── Model inference                                │   │
│  │  ├── cv2.rectangle() - Draw boxes                   │   │
│  │  └── cv2.putText() - Add labels                     │   │
│  │                                                      │   │
│  │  YOLO11 Model (best.pt - 100MB+)                    │   │
│  │  └── Detects: Person, Car, Bicycle, Vehicle        │   │
│  │                                                      │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐   │
│  │              File System                             │   │
│  │  ├── best.pt (model weights)                         │   │
│  │  ├── model.py (wrapper)                              │   │
│  │  ├── server.py (Flask app)                           │   │
│  │  ├── requirements.txt (dependencies)                 │   │
│  │  └── src/pages/Detect.tsx (UI)                       │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

## 📊 Request/Response Flow

### Upload & Detection Flow:

```
1. USER INTERACTION
   ┌─────────────────┐
   │  User selects   │
   │ thermal image   │
   └────────┬────────┘
            │
            ▼
   ┌─────────────────────────────┐
   │ Image displayed in browser  │
   │ (base64 data URL)           │
   └────────┬────────────────────┘
            │
            │ Click "Run Detection"
            ▼
2. UPLOAD REQUEST
   ┌────────────────────────────────────┐
   │ Browser sends FormData:            │
   │ POST /detect                       │
   │ Content-Type: multipart/form-data  │
   │ Body: {image: File object}         │
   └────────┬───────────────────────────┘
            │
            │ HTTP POST to localhost:5000
            ▼
3. FLASK BACKEND PROCESSING
   ┌──────────────────────────────────┐
   │ 1. Decode image from FormData    │ ─── numpy.frombuffer()
   │                                  │
   │ 2. Validate image                │ ─── cv2.imdecode()
   │                                  │
   │ 3. Preprocess thermal image      │ ─── Grayscale + CLAHE
   │                                  │
   │ 4. Model inference               │ ─── YOLO.predict()
   │    → [detections]                │     Returns boxes/confidence
   │                                  │
   │ 5. Draw bounding boxes           │ ─── cv2.rectangle()
   │                                  │     cv2.putText()
   │                                  │
   │ 6. Encode to base64              │ ─── cv2.imencode()
   │    Input image                   │     base64.b64encode()
   │    Output image                  │
   └──────────────────┬───────────────┘
                      │
                      ▼
4. RESPONSE (JSON)
   ┌────────────────────────────────────────┐
   │ HTTP 200 OK                            │
   │ Content-Type: application/json         │
   │                                        │
   │ {                                      │
   │   "success": true,                     │
   │   "input_image": "data:image/png;...  │
   │   "output_image": "data:image/png;... │
   │   "detections": [                      │
   │     {                                  │
   │       "label": "Person",               │
   │       "confidence": 0.95,              │
   │       "bbox": {                        │
   │         "x": 25.5,                     │
   │         "y": 30.2,                     │
   │         "width": 40.1,                 │
   │         "height": 35.8                 │
   │       },                               │
   │       "temperature": "hot"             │
   │     }                                  │
   │   ],                                   │
   │   "detection_count": 1,                │
   │   "model_mode": "yolo"                 │
   │ }                                      │
   └──────────────┬───────────────────────┘
                  │
                  │ HTTP Response (JSON)
                  ▼
5. FRONTEND PROCESSING
   ┌────────────────────────────────┐
   │ React component receives JSON  │
   │                                │
   │ 1. Parse response              │
   │                                │
   │ 2. Set image state             │
   │    - Input image (left)        │
   │    - Output image (bottom)     │
   │                                │
   │ 3. Set detections state        │
   │                                │
   │ 4. Re-render UI                │
   └────────────┬───────────────────┘
                │
                ▼
6. USER SEES RESULTS
   ┌─────────────────────────────────┐
   │ ┌─────────────┐ ┌─────────────┐ │
   │ │ Input Image │ │ Detections  │ │
   │ │             │ │             │ │
   │ │ (Thermal)   │ │ ✓ Person    │ │
   │ │             │ │   95.3%     │ │
   │ │             │ │ ✓ Car       │ │
   │ │             │ │   87.6%     │ │
   │ └─────────────┘ └─────────────┘ │
   │ ┌──────────────────────────────┐ │
   │ │ Output Image                 │ │
   │ │ (With green bounding boxes)  │ │
   │ │                              │ │
   │ └──────────────────────────────┘ │
   └─────────────────────────────────┘
```

## 🔄 Data Processing Pipeline

### Image Processing Steps:

```
INPUT IMAGE (File Upload)
    ↓
[1] DECODE
    ├── Read from FormData
    └── Convert to numpy array (BGR)
    ↓
[2] FORMAT
    ├── Ensure 3-channel image
    └── Shape: (height, width, 3)
    ↓
[3] PREPROCESS (Thermal-Aware)
    ├── Convert to grayscale
    ├── Apply CLAHE (Contrast Limited AHE)
    │  └── clipLimit=3.0, tileGridSize=(8,8)
    ├── Enhance local contrast
    └── Convert back to 3-channel
    ↓
[4] MODEL INFERENCE (YOLO11)
    ├── Resize to 640×640
    ├── Normalize pixel values
    ├── Run neural network
    └── Get predictions
    ↓
[5] POST-PROCESS
    ├── Extract bounding boxes
    ├── Filter by confidence (0.25+)
    ├── Convert to image coordinates
    └── Round to pixel values
    ↓
[6] VISUALIZATION
    ├── Draw rectangles (green boxes)
    ├── Add text labels
    ├── Add confidence scores
    └── Create output image
    ↓
[7] ENCODE
    ├── Compress with PNG encoder
    └── Base64 encode for transmission
    ↓
OUTPUT
    ├── Input image (base64)
    ├── Output image (base64)
    └── Detections (JSON array)
```

## 📈 Performance Characteristics

```
Single Image Processing Timeline:
═════════════════════════════════

0ms  ┌─ Request received
     │
50ms ├─ Image decoded & validated
     │
100ms├─ Image preprocessing (CLAHE)
     │
1500ms├─ YOLO model inference
     │
1600ms├─ Draw bounding boxes
     │
1700ms├─ Encode output images
     │
2000ms├─ JSON serialization
     │
2100ms└─ Response sent to browser
     │
 TOTAL: ~2-3 seconds per image


Concurrent Requests:
═══════════════════
Request 1: ├─────────── (processing)
Request 2:              ├─────────── (processing)
Request 3:                          ├─────────── (processing)

Flask handles requests sequentially (default)
For parallel processing, use production server (Gunicorn with workers)
```

## 🎯 Detection Classes

```
YOLO Model Classes (5 total):
═════════════════════════════

0 ► Person
    └─ Detects humans in thermal images
    └─ Class weight: standard

1 ► Car
    └─ Detects vehicles (cars, trucks)
    └─ Class weight: standard

2 ► Bicycle
    └─ Detects bicycles and motorcycles
    └─ Class weight: standard

3 ► OtherVehicle
    └─ Detects other motorized transport
    └─ Class weight: standard

4 ► DontCare
    └─ Filtered out (not shown to user)
    └─ Represents background/noise
```

## 🔌 API Endpoints Detail

### Endpoint 1: POST /detect

```
REQUEST:
────────
Method: POST
URL: http://localhost:5000/detect
Content-Type: multipart/form-data

Body:
{
  image: <File object or FormData>
}

RESPONSE:
─────────
Status: 200 OK
Content-Type: application/json

{
  "success": true,
  "input_image": "data:image/png;base64,...",
  "output_image": "data:image/png;base64,...",
  "detections": [
    {
      "label": "Person",
      "confidence": 0.95,
      "bbox": {
        "x": 25.5,       # % of image width
        "y": 30.2,       # % of image height
        "width": 40.1,   # % of image width
        "height": 35.8   # % of image height
      },
      "temperature": "hot"
    },
    ...more detections...
  ],
  "detection_count": 3,
  "model_mode": "yolo"
}
```

### Endpoint 2: GET /health

```
REQUEST:
────────
Method: GET
URL: http://localhost:5000/health

RESPONSE:
─────────
Status: 200 OK
Content-Type: application/json

{
  "status": "ok",
  "model_loaded": true,
  "model_mode": "yolo"
}
```

### Endpoint 3: GET /model-info

```
REQUEST:
────────
Method: GET
URL: http://localhost:5000/model-info

RESPONSE:
─────────
Status: 200 OK
Content-Type: application/json

{
  "mode": "yolo",
  "model_path": "C:\\path\\to\\best.pt",
  "has_ultralytics_model": true
}
```

## 🚀 Startup Sequence

```
START COMMAND: python server.py
     ↓
[1] Import modules
    ├── Flask
    ├── CORS
    ├── OpenCV (cv2)
    ├── NumPy
    └── ModelWrapper
    ↓
[2] Initialize Flask app
    ├── Create app instance
    ├── Enable CORS
    └── Register routes
    ↓
[3] Load YOLO model (on first request)
    ├── Check for best.pt
    ├── Load with Ultralytics
    ├── Move to CPU mode
    └── Ready for inference
    ↓
[4] Start Flask dev server
    ├── Host: 127.0.0.1
    ├── Port: 5000
    ├── Debug: True
    └── Auto-reload: Enabled
    ↓
[5] Server ready
    ├── Health check: GET /health
    ├── Model info: GET /model-info
    └── Detection: POST /detect

Status: ✓ Running and waiting for requests
```

## 🔐 Error Handling

```
Error Scenarios:
════════════════

1. Server not running
   └─ Browser error: "Failed to connect to server"
   └─ Solution: python server.py

2. No image uploaded
   └─ HTTP 400: "No image provided"
   └─ Solution: Select and upload image

3. Invalid image format
   └─ HTTP 400: "Failed to decode image"
   └─ Solution: Use PNG, JPG, TIFF, etc.

4. Model not loaded
   └─ HTTP 500: "Model not initialized"
   └─ Solution: Check best.pt exists

5. Out of memory
   └─ HTTP 500: "Model error"
   └─ Solution: Close apps, restart server

6. Port already in use
   └─ Error: "Address already in use"
   └─ Solution: Change port or kill process
```

---

**Diagram Version**: 1.0  
**Last Updated**: November 13, 2025
