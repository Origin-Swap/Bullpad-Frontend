import React from 'react';
import { useRouter } from 'next/router';
import UpvoteIcon from './svgs/upVote';
import DownvoteIcon from './svgs/downVote';
import CommentIcon from './svgs/comment';
import ShareIcon from './svgs/share';
import Sidebar from './sidebar'

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

const PostContent = () => {
  const router = useRouter();

  const handlePostClick = (id: number) => {
    router.push(`/socialfi/post/${id}`);
  };

  return (
    <div className="flex bg-gray-100 justify-center items-start md:p-2">
      <div className="md:w-7/12 w-full bg-[#f8fafc]" style={{borderRadius: '10px'}}>
        <div className="max-w-7xl w-full p-2 rounded-lg">
          {posts.map((post) => (
            <a
              key={post.id}
              href={`/socialfi/post/${post.id}`}  // Use href for navigation
              className="mb-2 p-2 space-x-2 bg-white shadow-lg block"  // block makes it act like a div
              style={{ borderRadius: '10px'}}
            >
              <div className="flex items-center p-2">
                <img src={post.image} className="w-10 h-10 mr-2 rounded-lg bg-gray-200" alt={post.title} />
                <div>
                  <p className="text-xl font-semibold text-gray-800">{post.username}</p>
                  <p className="text-xs text-gray-500">{post.date}</p>
                </div>
              </div>
              <h2 className="text-xl font-semibold text-gray-800">{post.title}</h2>
              <p className="text-gray-600 mt-1 pb-4">{post.content}</p>
              <div className="flex justify-between">
                <div className="flex items-center space-x-2">
                  <p className="flex items-center text-[16px] pr-2" style={{borderRight: '1px solid gray'}}>
                    <UpvoteIcon className="h-5 w-5 mr-1 items-center"/> 0
                  </p>
                  <p className="flex items-center text-[16px] pr-2" style={{borderRight: '1px solid gray'}}>
                    <DownvoteIcon className="h-5 w-5 mr-1 items-center"/> 0
                  </p>
                  <p className="flex items-center text-[16px]">
                    <CommentIcon className="h-5 w-5 mr-1 items-center"/> 0
                  </p>
                </div>
                <p className="flex items-center text-[16px]">
                  <ShareIcon className="h-5 w-5 mr-1 items-center"/> Share
                </p>
              </div>
            </a>
          ))}
        </div>
      </div>
      <div className="md:w-5/12 w-full md:block hidden">
        <div className="sticky top-4">
          <Sidebar />
        </div>
      </div>
    </div>
  );
};

export default PostContent;
