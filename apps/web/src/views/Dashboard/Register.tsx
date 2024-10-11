import React, { useState } from 'react';
import axios from 'axios';
import useActiveWeb3React from 'hooks/useActiveWeb3React';
import styled from 'styled-components';
import { BACKEND_URL } from 'config/constants/backendApi';

// Membuat styled-components
const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 80vh;
  background-color: #f7fafc; /* bg-gray-100 */
`;

const FormContainer = styled.div`
  background-color: white;
  padding: 32px; /* p-8 */
  border-radius: 8px; /* rounded */
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); /* shadow-md */
  width: 100%;
  max-width: 400px; /* max-w-md */
`;

const Title = styled.h2`
  font-size: 24px; /* text-2xl */
  font-weight: bold; /* font-bold */
  text-align: center;
  margin-bottom: 24px; /* mb-6 */
`;

const ErrorMessage = styled.p`
  color: red; /* text-red-500 */
  margin-bottom: 16px; /* mb-4 */
`;

const SuccessMessage = styled.p`
  color: green; /* text-green-500 */
  margin-bottom: 16px; /* mb-4 */
`;

const Label = styled.label`
  display: block;
  paddin-top: 20px:
  color: #4a5568; /* text-gray-700 */
  font-size: 14px; /* text-sm */
  font-weight: bold; /* font-bold */
  margin-bottom: 8px; /* mb-2 */
`;

const Input = styled.input`
  width: 100%;
  padding: 8px; /* px-3 py-2 */
  border: 1px solid #cbd5e0; /* border */
  border-radius: 8px; /* rounded-lg */
  outline: none;
  transition: border-color 0.3s, box-shadow 0.3s;

  &:focus {
    border-color: #3182ce; /* focus:ring-blue-500 */
    box-shadow: 0 0 0 2px rgba(66, 153, 225, 0.6); /* focus:ring-2 */
  }
`;

const Button = styled.button`
  width: 100%;
  background-color: #4299e1; /* bg-blue-500 */
  color: white; /* text-white */
  padding: 12px; /* py-2 */
  border-radius: 8px; /* rounded-lg */
  transition: background-color 0.3s;

  &:hover {
    background-color: #3182ce; /* hover:bg-blue-600 */
  }
`;

const Register: React.FC = () => {
  const { account, chainId, chain } = useActiveWeb3React();
  const [walletAddress, setWalletAddress] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Fungsi untuk meng-handle form submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent form reload

    // Data yang akan dikirim ke API
    const userData = {
      walletAddress: account,
      username,
      email,
    };

    try {
      // Kirim data ke backend menggunakan axios
      const response = await axios.post(`${BACKEND_URL}/api/users`, userData);

      // Jika berhasil, set success message
      setSuccess('Register success!!');
      setError(''); // Kosongkan error message
    } catch (err) {
      // Jika ada error, tampilkan pesan error
      setError('Failed to register. please try again');
      setSuccess(''); // Kosongkan success message
    }
  };

  return (
    <Wrapper>
      <FormContainer>
        <Title>Register</Title>

        {error && <ErrorMessage>{error}</ErrorMessage>}
        {success && <SuccessMessage>{success}</SuccessMessage>}

        <form onSubmit={handleSubmit}>

          <div>
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div style={{ paddingTop: '20px', paddingBottom: '20px' }}>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <Button type="submit">Register</Button>
          </div>
        </form>
      </FormContainer>
    </Wrapper>
  );
};

export default Register;
