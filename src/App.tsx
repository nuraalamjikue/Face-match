import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { LiveWebcamSimulator } from './components/LiveWebcamSimulator';
import { PythonCodeViewer } from './components/PythonCodeViewer';
import { ScriptConfigurator } from './components/ScriptConfigurator';
import { SetupGuide } from './components/SetupGuide';
import { ReferenceTester } from './components/ReferenceTester';
import { ActiveTab, PythonConfig } from './types';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('simulator');
  const [isModelLoaded, setIsModelLoaded] = useState<boolean>(false);

  const [config, setConfig] = useState<PythonConfig>({
    referenceImagePath: 'my_face.jpg',
    threshold: 0.60,
    cameraIndex: 0,
    downscaleFactor: 0.25,
    processEveryNFrames: 2,
    enableSound: true,
    enableLogging: true,
    logDir: 'logs',
    multiFaceMode: 'main',
    framework: 'face_recognition',
  });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-slate-950">
      
      {/* Navbar Header */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isModelLoaded={isModelLoaded}
      />

      {/* Main Content Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {activeTab === 'simulator' && (
          <LiveWebcamSimulator
            config={config}
            setConfig={setConfig}
            isModelLoaded={isModelLoaded}
            setIsModelLoaded={setIsModelLoaded}
          />
        )}

        {activeTab === 'code' && (
          <PythonCodeViewer config={config} />
        )}

        {activeTab === 'configurator' && (
          <ScriptConfigurator
            config={config}
            setConfig={setConfig}
            setActiveTab={setActiveTab}
          />
        )}

        {activeTab === 'setup' && (
          <SetupGuide />
        )}

        {activeTab === 'tester' && (
          <ReferenceTester config={config} />
        )}

      </main>

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-slate-800 py-4 text-center text-xs text-slate-500 font-mono">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>
            Real-Time Face Recognition Engineering Suite &bull; OpenCV + dlib / face_recognition
          </div>
          <div>
            128D Deep Facial Landmark Vector Distance Matching
          </div>
        </div>
      </footer>

    </div>
  );
}
