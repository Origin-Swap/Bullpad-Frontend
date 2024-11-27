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
    <div className="flex justify-center items-start md:p-2">
      <div className="w-full bg-[#f8fafc]" style={{ borderRadius: '10px' }}>
        <div className="max-w-7xl w-full p-2 rounded-lg">
          {Array.isArray(posts) &&
            posts
              .filter((post) => activeTab === 'foryou' || post.following) // Filter posts based on activeTab
              .map((post) => {
                const { username, avatarUrl, fullName } = getWalletDetails(post.walletAddress);
                const hasLiked = post.postLikes?.some((like: any) => like.walletAddress === account);

                return (
                  <div key={post.id} className="flex mb-2 p-2 shadow-sm rounded-xl space-y-2 bg-white md:flex-row md:space-y-0 md:space-x-2" style={{ borderBottom: '2px solid #f3f4f6' }}>
                    <div className="md:w-1/12 w-2/14">
                      <a href={post.walletAddress === account ? '/account' : `/account/${post.walletAddress}`} className="flex items-center">
                        <img
                          src={avatarUrl || '/default-avatar.png'}
                          className="w-10 h-10 rounded-full mr-2 md:mr-0 bg-gray-200"
                          alt={username}
                        />
                      </a>
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div className="flex items-center">
                          <a href={post.walletAddress === account ? '/account' : `/account/${post.walletAddress}`} className="text-md font-semibold text-gray-800">
                            {username}
                          </a>
                          <p className="text-xs px-2 text-gray-500">~</p>
                          <p className="text-sm text-gray-500">{displayTime(post.createdAt)}</p>
                        </div>
                        {post.walletAddress === account && (
                          <button
                            onClick={() => handleDelete(post.id)}
                            type="button"
                            className="text-red-500 hover:text-red-700 md:ml-2"
                          >
                            <TrashIcon className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                      <div className="py-2">
                        <a href={`/socialfi/post/${post.id}`}>
                          <p className="text-gray-600 text-md whitespace-pre-wrap">{post.content}</p>
                          {post.image && (
                            <img
                              src={post.image}
                              className="w-full py-2"
                              alt={username}
                              style={{ borderRadius: '20px' }}
                            />
                          )}
                        </a>
                      </div>
                      <div className="flex justify-between items-center border-gray-100 md:flex-row md:space-x-2">
                        <div className="flex items-center space-x-2 mt-2 md:mt-0">
                        <a href={`/socialfi/post/${post.id}`}>
                          <p className="flex items-center text-[16px]">
                            <CommentIcon className="h-4 w-4 mr-1" /> {post.comments.length}
                          </p>
                        </a>
                          <button onClick={() => handleLike(post.id)} type="button" className="flex items-center">
                            {hasLiked ? <UpvoteFillIcon className="h-4 w-4 mr-1" /> : <UpvoteIcon className="h-4 w-4 mr-1" />}
                            {post.postLikes?.length || '0'}
                          </button>
                        </div>
                        <p className="flex items-center text-[16px] md:order-2 order-1">
                          <ShareIcon className="h-4 w-4 mr-1" /> Share
                        </p>
                      </div>
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
