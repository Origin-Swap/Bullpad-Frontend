import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import useActiveWeb3React from 'hooks/useActiveWeb3React';
import { BACKEND_URL } from 'config/constants/backendApi';
import { format, parseISO, formatDistanceToNowStrict } from 'date-fns';
import Sidebar from 'views/MediaSocial/components/post/sidebar';
import UpvoteIcon from './svgs/upVote';
import UpvoteFillIcon from './svgs/hasVote';
import CommentIcon from './svgs/comment';
import ShareIcon from './svgs/share';
import CommentForm from './Comments/CommentForm';
import CommentList from './Comments/CommentList';

const PostDetail = () => {
  const { account } = useActiveWeb3React();
  const router = useRouter();
  const { id } = router.query; // Ambil post ID dari URL
  const [post, setPost] = useState<any>(null); // State untuk menyimpan post spesifik
  const [wallets, setWallets] = useState<any[]>([]); // State untuk menyimpan wallet detail
  const [hasLiked, setHasLiked] = useState(false); // State untuk menyimpan status like
  const [comments, setComments] = useState<any[]>([]);
  const [showCommentForm, setShowCommentForm] = useState(false);

  useEffect(() => {
    // Fetch data post dan wallet dari API
    const fetchPostAndWallet = async () => {
      try {
        // Fetch post berdasarkan ID dari URL
        const postResponse = await fetch(`${BACKEND_URL}/api/posts/${id}`);
        const postData = await postResponse.json();
        setPost(postData);

        // Cek apakah user sudah melakukan like
        setHasLiked(postData.postLikes?.some((like: any) => like.walletAddress === account));

        // Fetch wallet info
        const walletResponse = await fetch(`${BACKEND_URL}/api/wallets-info`);
        const walletData = await walletResponse.json();
        setWallets(walletData.walletDetails); // Set wallet details dari API
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    if (id) {
      fetchPostAndWallet();
    }
  }, [id, account]);

  // Fungsi untuk mendapatkan detail wallet (username, avatar) dari walletAddress
  const getWalletDetails = (walletAddress: string) => {
    const wallet = wallets.find((w) => w.walletAddress === walletAddress);
    return wallet || { fullName: 'Unknown', username: 'Unknown', avatarUrl: '' }; // Return default values if no match found
  };

  if (!post) {
    return <p>Loading...</p>;
  }

  // Fungsi untuk melakukan like/unlike pada post
  const handleLike = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/posts/${id}/likes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ walletAddress: account }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.message === 'Like removed') {
          setHasLiked(false); // Jika like dihapus
        } else {
          setHasLiked(true); // Jika like ditambahkan
        }
      } else {
        console.error('Failed to like/unlike the post');
      }
    } catch (error) {
      console.error('Error liking/unliking the post:', error);
    }
  };

  const { username, avatarUrl } = getWalletDetails(post.walletAddress);

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

  const refreshComments = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/posts/${id}/comments`);
      const data = await response.json();
      setComments(data);
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  const toggleCommentForm = () => {
   setShowCommentForm((prev) => !prev); // Tampilkan atau sembunyikan CommentForm
 };


  return (
    <div className="flex flex-col md:flex-row">
      <div className="w-full md:w-7/12 md:px-4 p-2 m-2 rounded-xl" style={{border: '1px solid #e2e8f0'}}>
        <button
          className="px-2 pb-4 text-blue-500"
          onClick={() => router.push('/socialfi')}
          type="button"
          tabIndex={0}
          onKeyDown={(e) => (e.key === 'Enter' ? router.push('/socialfi') : null)}
        >
          . . . Back To Feeds
        </button>
        <div style={{borderRadius: '10px' }}>
          <div className="p-4">
            <div className="flex items-center">
              <img
                src={avatarUrl || '/default-avatar.png'}
                className="w-8 h-8 mr-2 rounded-full bg-gray-200"
                alt={username}
              />
              <div>
                <p className="text-md font-semibold text-gray-800">{username}</p>
                <p className="text-xs text-gray-500">{post.createAt}</p>
              </div>
            </div>
            <p className="py-2 text-md md:text-md whitespace-pre-wrap">{post.content}</p>
            {post.image && (
              <img
                src={post.image}
                className="w-full py-1 rounded-3xl"
                alt={username}
              />
            )}
            <p className="text-sm pt-2 text-gray-500">{displayTime(post.createdAt)}</p>
          </div>
          <div className="flex px-4 justify-between py-2" style={{ borderTop: '1px solid gray', borderBottom: '1px solid gray' }}>
            <div className="flex items-center space-x-2" >
              <p
                className="flex items-center text-[16px] pr-2"
                style={{ borderRight: '1px solid gray' }}
              >
                <button onClick={handleLike} type="button" className="flex items-center">
                  {hasLiked ? (
                    <UpvoteFillIcon className="h-5 w-5 mr-1" />
                  ) : (
                    <UpvoteIcon className="h-5 w-5 mr-1" />
                  )}
                  {post.postLikes?.length || '0'}
                </button>
              </p>
              <p className="flex items-center text-[16px]">
                <button onClick={toggleCommentForm} type="button" className="flex items-center">
                  <CommentIcon className="h-5 w-5 mr-1 items-center" /> {post.comments.length}
                </button>
              </p>
            </div>
            <ShareIcon className="h-5 w-5 mr-1 items-center" />
          </div>
        </div>
        {showCommentForm && (
          <CommentForm postId={Number(id)} onCommentAdded={refreshComments} />
        )}
      <CommentList
      postId={Number(id)}
      />
      </div>
      <div className="md:w-5/12 w-full md:block hidden">
        <div className="sticky top-4">
          <Sidebar />
        </div>
      </div>
    </div>
  );
};

export default PostDetail;
