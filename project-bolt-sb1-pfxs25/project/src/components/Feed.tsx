import React from 'react';
import { VideoCard } from './VideoCard';
import { useInView } from 'react-intersection-observer';
import { db } from '../lib/firebase';
import { collection, query, orderBy, limit, startAfter, getDocs } from 'firebase/firestore';

export function Feed() {
  const [videos, setVideos] = React.useState<any[]>([]);
  const [lastDoc, setLastDoc] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(false);
  const [hasMore, setHasMore] = React.useState(true);
  
  const { ref, inView } = useInView({
    threshold: 0.5,
    triggerOnce: false
  });

  const fetchVideos = async (isInitial = false) => {
    if (loading || (!isInitial && !hasMore)) return;
    
    setLoading(true);
    try {
      const videosQuery = query(
        collection(db, 'videos'),
        orderBy('createdAt', 'desc'),
        limit(5),
        ...(!isInitial && lastDoc ? [startAfter(lastDoc)] : [])
      );
      
      const snapshot = await getDocs(videosQuery);
      
      if (snapshot.empty) {
        setHasMore(false);
        setLoading(false);
        return;
      }
      
      const newVideos = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      setLastDoc(snapshot.docs[snapshot.docs.length - 1]);
      setVideos(prev => isInitial ? newVideos : [...prev, ...newVideos]);
    } catch (error) {
      console.error('Error fetching videos:', error);
    }
    setLoading(false);
  };

  React.useEffect(() => {
    fetchVideos(true);
  }, []);

  React.useEffect(() => {
    if (inView) {
      fetchVideos();
    }
  }, [inView]);

  return (
    <div className="h-[calc(100vh-4rem)] w-full overflow-y-scroll snap-y snap-mandatory">
      {videos.map((video, index) => (
        <div
          key={video.id}
          ref={index === videos.length - 1 ? ref : undefined}
        >
          <VideoCard {...video} />
        </div>
      ))}
      {loading && (
        <div className="flex justify-center p-4">
          <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
    </div>
  );
}