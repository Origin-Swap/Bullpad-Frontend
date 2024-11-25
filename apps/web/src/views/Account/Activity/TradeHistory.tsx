import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { BACKEND_URL } from 'config/constants/backendApi';
import useActiveWeb3React from 'hooks/useActiveWeb3React';

const useUserData = () => {
  const { account } = useActiveWeb3React();
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchUserData = useCallback(async (): Promise<void> => {
    if (!account) return;
    try {
      const response = await axios.put(`${BACKEND_URL}/api/users/${account}`, {
        headers: {
          'X-Requested-With': 'XMLHttpRequest',
        },
      });
      setUserData(response.data);
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false);
    }
  }, [account]);

  useEffect(() => {
    fetchUserData();
    const intervalId = setInterval(fetchUserData, 5000);
    return () => clearInterval(intervalId);
  }, [fetchUserData]);

  const userAccountData = userData;


  return (
    <div>
      <div className="border rounded-lg py-2">
        <div>
          <div className="text-sm">Last 5 Trading Transactions</div>
          {userAccountData && userAccountData.lastTransactions && userAccountData.lastTransactions.length > 0 ? (
            <div className="grid grid-cols-3 gap-y-2 mt-4 border border-gray-100">
              {/* Column Headers */}
              <div className="font-semibold px-2" >Swap</div>
              <div className="font-semibold" >Received</div>
              <div className="font-semibold" >TX Hash</div>

              {userAccountData.lastTransactions.map((transaction: any) => (
                <React.Fragment key={transaction.txhash}> {/* Use a unique identifier here */}
                  <p className="text-sm bg-blue-200 py-1 px-2 rounded-l-lg" >
                    {transaction.amount1} {transaction.fromCurrency}
                  </p>
                  <p className="text-sm bg-blue-200 py-1" >
                    {transaction.amount2} {transaction.toCurrency}
                  </p>
                  <p className="text-sm bg-blue-200 py-1 rounded-r-lg">
                    <a
                      href={`https://testnet.5irescan.io/tx/${transaction.txhash}`} // Change URL if you are using another explorer
                      target="_blank" // Opens in a new tab
                      rel="noopener noreferrer" // Security for opening the link in a new tab
                      style={{ color: 'green' }} // Add styles for the link
                    >
                      {`${transaction.txhash.slice(0, 6)}...${userAccountData.walletAddress.slice(-8)}`}
                    </a>
                  </p>
                </React.Fragment>
              ))}

            </div>
          ) : (
            <p>No transactions recorded</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default useUserData;
