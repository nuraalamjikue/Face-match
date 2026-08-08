import React, { useState } from 'react';
import { Terminal, Check, Copy, AlertTriangle, ShieldCheck, Cpu, HardDrive } from 'lucide-react';

export const SetupGuide: React.FC = () => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const codeBlocks = [
    {
      title: '1. Create Python Virtual Environment (Recommended)',
      cmd: `python -m venv venv

# Windows (Command Prompt / PowerShell)
venv\\Scripts\\activate

# macOS / Linux
source venv/bin/activate`,
    },
    {
      title: '2. Install Dependencies (dlib + OpenCV + face_recognition)',
      cmd: `pip install --upgrade pip setuptools wheel
pip install cmake
pip install dlib
pip install face_recognition opencv-python numpy`,
    },
    {
      title: '3. Run Real-Time Face Recognition Script',
      cmd: `# Basic execution (uses 'my_face.jpg' in same folder)
python face_recognition_app.py

# Custom reference image and threshold
python face_recognition_app.py --reference my_face.jpg --threshold 0.60 --camera 0`,
    },
  ];

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      
      {/* Overview Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-3">
        <div className="flex items-center space-x-2 text-emerald-400">
          <Terminal className="w-5 h-5" />
          <h2 className="text-base font-bold text-white uppercase tracking-wider">
            Step-by-Step Installation & OS Configuration Guide
          </h2>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed">
          Follow the instructions below to install C++ compilers, CMake, dlib, OpenCV, and face_recognition on Windows, macOS, or Linux.
        </p>
      </div>

      {/* Terminal Step Blocks */}
      <div className="space-y-4">
        {codeBlocks.map((block, idx) => (
          <div key={idx} className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
            <div className="bg-slate-950 px-4 py-2.5 border-b border-slate-800 flex items-center justify-between text-xs font-semibold text-slate-300">
              <span>{block.title}</span>
              <button
                onClick={() => copyToClipboard(block.cmd, idx)}
                className="flex items-center space-x-1 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-mono transition"
              >
                {copiedIndex === idx ? (
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
                <span>{copiedIndex === idx ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
            <pre className="p-4 bg-slate-950/80 text-xs font-mono text-emerald-400 overflow-x-auto leading-relaxed">
              <code>{block.cmd}</code>
            </pre>
          </div>
        ))}
      </div>

      {/* Troubleshooting Matrix per Operating System */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-400" />
          OS Troubleshooting & dlib / C++ Compiler Fixes
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          
          {/* Windows */}
          <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 space-y-2">
            <div className="font-bold text-white flex items-center justify-between border-b border-slate-800 pb-2">
              <span>Windows 10/11</span>
              <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded">MSVC C++</span>
            </div>
            <p className="text-slate-400 leading-relaxed">
              If `pip install dlib` fails with "CMake or C++ compiler required":
            </p>
            <ol className="list-decimal list-inside space-y-1 text-slate-300 font-mono text-[11px]">
              <li>Download <strong>Visual Studio Community</strong></li>
              <li>Check "Desktop development with C++"</li>
              <li>Run `pip install cmake`</li>
              <li>Re-run `pip install dlib`</li>
            </ol>
          </div>

          {/* macOS */}
          <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 space-y-2">
            <div className="font-bold text-white flex items-center justify-between border-b border-slate-800 pb-2">
              <span>macOS (Intel / Apple Silicon M1-M4)</span>
              <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded">Homebrew</span>
            </div>
            <p className="text-slate-400 leading-relaxed">
              Install Xcode command line tools and brew dependencies:
            </p>
            <div className="bg-slate-900 p-2 rounded text-emerald-400 font-mono text-[11px] space-y-1">
              <div>xcode-select --install</div>
              <div>brew install cmake dlib</div>
              <div>pip install face_recognition</div>
            </div>
          </div>

          {/* Linux */}
          <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 space-y-2">
            <div className="font-bold text-white flex items-center justify-between border-b border-slate-800 pb-2">
              <span>Linux (Ubuntu / Debian)</span>
              <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded">APT</span>
            </div>
            <p className="text-slate-400 leading-relaxed">
              Install system build packages before running pip:
            </p>
            <div className="bg-slate-900 p-2 rounded text-emerald-400 font-mono text-[11px] space-y-1">
              <div>sudo apt update</div>
              <div>sudo apt install build-essential cmake libx11-dev libatlas-base-dev</div>
              <div>pip install face_recognition</div>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
};
