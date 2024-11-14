import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import Webcam from 'react-webcam';

interface ARViewProps {
  isOpen: boolean;
  onClose: () => void;
  productId: string;
}

export function ARView({ isOpen, onClose, productId }: ARViewProps) {
  const webcamRef = useRef<Webcam>(null);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50">
      <div className="w-full max-w-4xl p-4">
        <div className="relative bg-black rounded-lg overflow-hidden">
          <button
            onClick={onClose}
            className="absolute right-4 top-4 text-white/80 hover:text-white z-10"
          >
            <X size={24} />
          </button>
          
          <div className="aspect-video bg-gray-900">
            <Webcam
              ref={webcamRef}
              className="w-full h-full object-cover"
              mirrored
            />
            <div className="absolute inset-0 pointer-events-none">
              {/* Here you would integrate with a WebAR library like AR.js or Mind-AR */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg text-white">
                Point camera at yourself to try on the product
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}