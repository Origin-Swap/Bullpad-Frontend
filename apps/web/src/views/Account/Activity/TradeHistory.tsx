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
      <div className="border rounded-lg py-4">
        <div className="mt-3">
          <div className="text-lg">Last 5 Trading Transactions</div>
          {userAccountData && userAccountData.lastTransactions && userAccountData.lastTransactions.length > 0 ? (
            <div className="grid grid-cols-3 gap-2 mt-4 border border-gray-100" style={{border: '2px solid gray', borderRadius: '10px', padding: '10px'}}>
              {/* Column Headers */}
              <div className="font-semibold" style={{borderRight: '2px solid gray', borderBottom: '2px solid gray', padding: '10px 5px 5px 5px'}}>Sent</div>
              <div className="font-semibold" style={{borderRight: '2px solid gray', borderBottom: '2px solid gray', padding: '10px 5px 5px 5px'}}>Received</div>
              <div className="font-semibold" style={{borderBottom: '2px solid gray', padding: '10px 5px 5px 5px'}}>TX Hash</div>

              {userAccountData.lastTransactions.map((transaction: any) => (
                <React.Fragment key={transaction.txhash}> {/* Use a unique identifier here */}
                  <p className="text-sm" style={{ borderRight: '1px solid gray', borderBottom: '1px solid gray', padding: '0px 5px 5px 5px' }}>
                    {transaction.amount1} {transaction.fromCurrency}
                  </p>
                  <p className="text-sm" style={{ borderRight: '1px solid gray', borderBottom: '1px solid gray', padding: '0px 5px 5px 5px' }}>
                    {transaction.amount2} {transaction.toCurrency}
                  </p>
                  <p className="text-sm" style={{ borderBottom: '1px solid gray', padding: '0px 5px 5px 5px' }}>
                    <a
                      href={`https://testnet.5irescan.io/tx/${transaction.txhash}`} // Change URL if you are using another explorer
                      target="_blank" // Opens in a new tab
                      rel="noopener noreferrer" // Security for opening the link in a new tab
                      style={{ textDecoration: 'underline', color: 'green' }} // Add styles for the link
                    >
                      {`${transaction.txhash.slice(0, 3)}...${userAccountData.walletAddress.slice(-4)}`}
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
