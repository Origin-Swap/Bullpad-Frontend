// posts.tsx

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import useActiveWeb3React from 'hooks/useActiveWeb3React';
import { BACKEND_URL } from 'config/constants/backendApi';
import { format, parseISO, formatDistanceToNowStrict } from 'date-fns';
import UpvoteIcon from './svgs/upVote';
import UpvoteFillIcon from './svgs/hasVote'; // Import icon untuk vote yang sudah dilakukan
import CommentIcon from './svgs/comment';
import ShareIcon from './svgs/share';
import TrashIcon from './svgs/trash';
import Sidebar from './sidebar';
import CreatePost from './create';

// Accept 'activeTab' as a prop
interface PostContentProps {
  activeTab: 'following' | 'foryou';
}

const PostContent: React.FC<PostContentProps> = ({ activeTab }) => {
  const { account } = useActiveWeb3React();
  const [posts, setPosts] = useState<any[]>([]); // State to hold posts
  const [wallets, setWallets] = useState<any[]>([]); // State to hold wallet details
  const router = useRouter();

  const fetchPostsAndWallets = async () => {
    try {
      const postsResponse = await fetch(`${BACKEND_URL}/api/posts`);
      const postsData = await postsResponse.json();
      setPosts(postsData);

      const walletResponse = await fetch(`${BACKEND_URL}/api/wallets-info`);
      const walletData = await walletResponse.json();
      setWallets(walletData.walletDetails);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchPostsAndWallets();
  }, []);

  useEffect(() => {
    const intervalId = setInterval(fetchPostsAndWallets, 2000); // Polling every 10 seconds
    return () => clearInterval(intervalId);
  }, []);

  const handlePostClick = (id: number) => {
    router.push(`/socialfi/post/${id}`);
  };

  const getWalletDetails = (walletAddress: string) => {
    const wallet = wallets.find((w) => w.walletAddress === walletAddress);
    if (wallet) {
      return wallet;
    }
    return { fullName: 'Unknown', username: 'Unknown', avatarUrl: '' };
  };

  const handleLike = async (postId: number) => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/posts/${postId}/likes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ walletAddress: account }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.message === 'Like removed') {
          setPosts((prevPosts) =>
            prevPosts.map((post) =>
              post.id === postId
                ? { ...post, postLikes: post.postLikes.filter((like) => like.walletAddress !== account) }
                : post
            )
          );
        } else {
          setPosts((prevPosts) =>
            prevPosts.map((post) =>
              post.id === postId
                ? { ...post, postLikes: [...post.postLikes, { walletAddress: account }] }
                : post
            )
          );
        }
      } else {
        console.error('Failed to like/unlike the post');
      }
    } catch (error) {
      console.error('Error liking/unliking the post:', error);
    }
  };

  const handleDelete = async (postId: number) => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/posts/${postId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ walletAddress: account }), // Send walletAddress in the body
      });

      if (response.ok) {
        // Update state to remove the post from UI
        setPosts((prevPosts) => prevPosts.filter((post) => post.id !== postId));
      } else {
        console.error('Failed to delete post:', response.statusText);
      }
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };


  const displayTime = (createdAt: string) => {
    const postDate = parseISO(createdAt);
    const daysDifference = Math.abs((new Date().getTime() - postDate.getTime()) / (1000 * 3600 * 24));

    if (daysDifference > 5) {
      // Tampilkan format tanggal jika lebih dari 5 hari
      return format(postDate, 'dd MMM yyyy');
    }

    // Gunakan formatDistanceToNowStrict untuk mendapatkan hasil yang lebih presisi
    const timeAgo = formatDistanceToNowStrict(postDate, { addSuffix: false });

    // Memetakan waktu yang panjang menjadi format singkat: "h", "m", "d"
    const shortTimeAgo = timeAgo
      .replace(' hours', 'h')
      .replace(' hour', 'h')
      .replace(' minutes', 'm')
      .replace(' minute', 'm')
      .replace(' days', 'd')
      .replace(' day', 'd')
      .replace(' seconds', 's')
      .replace(' second', 's');

    return `${shortTimeAgo} ago`;
  };


  return (
    <div className="flex bg-gray-100 justify-center items-start md:p-2">
      <div className="w-full bg-[#f8fafc]" style={{ borderRadius: '10px' }}>
        <div className="max-w-7xl w-full p-2 rounded-lg">
          {Array.isArray(posts) &&
            posts
              .filter((post) => activeTab === 'foryou' || post.following) // Filter posts based on activeTab
              .map((post) => {
                const { username, avatarUrl, fullName } = getWalletDetails(post.walletAddress);
                const hasLiked = post.postLikes?.some((like: any) => like.walletAddress === account);

                return (
                  <div key={post.id} className="mb-2 p-2 space-x-2 bg-white shadow-lg block" style={{ borderRadius: '10px' }}>
                   <div className="flex justify-between">
                    <div className="flex items-center p-2">
                      <a href={post.walletAddress === account ? '/account' : `/account/${post.walletAddress}`} className="flex items-center">
                        <img
                          src={avatarUrl || '/default-avatar.png'}
                          className="w-8 h-8 mr-2 rounded-full bg-gray-200"
                          alt={username}
                        />
                      </a>
                      <div>
                        <a href={post.walletAddress === account ? '/account' : `/account/${post.walletAddress}`} className="items-center text-md font-semibold text-gray-800">
                          {username}
                        </a>
                        <p className="text-xs text-gray-500">{displayTime(post.createdAt)}</p>
                      </div>
                    </div>
                    {post.walletAddress === account && (
                      <div className="flex justify-end">
                        <button
                          onClick={() => handleDelete(post.id)}
                          type="button"
                          className="text-red-500 hover:text-red-700"
                        >
                        <TrashIcon className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                    </div>
                    <div className="px-2 pb-2">
                      <a href={`/socialfi/post/${post.id}`}>
                        <p className="text-gray-600 md:text-lg text-md whitespace-pre-wrap">{post.content}</p>
                        {post.image && (
                          <img
                            src={post.image}
                            className="w-full py-2 pr-4"
                            alt={username}
                            style={{ borderRadius: '20px' }}
                          />
                        )}
                      </a>
                    </div>
                    <div className="flex justify-between py-2 border-gray-100" style={{ borderTop: '1px solid #e5e7eb', borderBottom: '1px solid #e5e7eb' }}>
                      <div className="flex items-center space-x-2">
                        <p className="flex items-center text-[16px] pr-2" style={{ borderRight: '1px solid gray' }}>
                          <button onClick={() => handleLike(post.id)} type="button" className="flex items-center">
                            {hasLiked ? <UpvoteFillIcon className="h-5 w-5 mr-1" /> : <UpvoteIcon className="h-5 w-5 mr-1" />}
                            {post.postLikes?.length || '0'}
                          </button>
                        </p>
                        <p className="flex items-center text-[16px]">
                          <CommentIcon className="h-5 w-5 mr-1 items-center" /> {post.comments.length}
                        </p>
                      </div>
                      <p className="flex items-center text-[16px]">
                        <ShareIcon className="h-5 w-5 mr-1 items-center" /> Share
                      </p>
                    </div>
                  </div>
                );
              })}
        </div>
      </div>
    </div>
  );
};

export default PostContent;
