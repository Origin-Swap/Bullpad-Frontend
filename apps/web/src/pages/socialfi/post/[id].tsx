import { useRouter } from 'next/router';
import React from 'react';
import UpvoteIcon from './svgs/upVote';
import DownvoteIcon from './svgs/downVote';
import CommentIcon from './svgs/comment';
import ShareIcon from './svgs/share';

const posts = [
  {
    id: 1,
    image: '/images/help1.png',
    title: 'Exploring the Future of SocialFi',
    content: 'SocialFi is a rapidly growing trend in decentralized finance (DeFi) that leverages social media platforms.',
    username: 'John Doe',
    date: 'October 14, 2024',
  },
  {
    id: 2,
    image: '/images/help1.png',
    title: 'How to Get Started with SocialFi',
    content: 'In this post, we will explore how to start using SocialFi platforms and what you need to know.',
    username: 'Jane Smith',
    date: 'October 13, 2024',
  },
  {
    id: 3,
    image: '/images/help1.png',
    title: 'Top 5 SocialFi Projects to Watch in 2024',
    content: 'Here are the top 5 SocialFi projects making waves in the industry this year.',
    username: 'Alice Johnson',
    date: 'October 12, 2024',
  },
  {
    id: 4,
    image: '/images/help1.png',
    title: 'How to Get Started with SocialFi',
    content: 'In this post, we will explore how to start using SocialFi platforms and what you need to know.',
    username: 'Jane Smith',
    date: 'October 13, 2024',
  },
  {
    id: 5,
    image: '/images/help1.png',
    title: 'Top 5 SocialFi Projects to Watch in 2024',
    content: 'Here are the top 5 SocialFi projects making waves in the industry this year.',
    username: 'Alice Johnson',
    date: 'October 12, 2024',
  },
];

const PostDetail = () => {
  const router = useRouter();
  const { id } = router.query; // Get post ID from URL

  const post = posts.find((p) => p.id === parseInt(id as string)); // Find post by ID

  if (!post) {
    return <p>Post not found.</p>;
  }

  // Function to go back to the list of posts
  const goBackToPosts = () => {
    router.push('/socialfi'); // Change this to your post list page path
  };

  return (
    <div className="w-full md:w-7/12 md:p-4 p-2 m-2">
      {/* Changed <p> to <button> to make it interactive */}
      <button
        className="px-2 pb-4 text-blue-500"
        onClick={goBackToPosts}
        type="button"
        tabIndex={0}
        onKeyDown={(e) => (e.key === 'Enter' ? goBackToPosts() : null)} // Support keyboard events
      >
        . . . Back To Feeds
      </button>
      <div style={{ border: '1px solid gray', borderRadius: '20px' }}>
        <div className="p-4">
          <div className="flex items-center p-2">
            <img
              src={post.image}
              className="w-10 h-10 mr-2 rounded-lg bg-gray-200"
              alt={post.title}
            />
            <div>
              <p className="text-xl font-semibold text-gray-800">{post.username}</p>
              <p className="text-xs text-gray-500">{post.date}</p>
            </div>
          </div>
          <p className="py-4">{post.content}</p>
          <p className="text-sm text-gray-500">{post.date}</p>
        </div>
        <div className="flex px-4 justify-between mb-4">
          <div className="flex items-center space-x-2">
            <p className="flex items-center text-[16px] pr-2" style={{ borderRight: '1px solid gray' }}>
              <UpvoteIcon className="h-5 w-5 mr-1 items-center" /> 0
            </p>
            <p className="flex items-center text-[16px] pr-2" style={{ borderRight: '1px solid gray' }}>
              <DownvoteIcon className="h-5 w-5 mr-1 items-center" /> 0
            </p>
            <p className="flex items-center text-[16px]">
              <CommentIcon className="h-5 w-5 mr-1 items-center" /> 0
            </p>
          </div>
          <ShareIcon className="h-5 w-5 mr-1 items-center" />
        </div>
      </div>
    </div>
  );
};

export default PostDetail;
