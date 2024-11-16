import React, { useState, useEffect } from 'react';
import axios from 'axios';
import useActiveWeb3React from 'hooks/useActiveWeb3React';
import { BACKEND_URL } from 'config/constants/backendApi';

interface User {
  username?: string;
  email?: string;
  fullName?: string;
  telegram?: string;
  website?: string;
  twitter?: string;
  discord?: string;
  instagram?: string;
}

interface EditProfileProps {
  user?: User;
}

const EditProfile: React.FC<EditProfileProps> = ({ user = {} }) => {
  const { account } = useActiveWeb3React();
  const walletAddress = account;

  const [username, setUsername] = useState(user.username || '');
  const [email, setEmail] = useState(user.email || '');
  const [fullName, setFullName] = useState(user.fullName || '');
  const [telegram, setTelegram] = useState(user.telegram || '');
  const [website, setWebsite] = useState(user.website || '');
  const [twitter, setTwitter] = useState(user.twitter || '');
  const [discord, setDiscord] = useState(user.discord || '');
  const [instagram, setInstagram] = useState(user.instagram || '');
  const [avatar, setAvatar] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  useEffect(() => {
    if (user.username) setUsername(user.username);
    if (user.email) setEmail(user.email);
    if (user.fullName) setFullName(user.fullName);
    if (user.telegram) setTelegram(user.telegram);
    if (user.website) setWebsite(user.website);
    if (user.twitter) setTwitter(user.twitter);
    if (user.discord) setDiscord(user.discord);
    if (user.instagram) setInstagram(user.instagram);
  }, [user]);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    if (file) {
      setAvatar(file);
      setAvatarPreview(URL.createObjectURL(file));
    } else {
      setAvatar(null);
      setAvatarPreview(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    if (avatar) formData.append("avatar", avatar);
    formData.append("walletAddress", walletAddress);
    formData.append("username", username);
    formData.append("email", email);
    formData.append("fullName", fullName);
    formData.append("telegram", telegram);
    formData.append("website", website);
    formData.append("twitter", twitter);
    formData.append("discord", discord);
    formData.append("instagram", instagram);

    try {
      const response = await axios.post(`${BACKEND_URL}/api/users`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'X-Requested-With': 'XMLHttpRequest'
        },
      });
      console.log(response.data);
    } catch (error: any) {
      console.error('Error:', error.response?.data);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-lg mx-auto p-8 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-semibold mb-6">Edit Profile</h2>

      <div className="mb-4">
        <label htmlFor="avatar" className="block text-sm font-medium text-gray-700 mb-1">Avatar</label>
        <input
          id="avatar"
          type="file"
          accept="image/*"
          onChange={handleAvatarChange}
          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200"
        />
        {avatarPreview && (
          <img
            src={avatarPreview}
            alt="Avatar Preview"
            className="mt-4 rounded-full w-24 h-24 object-cover"
          />
        )}
      </div>

      <div className="mb-4">
        <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">Username</label>
        <input
          id="username"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
          className="w-full px-4 py-2 border rounded-md focus:ring-blue-500"
        />
      </div>

      <div className="mb-4">
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="w-full px-4 py-2 border rounded-md focus:ring-blue-500"
        />
      </div>

      {/* <div className="mb-4">
        <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
        <input
          id="fullName"
          type="text"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          placeholder="Full Name"
          className="w-full px-4 py-2 border rounded-md focus:ring-blue-500"
        />
      </div> */}

      <div className="mb-4">
        <label htmlFor="telegram" className="block text-sm font-medium text-gray-700 mb-1">Telegram</label>
        <input
        id="telegram"
          type="text"
          value={telegram}
          onChange={(e) => setTelegram(e.target.value)}
          placeholder="Telegram"
          className="w-full px-4 py-2 border rounded-md focus:ring-blue-500"
        />
      </div>

      <div className="mb-4">
        <label htmlFor="website" className="block text-sm font-medium text-gray-700 mb-1">Website</label>
        <input
          id="website"
          type="text"
          value={website}
          onChange={(e) => setWebsite(e.target.value)}
          placeholder="Website"
          className="w-full px-4 py-2 border rounded-md focus:ring-blue-500"
        />
      </div>

      <div className="mb-4">
        <label htmlFor="twitter" className="block text-sm font-medium text-gray-700 mb-1">Twitter</label>
        <input
          id="twitter"
          type="text"
          value={twitter}
          onChange={(e) => setTwitter(e.target.value)}
          placeholder="Twitter"
          className="w-full px-4 py-2 border rounded-md focus:ring-blue-500"
        />
      </div>

      <div className="mb-4">
        <label htmlFor="discord" className="block text-sm font-medium text-gray-700 mb-1">Discord</label>
        <input
          id="discord"
          type="text"
          value={discord}
          onChange={(e) => setDiscord(e.target.value)}
          placeholder="Discord"
          className="w-full px-4 py-2 border rounded-md focus:ring-blue-500"
        />
      </div>

      <div className="mb-4">
        <label htmlFor="instagram" className="block text-sm font-medium text-gray-700 mb-1">Instagram</label>
        <input
          id="instagram"
          type="text"
          value={instagram}
          onChange={(e) => setInstagram(e.target.value)}
          placeholder="Instagram"
          className="w-full px-4 py-2 border rounded-md focus:ring-blue-500"
        />
      </div>

      <button
        type="submit"
        className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition-colors"
      >
        Update Profile
      </button>
    </form>
  );
};

export default EditProfile;
