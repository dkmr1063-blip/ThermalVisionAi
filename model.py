from pathlib import Path
import numpy as np
import cv2
import traceback

try:
    from ultralytics import YOLO
    _HAS_ULTRALYTICS = True
except Exception:
    _HAS_ULTRALYTICS = False


class ModelWrapper:
    """Tries to load a YOLO model (Ultralytics .pt) if present. If not, falls back
    to a simple thermal-blob detector that finds bright regions after CLAHE.

    Methods:
    - predict(image_ndarray) -> list of {label, score, box(x1,y1,x2,y2)}
    """

    def __init__(self, models_dir: Path = Path('models')):
        self.models_dir = Path(models_dir)
        self.model = None
        self.mode = 'stub'
        self._load()

    def _load(self):
        # Search common locations for model files: provided models_dir, cwd, and package dir
        search_paths = [self.models_dir, Path.cwd(), Path(__file__).parent]
        pts = []
        onnxs = []
        for p in search_paths:
            try:
                if p and p.exists():
                    pts += sorted(p.glob('*.pt'))
                    onnxs += sorted(p.glob('*.onnx'))
            except Exception:
                continue

        # Prefer .pt if ultralytics is available
        if pts:
            chosen = pts[-1]
            if _HAS_ULTRALYTICS:
                try:
                    self.model = YOLO(str(chosen))
                    self.mode = 'yolo'
                    self.model_path = Path(chosen)
                    print(f"Loaded Ultralytics YOLO model: {chosen}")
                    return
                except Exception:
                    print('Failed to load ultralytics .pt model:')
                    traceback.print_exc()
            else:
                # ulralytics not installed; store path and notify
                self.model_path = Path(chosen)
                print(f"Found .pt model at {chosen} but 'ultralytics' is not installed. Install it to use the .pt model.")

        # Try ONNX if available and ultralytics can handle it
        if onnxs:
            chosen = onnxs[-1]
            if _HAS_ULTRALYTICS:
                try:
                    self.model = YOLO(str(chosen))
                    self.mode = 'yolo'
                    self.model_path = Path(chosen)
                    print(f"Loaded Ultralytics model from ONNX: {chosen}")
                    return
                except Exception:
                    print('Failed to load ultralytics ONNX model:')
                    traceback.print_exc()
            else:
                # leave for possible onnxruntime support in future
                self.model_path = Path(chosen)
                print(f"Found ONNX model at {chosen} but 'ultralytics' is not installed. Consider installing ultralytics or adding ONNX runtime support.")

        # fallback stub detector
        self.mode = 'blob'
        print('No usable YOLO weights found or ultralytics not available; using blob detector fallback.')

    def predict(self, image: np.ndarray):
        # image expected BGR 3-channel numpy array
        if self.mode == 'yolo' and self.model is not None:
            # Ultralytics model returns results; call with numpy image
            preds = self.model.predict(source=[image], conf=0.25, device='cpu')
            # preds is list with Results for each image
            out = []
            if preds:
                res = preds[0]
                boxes = getattr(res, 'boxes', None)
                if boxes is not None:
                    # boxes.xyxy, boxes.conf, boxes.cls
                    xyxy = boxes.xyxy.cpu().numpy() if hasattr(boxes.xyxy, 'cpu') else boxes.xyxy.numpy()
                    conf = boxes.conf.cpu().numpy() if hasattr(boxes.conf, 'cpu') else boxes.conf.numpy()
                    cls = boxes.cls.cpu().numpy() if hasattr(boxes.cls, 'cpu') else boxes.cls.numpy()
                    for b, c, cl in zip(xyxy, conf, cls):
                        x1, y1, x2, y2 = map(float, b)
                        out.append({'label': str(int(cl)), 'score': float(c), 'box': [x1, y1, x2, y2]})
            return out
        else:
            # simple blob detector: threshold on CLAHE-enhanced grayscale
            gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY) if image.ndim == 3 else image
            clahe = cv2.createCLAHE(clipLimit=3.0, tileGridSize=(8, 8))
            enhanced = clahe.apply(gray)
            # adaptive threshold
            m, s = enhanced.mean(), enhanced.std()
            th = min(240, int(m + max(30, 1.2 * s)))
            _, bw = cv2.threshold(enhanced, th, 255, cv2.THRESH_BINARY)
            # morphological clean
            kernel = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (5,5))
            bw = cv2.morphologyEx(bw, cv2.MORPH_OPEN, kernel, iterations=1)
            contours, _ = cv2.findContours(bw, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
            out = []
            h, w = enhanced.shape[:2]
            for cnt in contours:
                x, y, ww, hh = cv2.boundingRect(cnt)
                area = ww*hh
                if area < 100:  # skip tiny
                    continue
                x1, y1, x2, y2 = x, y, x+ww, y+hh
                score = min(0.99, float(area) / (w*h))
                out.append({'label': 'Person', 'score': float(score), 'box': [x1, y1, x2, y2]})
            return out
