import React, { useRef, useState } from 'react';
import Webcam from 'react-webcam';
import { useStore } from '../store/useStore';
import { db } from '../lib/firebase';
import { addDoc, collection } from 'firebase/firestore';
import { X, Video, Mic } from 'lucide-react';

interface LiveStreamProps {
  isOpen: boolean;
  onClose: () => void;
}

export function LiveStream({ isOpen, onClose }: LiveStreamProps) {
  const webcamRef = useRef<Webcam>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const user = useStore(state => state.user);

  if (!isOpen) return null;

  const startStream = async () => {
    if (!user) return;
    
    try {
      const streamDoc = await addDoc(collection(db, 'streams'), {
        userId: user.id,
        username: user.username,
        startedAt: new Date(),
        isLive: true,
        viewers: 0
      });
      
      setIsStreaming(true);
      // Here you would typically integrate with a real streaming service
      console.log('Stream started with ID:', streamDoc.id);
    } catch (error) {
      console.error('Error starting stream:', error);
    }
  };

  const stopStream = async () => {
    setIsStreaming(false);
    onClose();
  };

  const videoConstraints = {
    width: 1280,
    height: 720,
    facingMode: "user",
    enabled: isVideoEnabled
  };

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
              audio={!isMuted}
              videoConstraints={videoConstraints}
              className="w-full h-full object-cover"
            />
          </div>
          
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
            <div className="flex items-center justify-center gap-4">
              <button
                onClick={() => setIsMuted(!isMuted)}
                className={`p-3 rounded-full ${
                  isMuted ? 'bg-red-500' : 'bg-white/10 hover:bg-white/20'
                }`}
              >
                <Mic size={20} className="text-white" />
              </button>
              
              <button
                onClick={() => setIsVideoEnabled(!isVideoEnabled)}
                className={`p-3 rounded-full ${
                  !isVideoEnabled ? 'bg-red-500' : 'bg-white/10 hover:bg-white/20'
                }`}
              >
                <Video size={20} className="text-white" />
              </button>
              
              <button
                onClick={isStreaming ? stopStream : startStream}
                className={`px-6 py-2 rounded-full font-medium ${
                  isStreaming
                    ? 'bg-red-500 hover:bg-red-600'
                    : 'bg-purple-500 hover:bg-purple-600'
                }`}
              >
                {isStreaming ? 'End Stream' : 'Go Live'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}