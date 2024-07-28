// hooks/useBalance.ts
import { useState, useEffect } from 'react';
import useActiveWeb3React from 'hooks/useActiveWeb3React';
import { useWeb3LibraryContext } from '@pancakeswap/wagmi';
import { BigNumber } from '@ethersproject/bignumber'

const useBalance = () => {
  const { account } = useActiveWeb3React();
  const library = useWeb3LibraryContext();
  const [balance, setBalance] = useState<BigNumber | null>(null);
  const [isFetched, setIsFetched] = useState(false);

  useEffect(() => {
    if (account && library) {
      const fetchBalance = async () => {
        try {
          const nativeBalance = await library.getBalance(account);
          setBalance(nativeBalance);
          setIsFetched(true);
        } catch (error) {
          console.error("Failed to fetch balance:", error);
          setBalance(null);
          setIsFetched(false);
        }
      };

      fetchBalance();
    }
  }, [account, library]);

  return { data: { value: balance }, isFetched };
};

export default useBalance;
