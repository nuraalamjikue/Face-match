import React from 'react';
import { Sliders, Camera, Volume2, HardDrive, Cpu, Users, Eye, FileText } from 'lucide-react';
import { PythonConfig } from '../types';

interface ScriptConfiguratorProps {
  config: PythonConfig;
  setConfig: React.Dispatch<React.SetStateAction<PythonConfig>>;
  setActiveTab: (tab: 'simulator' | 'code' | 'configurator' | 'setup' | 'tester') => void;
}

export const ScriptConfigurator: React.FC<ScriptConfiguratorProps> = ({
  config,
  setConfig,
  setActiveTab,
}) => {
  const handleChange = (key: keyof PythonConfig, value: unknown) => {
    setConfig((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="space-y-6">
      
      {/* Config Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Sliders className="w-5 h-5 text-emerald-400" />
            Interactive Script Parameter Configurator
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Adjust script settings below. The generated Python code (`face_recognition_app.py`) updates dynamically.
          </p>
        </div>

        <button
          onClick={() => setActiveTab('code')}
          className="px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-slate-950 text-xs font-bold transition shrink-0 shadow-md shadow-emerald-950/50"
        >
          View Updated Script &rarr;
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Core Camera & File Settings */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
          <div className="flex items-center space-x-2 text-emerald-400 border-b border-slate-800 pb-3">
            <Camera className="w-4 h-4" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-white">
              Camera & Target File Settings
            </h3>
          </div>

          {/* Reference Image Path */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Reference Face Image Path
            </label>
            <input
              type="text"
              value={config.referenceImagePath}
              onChange={(e) => handleChange('referenceImagePath', e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 font-mono focus:border-emerald-500 focus:outline-none"
              placeholder="my_face.jpg"
            />
            <p className="text-[11px] text-slate-500 mt-1">
              Path to target image stored in project root or absolute directory.
            </p>
          </div>

          {/* Camera Device Index */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Webcam Device Index (`camera_id`)
            </label>
            <select
              value={config.cameraIndex}
              onChange={(e) => handleChange('cameraIndex', parseInt(e.target.value))}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 font-mono focus:border-emerald-500 focus:outline-none cursor-pointer"
            >
              <option value={0}>0 (Default Built-in Webcam)</option>
              <option value={1}>1 (USB External Camera / Cam Link)</option>
              <option value={2}>2 (Secondary Video Input)</option>
            </select>
          </div>

          {/* Multi-face handling mode */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1 flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-sky-400" />
              Multi-Face Detection Strategy
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => handleChange('multiFaceMode', 'main')}
                className={`py-2 px-3 rounded-lg border text-xs font-medium transition ${
                  config.multiFaceMode === 'main'
                    ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300 font-bold'
                    : 'bg-slate-950 border-slate-800 text-slate-400'
                }`}
              >
                Main Face Only (Largest)
              </button>
              <button
                onClick={() => handleChange('multiFaceMode', 'all')}
                className={`py-2 px-3 rounded-lg border text-xs font-medium transition ${
                  config.multiFaceMode === 'all'
                    ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300 font-bold'
                    : 'bg-slate-950 border-slate-800 text-slate-400'
                }`}
              >
                Evaluate All Faces
              </button>
            </div>
          </div>
        </div>

        {/* Real-time Performance & Optimization */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
          <div className="flex items-center space-x-2 text-sky-400 border-b border-slate-800 pb-3">
            <Cpu className="w-4 h-4" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-white">
              Performance & FPS Tuning
            </h3>
          </div>

          {/* Frame Downscaling Factor */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-medium text-slate-300">
                Frame Downscale Ratio
              </label>
              <span className="text-xs font-mono text-sky-400 font-bold">{config.downscaleFactor}x</span>
            </div>
            <select
              value={config.downscaleFactor}
              onChange={(e) => handleChange('downscaleFactor', parseFloat(e.target.value))}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 font-mono focus:border-sky-500 focus:outline-none cursor-pointer"
            >
              <option value={0.25}>0.25x (Super Fast - 4x speedup, recommended)</option>
              <option value={0.5}>0.50x (Balanced Speed & Precision)</option>
              <option value={1.0}>1.00x (Full Resolution - CPU Intensive)</option>
            </select>
          </div>

          {/* Process Every N Frames */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-medium text-slate-300">
                Process Every N-th Frame
              </label>
              <span className="text-xs font-mono text-sky-400 font-bold">Every {config.processEveryNFrames} frame(s)</span>
            </div>
            <input
              type="range"
              min="1"
              max="5"
              step="1"
              value={config.processEveryNFrames}
              onChange={(e) => handleChange('processEveryNFrames', parseInt(e.target.value))}
              className="w-full accent-sky-400 cursor-pointer h-2 bg-slate-950 rounded-lg"
            />
            <p className="text-[11px] text-slate-500 mt-1">
              Processing every 2nd or 3rd frame boosts FPS while maintaining fluid video playback.
            </p>
          </div>

          {/* Distance Threshold */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-medium text-slate-300">
                Euclidean Match Distance Threshold
              </label>
              <span className="text-xs font-mono text-emerald-400 font-bold">{config.threshold.toFixed(2)}</span>
            </div>
            <input
              type="range"
              min="0.30"
              max="0.80"
              step="0.02"
              value={config.threshold}
              onChange={(e) => handleChange('threshold', parseFloat(e.target.value))}
              className="w-full accent-emerald-400 cursor-pointer h-2 bg-slate-950 rounded-lg"
            />
          </div>
        </div>

        {/* Audio Alerts & Logging Options */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4 md:col-span-2">
          <div className="flex items-center space-x-2 text-amber-400 border-b border-slate-800 pb-3">
            <HardDrive className="w-4 h-4" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-white">
              Audio Chimes, CSV Logging & Face Snapshot Storage
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Audio Toggle */}
            <div className="flex items-center justify-between p-3 rounded-lg bg-slate-950 border border-slate-800">
              <div>
                <span className="text-xs font-semibold text-white flex items-center gap-1.5">
                  <Volume2 className="w-4 h-4 text-amber-400" />
                  Sound Alert on Match
                </span>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Plays audio chime / terminal bell when target face is recognized.
                </p>
              </div>
              <input
                type="checkbox"
                checked={config.enableSound}
                onChange={(e) => handleChange('enableSound', e.target.checked)}
                className="w-5 h-5 accent-emerald-500 cursor-pointer rounded"
              />
            </div>

            {/* Logging Toggle */}
            <div className="flex items-center justify-between p-3 rounded-lg bg-slate-950 border border-slate-800">
              <div>
                <span className="text-xs font-semibold text-white flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-emerald-400" />
                  CSV & Cropped Snapshot Logging
                </span>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Automatically appends records to `logs/match_history.csv` and saves cropped face images.
                </p>
              </div>
              <input
                type="checkbox"
                checked={config.enableLogging}
                onChange={(e) => handleChange('enableLogging', e.target.checked)}
                className="w-5 h-5 accent-emerald-500 cursor-pointer rounded"
              />
            </div>

          </div>
        </div>

      </div>

    </div>
  );
};
