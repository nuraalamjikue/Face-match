import { PythonConfig } from '../types';

export function generatePythonScript(config: PythonConfig): string {
  const {
    referenceImagePath,
    threshold,
    cameraIndex,
    downscaleFactor,
    processEveryNFrames,
    enableSound,
    enableLogging,
    logDir,
    multiFaceMode,
  } = config;

  return `"""
=============================================================================
Real-Time Face Recognition System
Senior Computer Vision Engineering Implementation
Library: face_recognition (dlib backend) + OpenCV (cv2)
=============================================================================
"""

import cv2
import face_recognition
import numpy as np
import os
import time
import csv
from datetime import datetime
import argparse
import sys

# Optional sound feedback module
${enableSound ? `
try:
    import winsound  # Standard on Windows
    def sound_alert():
        winsound.Beep(1000, 150)  # Frequency: 1000Hz, Duration: 150ms
except ImportError:
    def sound_alert():
        sys.stdout.write('\\a')  # Standard terminal bell for Linux/macOS
        sys.stdout.flush()
` : `
def sound_alert():
    pass
`}

class RealTimeFaceRecognizer:
    def __init__(self, reference_path="${referenceImagePath}", threshold=${threshold}, camera_id=${cameraIndex}):
        self.reference_path = reference_path
        self.threshold = threshold
        self.camera_id = camera_id
        self.reference_encoding = None
        self.downscale_factor = ${downscaleFactor}  # Rescale ratio for fast processing
        self.process_every_n = ${processEveryNFrames}     # Process face recognition every N frames
        self.enable_logging = ${enableLogging ? 'True' : 'False'}
        self.log_dir = "${logDir}"
        self.multi_face_mode = "${multiFaceMode}"   # 'main' (largest face) or 'all'

        if self.enable_logging:
            os.makedirs(self.log_dir, exist_ok=True)
            self.csv_path = os.path.join(self.log_dir, "match_history.csv")
            self._init_csv()

        self.last_sound_time = 0
        self.sound_cooldown = 2.0  # seconds between sound alerts

    def _init_csv(self):
        """Initialize CSV log file with headers if it doesn't exist."""
        if not os.path.exists(self.csv_path):
            with open(self.csv_path, mode='w', newline='') as f:
                writer = csv.writer(f)
                writer.writerow(["Timestamp", "Status", "Distance", "Confidence (%)", "Snapshot_File"])

    def load_reference(self):
        """Loads and encodes the target reference face image."""
        print(f"[INFO] Loading reference image from '{self.reference_path}'...")
        if not os.path.exists(self.reference_path):
            raise FileNotFoundError(f"[ERROR] Reference image not found at '{self.reference_path}'! Please check the file path.")

        # Load image with face_recognition (RGB format)
        ref_image = face_recognition.load_image_file(self.reference_path)
        encodings = face_recognition.face_encodings(ref_image)

        if len(encodings) == 0:
            raise ValueError(f"[ERROR] No face detected in reference image '{self.reference_path}'. Please use an image with a clear face.")

        self.reference_encoding = encodings[0]
        print(f"[SUCCESS] Loaded reference face encoding successfully! (Vector size: {len(self.reference_encoding)})")

    def log_match_event(self, status, distance, confidence, frame, face_location):
        """Logs match data to CSV and saves cropped face snapshot."""
        if not self.enable_logging or status != "MATCHED":
            return

        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S_%f")[:-3]
        formatted_time = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

        # Save cropped face snapshot
        top, right, bottom, left = face_location
        # Add padding safely
        h, w, _ = frame.shape
        pad = 20
        top_p = max(0, top - pad)
        bottom_p = min(h, bottom + pad)
        left_p = max(0, left - pad)
        right_p = min(w, right + pad)

        cropped_face = frame[top_p:bottom_p, left_p:right_p]
        snapshot_filename = f"match_{timestamp}.jpg"
        snapshot_path = os.path.join(self.log_dir, snapshot_filename)

        if cropped_face.size > 0:
            cv2.imwrite(snapshot_path, cropped_face)

        # Write to CSV
        with open(self.csv_path, mode='a', newline='') as f:
            writer = csv.writer(f)
            writer.writerow([formatted_time, status, f"{distance:.4f}", f"{confidence:.1f}%", snapshot_filename])

    def run(self):
        """Main real-time loop capturing video stream and processing recognition."""
        self.load_reference()

        print(f"[INFO] Opening webcam device ID {self.camera_id}...")
        cap = cv2.VideoCapture(self.camera_id)

        # Set resolution for performance (640x480)
        cap.set(cv2.CAP_PROP_FRAME_WIDTH, 640)
        cap.set(cv2.CAP_PROP_FRAME_HEIGHT, 480)

        if not cap.isOpened():
            print(f"[ERROR] Could not open webcam (camera_id={self.camera_id}). Check USB connection or camera index.")
            return

        print("\\n" + "="*60)
        print(" REAL-TIME FACE RECOGNITION SYSTEM ONLINE")
        print(f" Threshold: {self.threshold} (lower = stricter match)")
        print(f" Press 'q' or 'ESC' to exit")
        print(f" Press 's' to manually save current frame")
        print("="*60 + "\\n")

        frame_count = 0
        face_locations = []
        face_results = [] # Store tuple: (location, is_match, distance, confidence)
        fps = 0.0
        start_time = time.time()

        while True:
            ret, frame = cap.read()
            if not ret:
                print("[WARN] Failed to grab frame from webcam. Retrying...")
                time.sleep(0.1)
                continue

            frame_count += 1

            # Process every N-th frame to boost real-time FPS
            if frame_count % self.process_every_n == 0:
                # Resize frame for ultra-fast face detection (downscale)
                small_frame = cv2.resize(frame, (0, 0), fx=self.downscale_factor, fy=self.downscale_factor)
                rgb_small_frame = cv2.cvtColor(small_frame, cv2.COLOR_BGR2RGB)

                # Detect face locations in downscaled image (HOG detector is fast)
                small_locations = face_recognition.face_locations(rgb_small_frame, model="hog")
                small_encodings = face_recognition.face_encodings(rgb_small_frame, small_locations)

                face_results = []
                
                if len(small_encodings) > 0:
                    # Filter faces if multi_face_mode is 'main' (largest face area)
                    if self.multi_face_mode == 'main' and len(small_locations) > 1:
                        # Find face with largest bounding box area
                        areas = [(b - t) * (r - l) for (t, r, b, l) in small_locations]
                        max_idx = np.argmax(areas)
                        selected_items = [(small_locations[max_idx], small_encodings[max_idx])]
                    else:
                        selected_items = list(zip(small_locations, small_encodings))

                    for (top, right, bottom, left), face_encoding in selected_items:
                        # Calculate Euclidean distance between encodings
                        distances = face_recognition.face_distance([self.reference_encoding], face_encoding)
                        distance = float(distances[0])
                        is_match = distance <= self.threshold

                        # Calculate confidence percentage
                        # Distance ranges from 0.0 (identical) to ~1.0 (unrelated)
                        # Metric: Confidence % = max(0, 1.0 - (distance / (threshold * 1.5))) * 100
                        if distance < self.threshold:
                            confidence = max(0.0, min(100.0, (1.0 - (distance / (self.threshold * 1.5))) * 100))
                        else:
                            confidence = max(0.0, min(100.0, (1.0 - (distance / 1.0)) * 100))

                        # Scale face locations back up to original frame size
                        scale = int(1 / self.downscale_factor)
                        orig_location = (top * scale, right * scale, bottom * scale, left * scale)

                        face_results.append((orig_location, is_match, distance, confidence))

                        # Sound & logging trigger on match
                        if is_match:
                            current_time = time.time()
                            if current_time - self.last_sound_time > self.sound_cooldown:
                                sound_alert()
                                self.last_sound_time = current_time
                            self.log_match_event("MATCHED", distance, confidence, frame, orig_location)

            # Calculate FPS
            fps_frame_counter = frame_count % 30
            if fps_frame_counter == 0:
                end_time = time.time()
                fps = 30 / (end_time - start_time) if (end_time - start_time) > 0 else 0.0
                start_time = time.time()

            # Render Overlay HUD on original frame
            self.draw_hud(frame, face_results, fps)

            cv2.imshow("Real-Time Face Recognition Studio", frame)

            key = cv2.waitKey(1) & 0xFF
            if key == ord('q') or key == 27:  # 'q' or ESC
                break
            elif key == ord('s'):
                # Manual snapshot save
                snap_name = f"snapshot_{datetime.now().strftime('%Y%m%d_%H%M%S')}.jpg"
                cv2.imwrite(snap_name, frame)
                print(f"[INFO] Frame snapshot saved to '{snap_name}'")

        # Cleanup
        cap.release()
        cv2.destroyAllWindows()
        print("[INFO] Webcam feed stopped. Exiting system cleanly.")


    def draw_hud(self, frame, face_results, fps):
        """Draws bounding boxes, labels, confidence scores, and status HUD."""
        for (top, right, bottom, left), is_match, distance, confidence in face_results:
            # Color palette: BGR format (Green for match, Red for non-match)
            box_color = (0, 220, 100) if is_match else (50, 50, 240)
            text_color = (255, 255, 255)

            # Draw bounding box corner accents for modern look
            thickness = 2
            cv2.rectangle(frame, (left, top), (right, bottom), box_color, thickness)

            # Header text banner
            status_text = "MATCHED" if is_match else "NOT MATCHED"
            label = f"{status_text} | Dist: {distance:.2f} ({confidence:.1f}%)"

            # Draw text banner background
            font = cv2.FONT_HERSHEY_SIMPLEX
            font_scale = 0.55
            font_thick = 2
            (text_w, text_h), baseline = cv2.getTextSize(label, font, font_scale, font_thick)

            banner_top = max(0, top - text_h - 12)
            cv2.rectangle(frame, (left, banner_top), (left + text_w + 12, banner_top + text_h + 10), box_color, cv2.FILLED)
            cv2.putText(frame, label, (left + 6, banner_top + text_h + 4), font, font_scale, text_color, font_thick)

        # Top-Left System Status HUD
        hud_bg = (20, 20, 20)
        cv2.rectangle(frame, (10, 10), (280, 75), hud_bg, cv2.FILLED)
        cv2.rectangle(frame, (10, 10), (280, 75), (80, 80, 80), 1)

        cv2.putText(frame, "REAL-TIME FACE RECOGNITION", (20, 30), cv2.FONT_HERSHEY_SIMPLEX, 0.45, (0, 255, 200), 1)
        cv2.putText(frame, f"FPS: {fps:.1f} | Threshold: {self.threshold:.2f}", (20, 50), cv2.FONT_HERSHEY_SIMPLEX, 0.45, (200, 200, 200), 1)
        cv2.putText(frame, f"Faces Detected: {len(face_results)}", (20, 68), cv2.FONT_HERSHEY_SIMPLEX, 0.45, (200, 200, 200), 1)


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Real-Time Face Recognition in OpenCV & dlib")
    parser.add_argument("--reference", type=str, default="${referenceImagePath}", help="Path to target reference face image")
    parser.add_argument("--threshold", type=float, default=${threshold}, help="Tolerance threshold (default: ${threshold}, lower = stricter)")
    parser.add_argument("--camera", type=int, default=${cameraIndex}, help="Webcam device ID index (default: ${cameraIndex})")

    args = parser.parse_args()

    recognizer = RealTimeFaceRecognizer(
        reference_path=args.reference,
        threshold=args.threshold,
        camera_id=args.camera
    )
    recognizer.run()
`;
}

