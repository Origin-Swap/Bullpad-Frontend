import React, { useEffect, useState } from 'react';
import useActiveWeb3React from 'hooks/useActiveWeb3React';
import { parseISO, formatDistanceToNowStrict } from 'date-fns';
import { BACKEND_URL } from 'config/constants/backendApi';

interface Comment {
  id: number;
  content: string;
  parentCommentId?: number;
  walletAddress: string;
  createdAt: string;
  user: {
    username: string;
    avatarUrl: string;
  };
  replies?: Comment[];
}

interface NestedCommentListProps {
  postId: number;
}

const NestedCommentList: React.FC<NestedCommentListProps> = ({ postId }) => {
  const { account } = useActiveWeb3React();
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [replyingTo, setReplyingTo] = useState<number | null>(null);
  const [replyContent, setReplyContent] = useState<string>('');

  const fetchComments = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/posts/${postId}`);
      const data = await response.json();

      const commentsMap: { [key: number]: Comment } = {};
      data.comments.forEach((comment: Comment) => {
        commentsMap[comment.id] = { ...comment, replies: [] };
      });

      const nestedComments: Comment[] = [];
      data.comments.forEach((comment: Comment) => {
        if (comment.parentCommentId) {
          commentsMap[comment.parentCommentId].replies?.push(commentsMap[comment.id]);
        } else {
          nestedComments.push(commentsMap[comment.id]);
        }
      });

      setComments(nestedComments);
    } catch (error) {
      console.error('Error fetching comments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleReplySubmit = async (parentCommentId: number) => {
    try {
      const response = await fetch(`${BACKEND_URL}/posts/${postId}/comments/${parentCommentId}/reply`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: replyContent,
          walletAddress: account,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to post reply');
      }

      fetchComments();
      setReplyingTo(null);
      setReplyContent('');
    } catch (error) {
      console.error('Error posting reply:', error);
    }
  };

  const displayTime = (createdAt: string) => {
    const postDate = parseISO(createdAt);
    return `${formatDistanceToNowStrict(postDate).replace(' hour', 'h').replace(' minutes', 'm')} ago`;
  };

  const renderComments = (commentList: Comment[]) => {
    return commentList.map((comment) => (
      <div key={comment.id} className="p-2 bg-[#f8fafc] rounded-lg mt-1" style={{ borderBottom: '1px solid #e2e8f0' }}>
        <div className="flex items-center mb-2">
          <img
            src={comment.user.avatarUrl}
            alt={comment.user.username}
            className="w-8 h-8 rounded-full"
          />
          <div className="ml-3 flex justify-between items-center">
            <p className="font-semibold ">{comment.user.username}</p>
            <p className="text-xs px-2 text-gray-500">~</p>
            <p className="text-sm text-gray-500">{displayTime(comment.createdAt)}</p>
          </div>
        </div>
        <p className="pt-2 pb-1 text-sm">{comment.content}</p>

        {/* <button
          onClick={() => setReplyingTo(comment.id)}
          className="text-blue-500 text-sm font-semibold mt-2"
          type="button"
        >
          Reply
        </button>

        {replyingTo === comment.id && (
          <div className="mt-2 ml-4">
            <textarea
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              placeholder="Write your reply..."
              className="w-full p-2 border border-gray-300 rounded"
            />
            <button
              onClick={() => handleReplySubmit(comment.id)}
              className="mt-2 bg-blue-500 text-white px-4 py-2 rounded"
              type="button"
            >
              Submit
            </button>
            <button
              onClick={() => setReplyingTo(null)}
              className="ml-2 text-gray-500 text-sm"
              type="button"
            >
              Cancel
            </button>
          </div>
        )}

        {comment.replies && comment.replies.length > 0 && (
          <div className="ml-8 mt-2">
            {renderComments(comment.replies)}
          </div>
        )} */}
      </div>
    ));
  };

  useEffect(() => {
    fetchComments();
  }, [postId]);

  if (loading) {
    return <p>Loading comments...</p>;
  }

  if (comments.length === 0) {
    return <p className="text-center">No comments yet. Be the first to comment!</p>;
  }

  return <div>{renderComments(comments)}</div>;
};

export default NestedCommentList;
