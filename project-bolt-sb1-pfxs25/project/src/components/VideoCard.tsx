import React from 'react';
import { Heart, MessageCircle, Share2, Music2, ShoppingBag, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { ARView } from './ARView';

interface VideoCardProps {
  id: string;
  username: string;
  description: string;
  songName: string;
  videoUrl: string;
  likes: string;
  comments: string;
  shares: string;
  userImage: string;
  userId: string;
  productId: string;
  price: string;
}

export function VideoCard({
  id,
  username,
  description,
  songName,
  videoUrl,
  likes,
  comments,
  shares,
  userImage,
  userId,
  productId,
  price,
}: VideoCardProps) {
  const [showAR, setShowAR] = React.useState(false);
  const { user, likeVideo, unlikeVideo, followUser, unfollowUser, closeSidebar } = useStore();
  const isLiked = user?.likedVideos.includes(id);
  const isFollowing = user?.following.includes(userId);

  const handleLike = () => {
    if (!user) return;
    if (isLiked) {
      unlikeVideo(id);
    } else {
      likeVideo(id);
    }
  };

  const handleFollow = () => {
    if (!user) return;
    if (isFollowing) {
      unfollowUser(userId);
    } else {
      followUser(userId);
    }
  };

  return (
    <>
      <div className="snap-center relative h-screen w-full max-w-[600px] mx-auto bg-black">
        <video
          src={videoUrl}
          className="absolute inset-0 object-cover w-full h-full"
          loop
          muted
          playsInline
          autoPlay
        />
        
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
          <div className="flex items-end justify-between gap-4">
            <div className="flex-1 text-white">
              <div className="flex items-center gap-2">
                <Link to={`/user/${userId}`}>
                  <img
                    src={userImage}
                    alt={username}
                    className="w-8 h-8 md:w-12 md:h-12 rounded-full border-2 border-white"
                  />
                </Link>
                <div className="flex-1 min-w-0">
                  <Link to={`/user/${userId}`}>
                    <h3 className="font-bold text-sm md:text-base truncate">@{username}</h3>
                  </Link>
                  <p className="text-xs md:text-sm opacity-90 line-clamp-2">{description}</p>
                  <div className="flex items-center gap-1 text-xs md:text-sm mt-1">
                    <Music2 size={14} />
                    <span className="truncate">{songName}</span>
                  </div>
                  <div className="mt-2 text-lg md:text-xl font-bold text-green-400">
                    ${price}
                  </div>
                </div>
                {user && user.id !== userId && (
                  <button
                    onClick={handleFollow}
                    className={`px-4 py-1 rounded-full text-sm font-medium ${
                      isFollowing
                        ? 'bg-white/10 hover:bg-white/20'
                        : 'bg-purple-500 hover:bg-purple-600'
                    }`}
                  >
                    {isFollowing ? 'Following' : 'Follow'}
                  </button>
                )}
              </div>
            </div>
            
            <div className="flex flex-col gap-3 items-center text-white">
              <button
                onClick={handleLike}
                className="flex flex-col items-center gap-1"
              >
                <div className={`p-2 md:p-3 rounded-full ${
                  isLiked ? 'bg-red-500' : 'bg-white/10 hover:bg-white/20'
                }`}>
                  <Heart
                    size={20}
                    className={`md:w-6 md:h-6 ${isLiked ? 'fill-white' : ''}`}
                  />
                </div>
                <span className="text-[10px] md:text-xs">{likes}</span>
              </button>
              
              <button className="flex flex-col items-center gap-1">
                <div className="bg-white/10 p-2 md:p-3 rounded-full hover:bg-white/20">
                  <MessageCircle size={20} className="md:w-6 md:h-6" />
                </div>
                <span className="text-[10px] md:text-xs">{comments}</span>
              </button>
              
              <button className="flex flex-col items-center gap-1">
                <div className="bg-white/10 p-2 md:p-3 rounded-full hover:bg-white/20">
                  <Share2 size={20} className="md:w-6 md:h-6" />
                </div>
                <span className="text-[10px] md:text-xs">{shares}</span>
              </button>

              <Link
                to={`/product/${productId}`}
                onClick={closeSidebar}
                className="flex flex-col items-center gap-1"
              >
                <div className="bg-gradient-to-r from-pink-500 to-purple-500 p-2 md:p-3 rounded-full animate-pulse">
                  <ShoppingBag size={20} className="md:w-6 md:h-6" />
                </div>
                <span className="text-[10px] md:text-xs font-bold">Buy Now</span>
              </Link>

              <button
                onClick={() => setShowAR(true)}
                className="flex flex-col items-center gap-1"
              >
                <div className="bg-white/20 p-2 md:p-3 rounded-full hover:bg-white/30">
                  <Sparkles size={20} className="md:w-6 md:h-6" />
                </div>
                <span className="text-[10px] md:text-xs">Try On</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <ARView
        isOpen={showAR}
        onClose={() => setShowAR(false)}
        productId={productId}
      />
    </>
  );
}