export const REQUIREMENTS_TXT = `# Core Computer Vision & AI Libraries
opencv-python>=4.8.0.76
face_recognition>=1.3.0
numpy>=1.24.0
dlib>=19.24.0

# Optional for audio / logging enhancements
pillow>=9.5.0
`;

export const OPENCV_DEEPFACE_ALTERNATIVE_SCRIPT = `"""
=============================================================================
Alternative Implementation: Pure OpenCV + DeepFace (No C++ dlib compilation needed!)
Use this script if you encounter dlib/C++ compiler installation issues on Windows/Mac.
=============================================================================
"""

import cv2
from deepface import DeepFace
import os
import time

REFERENCE_PATH = "my_face.jpg"
THRESHOLD = 0.60  # Cosine distance threshold for DeepFace VGG-Face / ArcFace

def main():
    if not os.path.exists(REFERENCE_PATH):
        print(f"[ERROR] Reference image '{REFERENCE_PATH}' not found!")
        return

    print("[INFO] Initializing DeepFace engine & loading reference image...")
    cap = cv2.VideoCapture(0)
    cap.set(cv2.CAP_PROP_FRAME_WIDTH, 640)
    cap.set(cv2.CAP_PROP_FRAME_HEIGHT, 480)

    face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')

    frame_count = 0
    is_match = False
    distance = 1.0

    while True:
        ret, frame = cap.read()
        if not ret:
            break

        frame_count += 1
        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        faces = face_cascade.detectMultiScale(gray, scaleFactor=1.1, minNeighbors=5, minSize=(60, 60))

        # Check face match every 10 frames to preserve 30 FPS
        if len(faces) > 0 and frame_count % 10 == 0:
            try:
                # Compare frame with reference image using ArcFace / VGG-Face model
                result = DeepFace.verify(
                    img1_path=frame,
                    img2_path=REFERENCE_PATH,
                    model_name="VGG-Face",
                    detector_backend="opencv",
                    enforce_detection=False
                )
                distance = result.get('distance', 1.0)
                is_match = distance <= THRESHOLD
            except Exception as e:
                pass

        for (x, y, w, h) in faces:
            color = (0, 255, 0) if is_match else (0, 0, 255)
            status = "MATCHED" if is_match else "NOT MATCHED"
            confidence = max(0.0, (1.0 - distance) * 100)

            cv2.rectangle(frame, (x, y), (x+w, y+h), color, 2)
            cv2.putText(frame, f"{status} | Dist: {distance:.2f} ({confidence:.0f}%)",
                        (x, max(20, y - 10)), cv2.FONT_HERSHEY_SIMPLEX, 0.55, color, 2)

        cv2.imshow("DeepFace Real-Time Recognition", frame)
        if cv2.waitKey(1) & 0xFF == ord('q'):
            break

    cap.release()
    cv2.destroyAllWindows()

if __name__ == "__main__":
    main()
`;

export const FOLDER_STRUCTURE_TEXT = `my_face_recognition_project/
│
├── my_face.jpg            # Target reference photo (replace with your photo!)
├── face_recognition_app.py # Main Python real-time script
├── requirements.txt       # Dependencies
├── README.md              # Documentation & Run instructions
│
└── logs/                  # Auto-generated match logs (CSV + snapshots)
    ├── match_history.csv
    └── match_20260807_120000.jpg
`;
