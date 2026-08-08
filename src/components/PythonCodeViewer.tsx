import React, { useState } from 'react';
import { Copy, Check, Download, FileCode, FolderTree, BookOpen, Layers, Terminal } from 'lucide-react';
import { generatePythonScript, REQUIREMENTS_TXT, OPENCV_DEEPFACE_ALTERNATIVE_SCRIPT, FOLDER_STRUCTURE_TEXT } from '../data/pythonScriptTemplates';
import { PythonConfig } from '../types';

interface PythonCodeViewerProps {
  config: PythonConfig;
}

export const PythonCodeViewer: React.FC<PythonCodeViewerProps> = ({ config }) => {
  const [activeTab, setActiveTab] = useState<'main' | 'requirements' | 'alternative' | 'structure'>('main');
  const [copied, setCopied] = useState<boolean>(false);

  const mainScript = generatePythonScript(config);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = (filename: string, content: string) => {
    const element = document.createElement('a');
    const file = new Blob([content], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = filename;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const currentContent =
    activeTab === 'main'
      ? mainScript
      : activeTab === 'requirements'
      ? REQUIREMENTS_TXT
      : activeTab === 'alternative'
      ? OPENCV_DEEPFACE_ALTERNATIVE_SCRIPT
      : FOLDER_STRUCTURE_TEXT;

  const currentFilename =
    activeTab === 'main'
      ? 'face_recognition_app.py'
      : activeTab === 'requirements'
      ? 'requirements.txt'
      : activeTab === 'alternative'
      ? 'deepface_app.py'
      : 'folder_structure.txt';

  return (
    <div className="space-y-6">
      
      {/* Code Header and Sub-tabs */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        
        {/* Navigation file tabs */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setActiveTab('main')}
            className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition ${
              activeTab === 'main'
                ? 'bg-emerald-500 text-slate-950 font-bold shadow-sm'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <FileCode className="w-3.5 h-3.5" />
            <span>face_recognition_app.py</span>
          </button>

          <button
            onClick={() => setActiveTab('requirements')}
            className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition ${
              activeTab === 'requirements'
                ? 'bg-emerald-500 text-slate-950 font-bold shadow-sm'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>requirements.txt</span>
          </button>

          <button
            onClick={() => setActiveTab('alternative')}
            className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition ${
              activeTab === 'alternative'
                ? 'bg-sky-500 text-slate-950 font-bold shadow-sm'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>deepface_alt.py</span>
          </button>

          <button
            onClick={() => setActiveTab('structure')}
            className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition ${
              activeTab === 'structure'
                ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <FolderTree className="w-3.5 h-3.5" />
            <span>Folder Tree</span>
          </button>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-2 shrink-0">
          <button
            onClick={() => handleCopy(currentContent)}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-medium transition"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied!' : 'Copy Code'}</span>
          </button>

          <button
            onClick={() => handleDownload(currentFilename, currentContent)}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-slate-950 text-xs font-bold transition shadow-md shadow-emerald-950/50"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download File</span>
          </button>
        </div>

      </div>

      {/* Code Display Frame */}
      <div className="bg-slate-950 border border-slate-800 rounded-xl overflow-hidden shadow-2xl">
        <div className="bg-slate-900/90 px-4 py-2 border-b border-slate-800 flex items-center justify-between text-xs text-slate-400 font-mono">
          <div className="flex items-center space-x-2">
            <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block"></span>
            <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block"></span>
            <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block"></span>
            <span className="ml-2">{currentFilename}</span>
          </div>
          <span>Python 3.8+ Compatible</span>
        </div>

        <pre className="p-4 text-xs font-mono text-slate-200 overflow-x-auto leading-relaxed max-h-[600px] scrollbar-thin">
          <code>{currentContent}</code>
        </pre>
      </div>

      {/* Step-by-Step Computer Vision Logic Explanation */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
        <div className="flex items-center space-x-2 text-emerald-400">
          <BookOpen className="w-5 h-5" />
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">
            Senior Engineering Architecture & Breakdown
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-300">
          
          <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 space-y-1.5">
            <h4 className="font-bold text-emerald-400">1. Reference Image Facial Encoding (128D)</h4>
            <p className="text-slate-400 leading-relaxed">
              `face_recognition.face_encodings()` passes the reference photo (`my_face.jpg`) into a deep ResNet neural network pre-trained on 3 million faces to compute a 128-dimensional vector embedding representing facial features.
            </p>
          </div>

          <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 space-y-1.5">
            <h4 className="font-bold text-sky-400">2. Frame Downscaling & Skip Optimization</h4>
            <p className="text-slate-400 leading-relaxed">
              Video frame is resized (`downscale_factor = 0.25`) before running detection. Recognition runs every Nth frame (`process_every_n = 2`), maintaining 30+ FPS real-time performance without GPU acceleration.
            </p>
          </div>

          <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 space-y-1.5">
            <h4 className="font-bold text-amber-400">3. Euclidean Vector Distance Matching</h4>
            <p className="text-slate-400 leading-relaxed">
              Computes L2 Euclidean distance d(u,v) = &radic;&sum;(u_i - v_i)&sup2; between live face vector and reference face. Distance &le; threshold (0.60) denotes a verified match.
            </p>
          </div>

          <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 space-y-1.5">
            <h4 className="font-bold text-indigo-400">4. OpenCV Real-time HUD Rendering</h4>
            <p className="text-slate-400 leading-relaxed">
              Draws Green bounding boxes for `MATCHED` and Red for `NOT MATCHED`, overlaying distance value, confidence percentage score, and top-left FPS telemetry banner in OpenCV (`cv2.rectangle`, `cv2.putText`).
            </p>
          </div>

        </div>
      </div>

    </div>
  );
};
