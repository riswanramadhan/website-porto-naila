"use client";

import { useEffect, useState, useCallback } from "react";
import Cropper from "react-easy-crop";
import { Check, RotateCcw, X } from "lucide-react";
import getCroppedImg from "./getCroppedImg";

export default function CropModal({
  imageSrc,
  onSave,
  onCancel,
  aspect = 4 / 3,
  title = "Atur crop gambar",
  subtitle = "Geser gambar untuk menyesuaikan area crop.",
}) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onCancel?.();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onCancel]);

  const handleSave = async () => {
    try {
      const croppedImageBlob = await getCroppedImg(imageSrc, croppedAreaPixels, {
        fileType: "image/jpeg",
        quality: 0.9,
      });
      if (!croppedImageBlob) {
        throw new Error("Gagal memproses crop");
      }
      onSave?.(croppedImageBlob);
    } catch (e) {
      console.error(e);
      alert("Gagal memproses crop");
    }
  };

  const handleReset = () => {
    setCrop({ x: 0, y: 0 });
    setZoom(1);
  };

  return (
    <div className="crop-modal-overlay" onClick={onCancel}>
      <div className="crop-modal-content" onClick={(event) => event.stopPropagation()}>
        <div className="crop-modal-header">
          <div>
            <h3>{title}</h3>
            <p>{subtitle}</p>
          </div>
          <button type="button" onClick={onCancel} className="admin-icon-button" aria-label="Tutup cropper">
            <X size={20} />
          </button>
        </div>
        <div className="crop-modal-body">
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            aspect={aspect}
            onCropChange={setCrop}
            onCropComplete={onCropComplete}
            onZoomChange={(value) => setZoom(Number(value))}
            showGrid
          />
        </div>
        <div className="crop-modal-footer">
          <div className="zoom-slider">
            <span>Zoom</span>
            <input
              type="range"
              value={zoom}
              min={1}
              max={3}
              step={0.1}
              aria-labelledby="Zoom"
              onChange={(event) => setZoom(Number(event.target.value))}
            />
          </div>
          <div className="crop-modal-actions">
            <button type="button" className="button button-secondary" onClick={handleReset}>
              <RotateCcw size={16} /> Reset
            </button>
            <button type="button" className="button button-primary" onClick={handleSave}>
              <Check size={16} /> Simpan Crop
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
