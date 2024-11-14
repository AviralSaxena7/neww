import { db } from './firebase';
import { collection, addDoc } from 'firebase/firestore';

const sampleVideos = [
  {
    username: 'fashionista',
    userId: 'user1',
    description: '🌟 NEW DROP: Limited Edition Summer Collection! Grab yours now! #fashion',
    songName: 'Summer Vibes - Fashion Beat',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-girl-in-neon-sign-1232-large.mp4',
    likes: '127.9K',
    comments: '1,205',
    shares: '4,521',
    userImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
    productId: 'summer-dress-001',
    price: '59.99',
    createdAt: new Date()
  },
  {
    username: 'techgeek',
    userId: 'user2',
    description: '🎮 Next-gen Gaming Headphones with 3D Audio! #tech #gaming',
    songName: 'Tech Review - Gaming Series',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-tree-with-yellow-flowers-1173-large.mp4',
    likes: '89.2K',
    comments: '942',
    shares: '3,133',
    userImage: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
    productId: 'gaming-headset-002',
    price: '129.99',
    createdAt: new Date()
  },
  {
    username: 'beautyguru',
    userId: 'user3',
    description: '💄 Revolutionary 24h Matte Lipstick - Waterproof & Smudge-free! #beauty',
    songName: 'Glam Time - Beauty Beats',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-serving-dinner-442-large.mp4',
    likes: '156.3K',
    comments: '2,844',
    shares: '5,922',
    userImage: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=150',
    productId: 'matte-lipstick-003',
    price: '24.99',
    createdAt: new Date()
  }
];

export async function seedDatabase() {
  try {
    for (const video of sampleVideos) {
      await addDoc(collection(db, 'videos'), video);
    }
    console.log('Database seeded successfully');
  } catch (error) {
    console.error('Error seeding database:', error);
  }
}