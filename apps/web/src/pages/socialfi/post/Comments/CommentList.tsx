import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { format, parseISO, formatDistanceToNowStrict } from 'date-fns';
import { BACKEND_URL } from 'config/constants/backendApi';

interface Comment {
  id: number;
  content: string;
  walletAddress: string;
  createdAt: string;  // Pastikan 'createdAt' ada di interface
  user: {
    username: string;
    avatarUrl: string;
    fullName: string;
  };
}

interface CommentListProps {
  postId: number;
}

const CommentList: React.FC<CommentListProps> = ({ postId }) => {
  const router = useRouter();
  const { id } = router.query;
  const [comments, setComments] = useState<Comment[]>([]);
  const [visibleComments, setVisibleComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [commentsToShow, setCommentsToShow] = useState(10); // Jumlah awal komentar yang ditampilkan

  // Fungsi untuk fetch data komentar
  const fetchComments = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/posts/${id}`);
      const data = await response.json();
      const sortedComments = data.comments.sort((a: Comment, b: Comment) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      setComments(sortedComments);
      setVisibleComments(sortedComments.slice(0, commentsToShow)); // Tampilkan 10 pertama
    } catch (error) {
      console.error('Error fetching comments:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();

    // Polling setiap 10 detik untuk mendapatkan komentar terbaru
    const intervalId = setInterval(fetchComments, 2000); // 10 detik

    return () => clearInterval(intervalId);
  }, [postId, commentsToShow]);

  const loadMoreComments = () => {
    setCommentsToShow((prev) => prev + 10); // Tambah 10 komentar lagi
    setVisibleComments(comments.slice(0, commentsToShow + 10)); // Update komentar yang ditampilkan
  };

  const displayTime = (createdAt: string) => {
    const postDate = parseISO(createdAt);
    const daysDifference = Math.abs((new Date().getTime() - postDate.getTime()) / (1000 * 3600 * 24));

    if (daysDifference > 5) {
      return format(postDate, 'dd MMM yyyy');
    }
    const timeAgo = formatDistanceToNowStrict(postDate, { addSuffix: false });
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


  if (loading) {
    return <p>Loading comments...</p>;
  }

  if (!comments || comments.length === 0) {
    return <p className="py-6 text-center">No comments yet. Be the first to comment!</p>;
  }

  return (
    <div className="mt-1 space-y-2">
      {visibleComments.map((comment) => (
        <div key={comment.id} className="p-4 bg-gray-100 rounded-lg shadow-lg">
          <div className="flex items-center mb-2">
            <img
              src={comment.user.avatarUrl}
              alt={comment.user.username}
              className="w-10 h-10 rounded-full"
            />
            <div className="ml-3">
              <p className="font-bold">{comment.user.username}</p>
              <p className="text-sm text-gray-500">{displayTime(comment.createdAt)}</p>
            </div>
          </div>
          <p className="p-2">{comment.content}</p>
        </div>
      ))}

      {commentsToShow < comments.length && (
        <div className="flex justify-center">
          <button
            type="button"
            onClick={loadMoreComments}
            className="px-4 py-2 mt-4 text-white bg-blue-600 rounded-lg hover:bg-blue-700"
          >
            Load More
          </button>
        </div>
      )}
    </div>
  );
};

export default CommentList;
