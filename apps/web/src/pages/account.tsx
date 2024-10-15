import Account from '../views/Account/Profile'

const AccountPage = () => {
  const bannerUrl = "https://example.com/banner.jpg";
  const avatarUrl = "https://example.com/avatar.jpg";
  const username = "John Doe";
  const followers = 1000;
  const following = 150;

  return (
    <>
      <Account
        bannerUrl={bannerUrl}
        avatarUrl={avatarUrl}
        username={username}
        followers={followers}
        following={following}
      />
    </>
  );
}

export default AccountPage;
