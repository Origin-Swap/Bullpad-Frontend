import React, { useState, useCallback, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import useActiveWeb3React from 'hooks/useActiveWeb3React';
import { BACKEND_URL } from 'config/constants/backendApi';
import UploadIcon from './Upload'; // Import Font Awesome icon
import CloseIcon from './Close'; // Import the close icon

const CreatePost = () => {
  const { account } = useActiveWeb3React();
  const [content, setContent] = useState('');
  const [image, setImage] = useState<File | null>(null); // Store uploaded image file
  const [preview, setPreview] = useState<string | null>(null); // Preview image URL
  const [userData, setUserData] = useState<{
    username?: string;
    avatarUrl?: string;
  }>({
    username: '',
    avatarUrl: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false); // State untuk blokir klik berulang
  const router = useRouter();

  const fetchUserData = useCallback(async (): Promise<void> => {
    if (!account) return;

    try {
      const response = await axios.put(`${BACKEND_URL}/api/users/${account}`, {
        headers: {
          'X-Requested-With': 'XMLHttpRequest',
        },
      });

      const { username, avatarUrl, ...rest } = response.data;
      setUserData({
        ...rest,
        username,
        avatarUrl,
      });
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  }, [account]);

  useEffect(() => {
    fetchUserData();
    const intervalId = setInterval(fetchUserData, 5000);
    return () => clearInterval(intervalId);
  }, [fetchUserData]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);

      // Create image preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setImage(null);
    setPreview(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isSubmitting) return; // Jika sedang submit, blokir klik berulang

    if (!userData) {
      console.log('Loading user data, please wait...');
      return;
    }

    setIsSubmitting(true); // Set state untuk mengindikasikan sedang submit

    try {
      const formData = new FormData();
      formData.append('content', content);
      formData.append('walletAddress', account ?? '');
      if (image) {
        formData.append('image', image);
      }

      const response = await axios.post(`${BACKEND_URL}/api/posts`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status === 200) {
        alert('Post created successfully!'); // Menampilkan alert setelah post berhasil
        setContent(''); // Reset form
        setImage(null);
        setPreview(null);
        router.push('/socialfi');
      }
    } catch (error) {
      console.error('Error creating post:', error);
      alert('Failed to create post');
    } finally {
      setIsSubmitting(false); // Kembalikan state setelah proses selesai
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);

    const target = e.target;
    target.style.height = 'auto';
    target.style.height = `${target.scrollHeight}px`;
  };

  return (
    <div className="mx-auto p-4 bg-white rounded-xl shadow-lg">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex items-center">
          <img
            src={
              userData.avatarUrl ||
              'https://img.freepik.com/free-psd/3d-illustration-person-with-sunglasses_23-2149436188.jpg?size=338&ext=jpg&ga=GA1.1.2113030492.1729123200&semt=ais_hybrid'
            }
            className="w-10 h-10 rounded-full"
            alt="User Avatar"
          />
          <p className="ml-2 items-center text-xl font-bold">{userData.username}</p>
        </div>
        <div>
          <textarea
            value={content}
            onChange={handleInputChange}
            required
            className="w-full p-2 border rounded-xl overflow-hidden resize-none"
            placeholder="Write your post content here..."
            rows={1}
            style={{ minHeight: '40px' }}
          />
        </div>
        {preview && (
          <div className="relative mt-1">
            <img src={preview} alt="Preview" className="w-full rounded-xl" />
            <button
              type="button"
              onClick={handleRemoveImage}
              className="absolute top-2 right-2 rounded-full p-1"
            >
              <CloseIcon className="text-xl" />
            </button>
          </div>
        )}
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <UploadIcon
              className="w-6 h-6 ml-2"
              onClick={() => document.getElementById('image-upload')?.click()}
            />
            <input
              id="image-upload"
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
          </div>
          <div>
            <button
              type="submit"
              className={`text-black border-2 border-gray-300 px-4 py-2 rounded-xl ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Posting...' : 'Post'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CreatePost;
