# Real-Time Face Recognition Studio 📸 Python Computer Vision & React Web Suite

A production-ready computer vision project for real-time face recognition using Python (`OpenCV`, `dlib`, `face_recognition`), featuring a live browser webcam simulator, real-time threshold tuning, event logging, and full code export.

![Python](https://img.shields.io/badge/Python-3.8%2B-blue?logo=python)
![OpenCV](https://img.shields.io/badge/OpenCV-4.8%2B-green?logo=opencv)
![React](https://img.shields.io/badge/React-19-blue?logo=react)
![TailwindCSS](https://img.shields.io/badge/Tailwind-v4-38bdf8?logo=tailwindcss)

---

## 🌟 Key Features

1. **Real-Time Video Face Detection & Recognition**: Detects faces from webcam feeds using HOG / CNN models.
2. **128-Dimensional Deep Embeddings**: Extracts face encoding vectors and calculates Euclidean distances $d(u,v) = \sqrt{\sum (u_i - v_i)^2}$.
3. **Live Match / Non-Match HUD**: Overlays color-coded bounding boxes, distance scores, and similarity confidence percentages on the video feed.
4. **Interactive Parameter Tuning**: Tune match threshold distance (default `0.60`), downscale ratio (`0.25x`), and frame skip intervals dynamically.
5. **Multi-Face Strategy**: Choose between tracking the largest main face or evaluating all faces in frame.
6. **Match Event Audit Logging**: Logs verified matches with timestamps, distances, and confidence scores to `logs/match_history.csv` along with cropped face snapshot images.
7. **Audio Alert System**: Plays an audio chime when a match is verified.
8. **Dual Runtime**: Run as a standalone Python CLI app or explore interactively via the React web simulator.

---

## 📁 Repository Folder Structure

```text
face-recognition-studio/
│
├── face_recognition_app.py   # Main Python real-time face recognition script
├── my_face.jpg               # Target reference face photo (replace with your photo!)
├── requirements.txt          # Python dependencies
├── README.md                 # Complete documentation & quickstart guide
│
├── logs/                     # Auto-generated match logs & cropped snapshots
│   ├── match_history.csv
│   └── match_YYYYMMDD_HHMMSS.jpg
│
├── src/                      # React Web Studio Simulator
│   ├── App.tsx
│   ├── components/
│   │   ├── LiveWebcamSimulator.tsx
│   │   ├── PythonCodeViewer.tsx
│   │   ├── ScriptConfigurator.tsx
│   │   ├── SetupGuide.tsx
│   │   └── ReferenceTester.tsx
│   ├── data/
│   │   └── pythonScriptTemplates.ts
│   └── types.ts
│
├── package.json
└── vite.config.ts
```

---

## 🚀 Quickstart: Running the Python Script Locally

### 1. Clone the Repository
```bash
git clone https://github.com/YOUR_USERNAME/face-recognition-studio.git
cd face-recognition-studio
```

### 2. Create a Virtual Environment
```bash
# Create virtual environment
python -m venv venv

# Activate on Windows
venv\Scripts\activate

# Activate on macOS / Linux
source venv/bin/activate
```

### 3. Install Python Dependencies
```bash
pip install --upgrade pip setuptools wheel
pip install cmake
pip install dlib
pip install face_recognition opencv-python numpy
```

> **Note**: If `pip install dlib` fails on Windows, install [Visual Studio Community](https://visualstudio.microsoft.com/) with the **"Desktop development with C++"** workload selected.

### 4. Prepare Your Reference Face Photo
Add your photo named `my_face.jpg` in the project root directory.

### 5. Launch Real-Time Face Recognition
```bash
# Basic run
python face_recognition_app.py

# Custom parameters
python face_recognition_app.py --reference my_face.jpg --threshold 0.60 --camera 0
```

---

## 🛠️ Running the Web Studio Interface

To run the interactive React & Vite web simulator locally:

```bash
# Install Node dependencies
npm install

# Start local dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📜 CLI Arguments Reference

| Argument | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `--reference` | `str` | `my_face.jpg` | Path to the target reference face image |
| `--threshold` | `float` | `0.60` | Euclidean distance tolerance (lower = stricter match) |
| `--camera` | `int` | `0` | Webcam device index |

---

## 🛠 Troubleshooting Matrix

- **Windows C++ Compiler Error**: Install CMake and MSVC Build Tools via Visual Studio Installer.
- **macOS (M1/M2/M3 Apple Silicon)**: Run `brew install cmake dlib` via Homebrew before `pip install face_recognition`.
- **Linux (Ubuntu/Debian)**: Run `sudo apt install build-essential cmake libx11-dev libatlas-base-dev`.

---

## 📄 License
Apache License 2.0
