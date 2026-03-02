import React, { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, Camera, RefreshCw, TreePine, Star, AlertTriangle, Video, Zap, StopCircle, ZapOff } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Spinner } from '../components/ui/Spinner';
import { Modal } from '../components/ui/Modal';
import { useApp } from '../context/AppContext';
import { useModel } from '../hooks/useModel';
import { useToast } from '../hooks/useToast';
import {
  calculateCarbon,
  calculateTrees,
  calculatePoints,
  getImpactBadge,
  buildRecord,
  getCategoryIcon,
  getCategoryColor,
} from '../utils/carbonEngine';
import { MODEL_URL, CONFIDENCE_THRESHOLD, EMISSION_FACTORS } from '../config/constants';

/* ─────────────────────────────────────────────────────────
   Mode Toggle  (Upload / Camera / Live)
───────────────────────────────────────────────────────── */
function ModeToggle({ mode, onMode }) {
  const modes = [
    { id: 'upload', label: 'Upload', icon: Upload },
    { id: 'camera', label: 'Camera', icon: Camera },
    { id: 'live', label: 'Live AI', icon: Zap },
  ];
  return (
    <div className="flex gap-1 p-1 rounded-2xl mb-6" style={{ background: 'var(--eco-surface)', border: '1px solid rgba(16,185,129,0.12)' }}>
      {modes.map(({ id, label, icon: Icon }) => (
        <button
          key={id}
          onClick={() => onMode(id)}
          className="flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-sm font-medium transition-all duration-300"
          style={mode === id
            ? { background: 'linear-gradient(135deg,#059669,#0891b2)', color: '#fff', boxShadow: '0 0 20px rgba(16,185,129,0.4)' }
            : { color: 'var(--eco-muted)' }
          }
        >
          <Icon className="w-4 h-4" />
          {label}
        </button>
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   Futuristic Scan Overlay (on top of camera video)
───────────────────────────────────────────────────────── */
function ScanOverlay({ scanning }) {
  return (
    <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
      {/* Corner brackets */}
      {['top-3 left-3', 'top-3 right-3', 'bottom-3 left-3', 'bottom-3 right-3'].map((pos, i) => (
        <div key={i} className={`absolute ${pos} w-8 h-8`} style={{
          borderColor: 'rgba(16,185,129,0.8)', borderStyle: 'solid',
          borderTopWidth: pos.includes('top') ? 2 : 0,
          borderBottomWidth: pos.includes('bottom') ? 2 : 0,
          borderLeftWidth: pos.includes('left') ? 2 : 0,
          borderRightWidth: pos.includes('right') ? 2 : 0,
          borderRadius: pos.includes('top-3 left-3') ? '8px 0 0 0' : pos.includes('top-3 right-3') ? '0 8px 0 0' : pos.includes('bottom-3 left-3') ? '0 0 0 8px' : '0 0 8px 0',
          boxShadow: '0 0 10px rgba(16,185,129,0.5)',
        }} />
      ))}

      {/* Scan line */}
      {scanning && (
        <motion.div
          animate={{ y: ['-40%', '40%', '-40%'] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute left-4 right-4"
          style={{ height: 2, background: 'linear-gradient(90deg, transparent, rgba(16,185,129,0.8), rgba(6,182,212,1), rgba(16,185,129,0.8), transparent)', boxShadow: '0 0 16px rgba(16,185,129,0.6)' }}
        />
      )}

      {/* Center crosshair */}
      <div className="relative w-20 h-20">
        <div className="absolute top-1/2 left-0 right-0 h-px" style={{ background: 'rgba(16,185,129,0.35)' }} />
        <div className="absolute left-1/2 top-0 bottom-0 w-px" style={{ background: 'rgba(16,185,129,0.35)' }} />
        <div className="absolute inset-0 rounded-full" style={{ border: '1px solid rgba(16,185,129,0.25)' }} />
        <div className="absolute inset-3 rounded-full" style={{ border: '1px solid rgba(6,182,212,0.2)' }} />
      </div>

      {/* AI status label */}
      <div className="absolute top-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono"
        style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)', color: scanning ? '#10b981' : '#6b8f6e', border: '1px solid rgba(16,185,129,0.3)' }}>
        <span className={`w-1.5 h-1.5 rounded-full ${scanning ? 'bg-emerald-400 animate-pulse' : 'bg-gray-500'}`} />
        {scanning ? 'AI SCANNING' : 'AI READY'}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   Live Prediction Bar (overlaid UI for live mode)
───────────────────────────────────────────────────────── */
function LivePredictionBar({ predictions }) {
  if (!predictions || predictions.length === 0) return null;
  const top3 = predictions.slice(0, 3);
  return (
    <div className="absolute bottom-0 left-0 right-0 p-3 space-y-1"
      style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.85), transparent)', backdropFilter: 'blur(4px)' }}>
      {top3.map((p, i) => (
        <div key={p.className} className="flex items-center gap-2">
          <span className="text-xs font-mono w-20 truncate" style={{ color: i === 0 ? '#10b981' : '#5a8a7a' }}>
            {p.className}
          </span>
          <div className="flex-1 h-1.5 rounded-full" style={{ background: 'rgba(255,255,255,0.1)' }}>
            <motion.div
              animate={{ width: `${p.probability * 100}%` }}
              transition={{ duration: 0.4 }}
              className="h-full rounded-full"
              style={{ background: i === 0 ? 'linear-gradient(90deg,#059669,#06b6d4)' : 'rgba(16,185,129,0.35)' }}
            />
          </div>
          <span className="text-xs font-mono w-10 text-right" style={{ color: i === 0 ? '#10b981' : '#5a8a7a' }}>
            {Math.round(p.probability * 100)}%
          </span>
        </div>
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   Camera View (shared between camera and live mode)
───────────────────────────────────────────────────────── */
function CameraView({ mode, classifyImage, onCapture, onReset }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const liveIntervalRef = useRef(null);

  const [cameraReady, setCameraReady] = useState(false);
  const [error, setError] = useState('');
  const [scanning, setScanning] = useState(false);
  const [livePredictions, setLivePredictions] = useState([]);
  const [isCapturing, setIsCapturing] = useState(false);
  const { showError } = useToast();

  // Start camera stream
  useEffect(() => {
    let active = true;
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment', width: { ideal: 640 }, height: { ideal: 480 } },
        });
        if (!active) { stream.getTracks().forEach(t => t.stop()); return; }
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
          setCameraReady(true);
        }
      } catch (err) {
        setError(err.name === 'NotAllowedError'
          ? 'Camera permission denied. Please allow camera access and try again.'
          : 'Could not access camera. Make sure a camera is connected.');
      }
    };
    startCamera();
    return () => {
      active = false;
      if (streamRef.current) streamRef.current.getTracks().forEach(t => t.stop());
      if (liveIntervalRef.current) clearInterval(liveIntervalRef.current);
    };
  }, []);

  // For Live mode: run classification on an interval
  useEffect(() => {
    if (mode !== 'live' || !cameraReady) return;
    setScanning(true);

    const classifyFrame = async () => {
      if (!videoRef.current || !canvasRef.current) return;
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 480;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      const img = new Image();
      img.src = canvas.toDataURL('image/jpeg', 0.8);
      img.onload = async () => {
        try {
          const preds = await classifyImage(img);
          setLivePredictions(preds);
        } catch (_) { }
      };
    };

    liveIntervalRef.current = setInterval(classifyFrame, 1500);
    return () => { clearInterval(liveIntervalRef.current); setScanning(false); };
  }, [mode, cameraReady, classifyImage]);

  // Capture snapshot (camera mode)
  const handleCapture = useCallback(async () => {
    if (!videoRef.current || !canvasRef.current) return;
    setIsCapturing(true);
    setScanning(true);
    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL('image/jpeg', 0.92);
    onCapture(dataUrl);
    setIsCapturing(false);
    setScanning(false);
  }, [onCapture]);

  // Use live best result
  const handleUseLiveResult = () => {
    if (livePredictions.length > 0) {
      onCapture(null, livePredictions);
    }
  };

  if (error) {
    return (
      <div className="rounded-2xl p-8 text-center space-y-4" style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.2)' }}>
        <AlertTriangle className="w-10 h-10 text-red-400 mx-auto" />
        <p className="text-sm text-red-400">{error}</p>
        <Button variant="ghost" onClick={onReset}>Go Back</Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Video viewfinder */}
      <div className="relative rounded-2xl overflow-hidden" style={{ border: '1px solid rgba(16,185,129,0.25)', background: '#000', minHeight: 260 }}>
        {!cameraReady && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center space-y-3">
              <Spinner className="mx-auto" />
              <p className="text-sm text-eco-text-muted">Starting camera…</p>
            </div>
          </div>
        )}
        <video
          ref={videoRef}
          muted
          playsInline
          className="w-full object-cover rounded-2xl"
          style={{ maxHeight: 320, opacity: cameraReady ? 1 : 0, transition: 'opacity 0.5s' }}
        />
        <canvas ref={canvasRef} className="hidden" />
        <ScanOverlay scanning={scanning || mode === 'live'} />
        {mode === 'live' && <LivePredictionBar predictions={livePredictions} />}
      </div>

      {/* Controls */}
      {mode === 'camera' && (
        <Button
          variant="primary"
          fullWidth
          onClick={handleCapture}
          loading={isCapturing}
          disabled={!cameraReady}
        >
          <Camera className="w-4 h-4 mr-2" />
          {isCapturing ? 'Capturing…' : 'Capture & Analyse'}
        </Button>
      )}

      {mode === 'live' && (
        <div className="space-y-3">
          {livePredictions.length > 0 && (
            <div className="flex items-center gap-3 p-3 rounded-xl" style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)' }}>
              <span className="text-2xl">{getCategoryIcon(livePredictions[0]?.className)}</span>
              <div className="flex-1">
                <p className="text-sm font-semibold text-eco-text">{livePredictions[0]?.className}</p>
                <p className="text-xs text-eco-text-muted">{Math.round((livePredictions[0]?.probability || 0) * 100)}% confidence</p>
              </div>
              {(livePredictions[0]?.probability || 0) > CONFIDENCE_THRESHOLD && (
                <Button variant="primary" onClick={handleUseLiveResult}>Use This</Button>
              )}
            </div>
          )}
          <Button variant="ghost" fullWidth onClick={onReset}>
            <StopCircle className="w-4 h-4 mr-2" /> Stop Camera
          </Button>
        </div>
      )}

      {mode === 'camera' && (
        <Button variant="ghost" fullWidth onClick={onReset}>Change Mode</Button>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   Upload Zone (Step 1 – Upload mode)
───────────────────────────────────────────────────────── */
function UploadZone({ image, onImageUpload, onClearImage, simulationMode }) {
  const fileInputRef = useRef(null);
  const { showError } = useToast();

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) { showError('Please upload a valid image (JPEG, PNG, or WebP)'); return; }
    if (file.size > 5 * 1024 * 1024) { showError('Image size must be less than 5MB'); return; }
    const reader = new FileReader();
    reader.onload = (event) => onImageUpload(event.target.result);
    reader.readAsDataURL(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) handleFileChange({ target: { files: [file] } });
  };

  return (
    <div className="space-y-4">
      {simulationMode && (
        <div className="flex items-center gap-2 p-3 rounded-lg text-sm" style={{ background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.25)', color: '#93c5fd' }}>
          <AlertTriangle className="w-4 h-4 flex-shrink-0" />
          <span>Running in demo mode — model loading or unavailable</span>
        </div>
      )}
      {!image ? (
        <div
          onClick={() => fileInputRef.current?.click()}
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          className="border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all"
          style={{ borderColor: 'rgba(16,185,129,0.25)', background: 'var(--eco-surface)' }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(16,185,129,0.5)'; e.currentTarget.style.background = 'var(--eco-surface2)'; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(16,185,129,0.25)'; e.currentTarget.style.background = 'var(--eco-surface)'; }}
        >
          <input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/webp" onChange={handleFileChange} className="hidden" />
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ background: 'linear-gradient(135deg,rgba(5,150,105,0.2),rgba(8,145,178,0.2))', border: '1px solid rgba(16,185,129,0.2)' }}>
            <Upload className="w-8 h-8 text-emerald-400" />
          </div>
          <p className="text-eco-text font-medium mb-1">Drag & drop waste image or click to browse</p>
          <p className="text-sm text-eco-text-muted">Supports JPEG, PNG, WebP (max 5MB)</p>
        </div>
      ) : (
        <div className="relative rounded-2xl overflow-hidden" style={{ border: '1px solid rgba(16,185,129,0.2)' }}>
          <img src={image} alt="Waste preview" className="w-full max-h-80 object-contain" style={{ background: 'var(--eco-surface)' }} />
          <button onClick={onClearImage} className="absolute top-4 right-4 p-2 rounded-lg transition-colors"
            style={{ background: 'var(--eco-bg)', backdropFilter: 'blur(8px)', border: '1px solid var(--eco-border)' }}>
            <RefreshCw className="w-5 h-5 text-eco-text" />
          </button>
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   Classification Results (Step 3)
───────────────────────────────────────────────────────── */
function ClassificationResults({ predictions }) {
  const primary = predictions[0];
  const rest = predictions.slice(1);
  const confidence = primary.probability;
  const isUncertain = confidence < CONFIDENCE_THRESHOLD;

  const confidenceColor = confidence > 0.7 ? 'bg-green-500' : confidence > 0.5 ? 'bg-yellow-500' : 'bg-red-500';
  const wasteType = EMISSION_FACTORS[primary.className]?.wasteType || 'Unknown';
  const badgeVariantMap = { Recyclable: 'recyclable', Biodegradable: 'biodegradable', Hazardous: 'hazardous', 'Non-Recyclable': 'default' };
  const badgeVariant = badgeVariantMap[wasteType] || 'default';

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
      {/* ── Primary detection ── */}
      <Card className="border-eco-accent/30" style={{ background: 'var(--eco-surface)', backdropFilter: 'blur(24px)', border: '1px solid rgba(16,185,129,0.2)' }}>
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl"
            style={{ background: `${getCategoryColor(primary.className)}18`, border: `1px solid ${getCategoryColor(primary.className)}35` }}>
            {getCategoryIcon(primary.className)}
          </div>
          <div className="flex-1">
            <h3 className="font-syne font-bold text-2xl text-eco-text">{primary.className}</h3>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant={badgeVariant}>{wasteType}</Badge>
            </div>
          </div>
          <div className="text-right">
            <div className="font-syne font-bold text-3xl" style={{ color: '#10b981' }}>{Math.round(confidence * 100)}%</div>
            <div className="text-sm text-eco-text-muted">confidence</div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-eco-text-muted">Confidence Score</span>
            <span style={{ color: confidence > 0.7 ? '#34d399' : confidence > 0.5 ? '#fbbf24' : '#f87171' }}>
              {confidence > 0.7 ? 'High' : confidence > 0.5 ? 'Medium' : 'Low'}
            </span>
          </div>
          <div className="h-3 rounded-full overflow-hidden" style={{ background: 'var(--eco-surface2)' }}>
            <motion.div initial={{ width: 0 }} animate={{ width: `${confidence * 100}%` }}
              transition={{ duration: 0.6, ease: 'easeOut' }} className={`h-full ${confidenceColor} rounded-full`} />
          </div>
        </div>

        {isUncertain && (
          <div className="mt-4 flex items-center gap-2 p-3 rounded-lg" style={{ background: 'rgba(234,179,8,0.08)', border: '1px solid rgba(234,179,8,0.25)' }}>
            <AlertTriangle className="w-5 h-5 text-yellow-400 flex-shrink-0" />
            <p className="text-sm text-yellow-400">Classification uncertain. Please verify manually.</p>
          </div>
        )}
      </Card>

      {/* ── All other detections ── */}
      {rest.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-widest text-eco-text-muted px-1">All Detections</p>
          {rest.map((pred, idx) => {
            const pConf = pred.probability;
            const barColor = pConf > 0.7 ? '#34d399' : pConf > 0.5 ? '#fbbf24' : '#f87171';
            return (
              <motion.div
                key={pred.className}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.06 }}
                className="flex items-center gap-3 px-4 py-3 rounded-xl"
                style={{ background: 'var(--eco-surface)', border: '1px solid var(--eco-border)' }}
              >
                <span className="text-xl w-8 text-center flex-shrink-0">{getCategoryIcon(pred.className)}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-eco-text truncate">{pred.className}</span>
                    <span className="text-xs font-mono ml-2 flex-shrink-0" style={{ color: barColor }}>{Math.round(pConf * 100)}%</span>
                  </div>
                  <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--eco-surface2)' }}>
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${pConf * 100}%` }}
                      transition={{ duration: 0.5, delay: idx * 0.06, ease: 'easeOut' }}
                      className="h-full rounded-full"
                      style={{ background: `linear-gradient(90deg, ${barColor}99, ${barColor})` }}
                    />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </motion.div>
  );
}

/* ─────────────────────────────────────────────────────────
   Weight Input (Step 4)
───────────────────────────────────────────────────────── */
function WeightInput({ weight, setWeight, onSubmit, error }) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-eco-text mb-2">Enter waste weight (kg)</label>
        <div className="relative">
          <input
            type="number" min="0.1" max="1000" step="0.1"
            value={weight} onChange={(e) => setWeight(e.target.value)} placeholder="0.5"
            className="w-full px-4 py-4 rounded-xl text-eco-text text-lg text-center placeholder:text-eco-text-muted/50 focus:outline-none transition-all"
            style={{
              background: 'var(--eco-surface)', backdropFilter: 'blur(16px)',
              border: error ? '1px solid rgba(239,68,68,0.5)' : '1px solid var(--eco-border)',
              boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.04)',
            }}
          />
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-eco-text-muted">kg</span>
        </div>
        {error && <p className="mt-2 text-sm text-red-400">{error}</p>}
      </div>
      <Button variant="primary" fullWidth onClick={onSubmit}>Calculate Impact</Button>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────────────────
   Impact Results (Step 5)
───────────────────────────────────────────────────────── */
function ImpactResults({ category, weight, confidence, onSave, onReset, userName }) {
  const { showSuccess } = useToast();
  const [isSaving, setIsSaving] = useState(false);

  const carbonSaved = calculateCarbon(category, parseFloat(weight));
  const treesEquivalent = calculateTrees(carbonSaved);
  const greenPoints = calculatePoints(parseFloat(weight));
  const impactLevel = getImpactBadge(carbonSaved);

  const handleSave = async () => {
    setIsSaving(true);
    const record = buildRecord(category, parseFloat(weight), confidence, userName);
    onSave(record);
    showSuccess(`Record saved! +${greenPoints} green points earned`);
    setTimeout(() => onReset(), 1500);
  };

  const statItems = [
    { value: carbonSaved.toFixed(2), unit: 'kg CO₂', label: 'CO₂ Saved', color: '#10b981' },
    { icon: <TreePine className="w-5 h-5" />, value: treesEquivalent.toFixed(3), label: 'Trees Equiv.', color: '#34d399' },
    { icon: <Star className="w-5 h-5" />, value: greenPoints, label: 'Green Points', color: '#fbbf24' },
  ];

  return (
    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-6">
      <div className="rounded-3xl p-6" style={{ background: 'var(--eco-surface)', backdropFilter: 'blur(32px)', border: '1px solid rgba(16,185,129,0.25)', boxShadow: '0 0 40px rgba(16,185,129,0.12), inset 0 1px 0 rgba(255,255,255,0.08)' }}>
        <h3 className="font-syne font-bold text-xl text-eco-text text-center mb-6">Your Environmental Impact</h3>
        <div className="grid grid-cols-3 gap-4 mb-6">
          {statItems.map((item, index) => (
            <motion.div key={item.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }} className="text-center">
              <div className="font-syne font-bold text-2xl flex items-center justify-center gap-1" style={{ color: item.color }}>
                {item.icon}
                <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 + index * 0.1 }}>
                  {item.value}
                </motion.span>
              </div>
              <div className="text-xs text-eco-text-muted mt-1">{item.label}</div>
              {item.unit && <div className="text-xs mt-0.5" style={{ color: `${item.color}99` }}>{item.unit}</div>}
            </motion.div>
          ))}
        </div>
        <div className="flex justify-center mb-6">
          <Badge variant={impactLevel === 'High Impact' ? 'high' : impactLevel === 'Medium Impact' ? 'medium' : 'low'}>
            {impactLevel}
          </Badge>
        </div>
        <div className="pt-4" style={{ borderTop: '1px solid var(--eco-border)' }}>
          <Button variant="primary" fullWidth onClick={handleSave} loading={isSaving}>Save This Record</Button>
        </div>
      </div>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────────────────
   Scanner Page
───────────────────────────────────────────────────────── */
export function Scanner() {
  const [scanMode, setScanMode] = useState('upload'); // 'upload' | 'camera' | 'live'
  const [step, setStep] = useState(1);
  const [image, setImage] = useState(null);
  const [predictions, setPredictions] = useState(null);
  const [weight, setWeight] = useState('');
  const [weightError, setWeightError] = useState('');
  const [showNameModal, setShowNameModal] = useState(false);

  const { addRecord, currentUser, setUser } = useApp();
  const { classifyImage, isLoading, isReady, simulationMode } = useModel(MODEL_URL);
  const { showError } = useToast();

  React.useEffect(() => {
    if (!currentUser?.name) setShowNameModal(true);
  }, [currentUser]);

  const handleImageUpload = (imageData) => { setImage(imageData); setStep(2); };
  const handleClearImage = () => { setImage(null); setPredictions(null); setWeight(''); setStep(1); };

  const handleClassify = async () => {
    if (!image) return;
    const img = new Image();
    img.src = image;
    img.onload = async () => {
      try {
        const results = await classifyImage(img);
        setPredictions(results);
        setStep(3);
      } catch {
        showError('Failed to classify image. Please try again.');
      }
    };
  };

  // Camera capture handler
  const handleCameraCapture = async (dataUrl, livePreds) => {
    if (livePreds) {
      // Live mode: directly use predictions
      setPredictions(livePreds);
      setStep(3);
      return;
    }
    // Camera snapshot: classify the data URL
    setImage(dataUrl);
    const img = new Image();
    img.src = dataUrl;
    img.onload = async () => {
      try {
        const results = await classifyImage(img);
        setPredictions(results);
        setStep(3);
      } catch {
        showError('Failed to classify. Please try again.');
      }
    };
  };

  const handleWeightSubmit = () => {
    if (!weight || parseFloat(weight) <= 0) { setWeightError('Weight is required'); return; }
    if (parseFloat(weight) > 1000) { setWeightError('Weight must be less than 1000 kg'); return; }
    setWeightError('');
    setStep(5);
  };

  const handleSaveRecord = (record) => addRecord(record);

  const handleNameSubmit = (e) => {
    e.preventDefault();
    const name = e.target.name.value.trim();
    if (name) { setUser({ name, totalPoints: 0 }); setShowNameModal(false); }
  };

  const handleReset = () => {
    setImage(null); setPredictions(null); setWeight(''); setWeightError(''); setStep(1);
  };

  const handleModeChange = (m) => {
    setScanMode(m);
    setStep(1);
    setImage(null);
    setPredictions(null);
  };

  const isCameraMode = scanMode === 'camera' || scanMode === 'live';

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      {/* Page header */}
      <div className="text-center mb-8">
        <h1 className="font-syne font-bold text-3xl text-eco-text mb-2">Waste Scanner</h1>
        <p className="text-eco-text-muted">AI-powered waste identification — Upload, Camera or Live scan</p>
      </div>

      {/* Mode toggle — always visible at step 1 */}
      {step === 1 && <ModeToggle mode={scanMode} onMode={handleModeChange} />}

      {/* Progress indicator */}
      <div className="flex items-center justify-center gap-2 mb-8">
        {[1, 2, 3, 4, 5].map((s) => (
          <div key={s} className="h-2 rounded-full transition-all duration-500"
            style={{ width: s <= step ? 32 : 24, background: s <= step ? 'linear-gradient(90deg,#059669,#0891b2)' : 'var(--eco-surface2)' }} />
        ))}
      </div>

      {/* Step content */}
      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div key="step1" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
            {isCameraMode ? (
              <CameraView
                mode={scanMode}
                classifyImage={classifyImage}
                onCapture={handleCameraCapture}
                onReset={() => handleModeChange('upload')}
              />
            ) : (
              <UploadZone
                image={image}
                onImageUpload={handleImageUpload}
                onClearImage={handleClearImage}
                simulationMode={simulationMode}
              />
            )}
          </motion.div>
        )}

        {step === 2 && (
          <motion.div key="step2" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="space-y-4">
            {image && (
              <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid rgba(16,185,129,0.2)' }}>
                <img src={image} alt="Waste preview" className="w-full max-h-64 object-contain" style={{ background: 'rgba(0,0,0,0.3)' }} />
              </div>
            )}
            <Button variant="primary" fullWidth onClick={handleClassify} loading={isLoading}>
              {isLoading ? 'Analysing…' : 'Analyse Waste'}
            </Button>
            <Button variant="ghost" fullWidth onClick={handleClearImage}>Change Image</Button>
          </motion.div>
        )}

        {step === 3 && predictions && (
          <motion.div key="step3" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="space-y-4">
            <ClassificationResults predictions={predictions} onReset={handleReset} />
            <Button variant="primary" fullWidth onClick={() => setStep(4)}>Continue →</Button>
          </motion.div>
        )}

        {step === 4 && (
          <motion.div key="step4" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
            <WeightInput weight={weight} setWeight={setWeight} onSubmit={handleWeightSubmit} error={weightError} />
          </motion.div>
        )}

        {step === 5 && predictions && (
          <motion.div key="step5" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
            <ImpactResults
              category={predictions[0].className}
              weight={weight}
              confidence={predictions[0].probability}
              onSave={handleSaveRecord}
              onReset={handleReset}
              userName={currentUser?.name || 'Anonymous'}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Name modal */}
      <Modal isOpen={showNameModal} onClose={() => { }} title="Welcome to EcoScan" showCloseButton={false}>
        <form onSubmit={handleNameSubmit} className="space-y-4">
          <p className="text-eco-text-muted">Enter your name to track your contributions on the leaderboard.</p>
          <div>
            <label className="block text-sm font-medium text-eco-text mb-2">Your Name</label>
            <input
              name="name" type="text" required placeholder="John Doe"
              className="w-full px-4 py-3 rounded-xl text-eco-text placeholder:text-eco-text-muted/50 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
              style={{ background: 'var(--eco-surface)', backdropFilter: 'blur(16px)', border: '1px solid var(--eco-border)' }}
            />
          </div>
          <Button type="submit" variant="primary" fullWidth>Join Leaderboard</Button>
        </form>
      </Modal>
    </div>
  );
}

export default Scanner;
