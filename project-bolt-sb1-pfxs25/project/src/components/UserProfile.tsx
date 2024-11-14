import React from 'react';
import { useParams } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { db } from '../lib/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';

export function UserProfile() {
  const { userId } = useParams();
  const [userData, setUserData] = React.useState<any>(null);
  const [videos, setVideos] = React.useState([]);
  const { user, followUser, unfollowUser } = useStore();
  
  const isFollowing = user?.following.includes(userId || '');

  React.useEffect(() => {
    const fetchUserData = async () => {
      if (!userId) return;
      
      try {
        const userDoc = await getDoc(doc(db, 'users', userId));
        if (userDoc.exists()) {
          setUserData(userDoc.data());
        }
        
        const videosQuery = query(
          collection(db, 'videos'),
          where('userId', '==', userId)
        );
        
        const videosSnapshot = await getDocs(videosQuery);
        setVideos(videosSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };
    
    fetchUserData();
  }, [userId]);

  if (!userData) return <div>Loading...</div>;

  const handleFollowToggle = () => {
    if (!user || !userId) return;
    
    if (isFollowing) {
      unfollowUser(userId);
    } else {
      followUser(userId);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-start gap-6">
            <img
              src={userData.photoURL}
              alt={userData.username}
              className="w-24 h-24 rounded-full"
            />
            
            <div className="flex-1">
              <div className="flex items-center gap-4">
                <h1 className="text-2xl font-bold">@{userData.username}</h1>
                {user && user.id !== userId && (
                  <button
                    onClick={handleFollowToggle}
                    className={`px-6 py-2 rounded-full font-medium ${
                      isFollowing
                        ? 'bg-gray-100 hover:bg-gray-200 text-gray-800'
                        : 'bg-purple-500 hover:bg-purple-600 text-white'
                    }`}
                  >
                    {isFollowing ? 'Following' : 'Follow'}
                  </button>
                )}
              </div>
              
              <p className="text-gray-600 mt-2">{userData.bio}</p>
              
              <div className="flex gap-6 mt-4">
                <div>
                  <div className="text-2xl font-bold">{userData.followers?.length || 0}</div>
                  <div className="text-gray-600">Followers</div>
                </div>
                <div>
                  <div className="text-2xl font-bold">{userData.following?.length || 0}</div>
                  <div className="text-gray-600">Following</div>
                </div>
                <div>
                  <div className="text-2xl font-bold">{userData.totalLikes || 0}</div>
                  <div className="text-gray-600">Likes</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-3 gap-4">
          {videos.map((video: any) => (
            <div
              key={video.id}
              className="aspect-[9/16] bg-gray-100 rounded-lg overflow-hidden relative group"
            >
              <video
                src={video.videoUrl}
                className="w-full h-full object-cover"
                loop
                muted
                playsInline
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <div className="text-white text-center">
                  <div className="font-bold text-xl">{video.likes} likes</div>
                  <div>{video.comments} comments</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}