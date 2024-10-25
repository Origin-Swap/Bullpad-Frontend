import { useRouter } from 'next/router';
import Account from 'views/Account/User';

const AccountPage = () => {
  const router = useRouter();
  const { walletAddress } = router.query; // Get the wallet address from the route parameter

  // Default values or data fetching could be implemented here
  const bannerUrl = "https://example.com/banner.jpg";
  const avatarUrl = "https://example.com/avatar.jpg";
  const username = "John Doe";
  const followers = 1000;
  const following = 150;

  // Ensure walletAddress is a string
  const walletAddressString = Array.isArray(walletAddress) ? walletAddress[0] : walletAddress;

  return (
    <>
      <Account
        bannerUrl={bannerUrl}
        avatarUrl={avatarUrl}
        username={username}
        followers={followers}
        following={following}
        walletAddress={walletAddressString} // Pass the walletAddress as a string
      />
    </>
  );
}

export default AccountPage;
