import { useState } from 'react';
import { useRouter } from 'next/router';
import useActiveWeb3React from 'hooks/useActiveWeb3React';
import { BACKEND_URL } from 'config/constants/backendApi';

interface CommentFormProps {
  postId: number;
  onCommentAdded: () => void;  // Callback after comment is added
}

const CommentForm: React.FC<CommentFormProps> = ({ postId, onCommentAdded }) => {
  const router = useRouter();
  const { id } = router.query;
  const { account } = useActiveWeb3React();
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch(`${BACKEND_URL}/api/posts/${id}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content, walletAddress: account }),
      });

      if (response.ok) {
        setContent('');
        onCommentAdded(); // Refresh comments
      }
    } catch (error) {
      console.error('Error adding comment:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
  <div className="py-2 rounded-lg">
    <form onSubmit={handleSubmit}>
     <div className="flex p-2">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="w-full p-2 border rounded-lg focus:outline-none mr-2"
        rows={1}
        placeholder="Write a comment..."
        required
      />
      <button
        type="submit"
        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Submitting...' : 'Sent'}
      </button>
      </div>
    </form>
    </div>
  );
};

export default CommentForm;
