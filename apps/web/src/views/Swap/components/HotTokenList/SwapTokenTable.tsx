import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface Swap {
  _id: string;
  userAddress: string;
  fromCurrency: string;
  toCurrency: string;
  amount1: string;
  amount2: string;
  status: string;
  price: number;
  txhash: string;
  timestamp: string;
  chainId: number;
}

const SwapTable: React.FC = () => {
  const [swaps, setSwaps] = useState<Swap[]>([]);
  const [totalAmount1, setTotalAmount1] = useState<number>(0);
  const [totalAmount2, setTotalAmount2] = useState<number>(0);
  const [totalAmountCore, setTotalAmountCore] = useState<number>(0); // Updated state
  const [totalAmountVanry, setTotalAmountVanry] = useState<number>(0); // Updated state
  const [imageToken, setImageToken] = useState(null); // Updated state
  const [totalTrader, setTotalTrader] = useState<number>(0); // Updated state
  const [page, setPage] = useState(1);
  const [maxPage, setMaxPage] = useState(1);
  const maxItemsPerPage = 10;

  // Define the explorers mapping based on chain ID
  const explorers = {
    1116: 'https://scan.coredao.org/tx/',
    2040: 'https://explorer.vanarchain.com/tx/',
    // Add other chains here
  };

  useEffect(() => {
    const fetchSwaps = async () => {
      try {
        const response = await axios.get<{ swaps: Swap[] }>('https://swapback.vercel.app/api/swaps');
        const fetchedSwaps = response.data.swaps;

        if (Array.isArray(fetchedSwaps)) {
          const sortedSwaps = fetchedSwaps
            .slice()
            .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

          setSwaps(sortedSwaps);
          setMaxPage(Math.ceil(fetchedSwaps.length / maxItemsPerPage));

          const totalAmount1Calc = fetchedSwaps.reduce((total, swap) => total + parseFloat(swap.amount1), 0);
          const totalAmount2Calc = fetchedSwaps.reduce((total, swap) => total + parseFloat(swap.amount2), 0);
          setTotalAmount1(totalAmount1Calc);
          setTotalAmount2(totalAmount2Calc);
        } else {
          console.error('Fetched swaps is not an array:', fetchedSwaps);
        }
      } catch (error) {
        console.error('Failed to fetch swaps:', error);
      }
    };

    fetchSwaps();

    const intervalId = setInterval(fetchSwaps, 5000);

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    const fetchTotalCoreAmount = async () => {
      try {
        const response = await axios.get<{ totalCoreAmount: number }>('https://swapback.vercel.app/api/swaps/total-core');
        const fetchedAmount = response.data.totalCoreAmount;

        if (typeof fetchedAmount === 'number') {
          setTotalAmountVanry(fetchedAmount);
        } else {
          console.error('Fetched total CORE amount is not a number:', fetchedAmount);
        }
      } catch (error) {
        console.error('Failed to fetch total CORE amount:', error);
      }
    };

    fetchTotalCoreAmount();

    const intervalId = setInterval(fetchTotalCoreAmount, 5000);

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    const fetchTotalVanryAmount = async () => {
      try {
        const response = await axios.get<{ totalVanryAmount: number }>('https://swapback.vercel.app/api/swaps/total-vanry');
        const fetchedAmount = response.data.totalVanryAmount;

        if (typeof fetchedAmount === 'number') {
          setTotalAmountCore(fetchedAmount);
        } else {
          console.error('Fetched total CORE amount is not a number:', fetchedAmount);
        }
      } catch (error) {
        console.error('Failed to fetch total CORE amount:', error);
      }
    };

    fetchTotalVanryAmount();

    const intervalId = setInterval(fetchTotalVanryAmount, 5000);

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    const fetchTotalTrader = async () => {
      try {
        const response = await axios.get<{ swapIds: number[] }>('https://swapback.vercel.app/api/swaps/total-id');
        const fetchedIds = response.data.swapIds;

        // Assuming you want the total number of IDs
        const total = fetchedIds.length;

        setTotalTrader(total);
      } catch (error) {
        console.error('Failed to fetch swap IDs:', error);
      }
    };

    fetchTotalTrader();

    const intervalId = setInterval(fetchTotalTrader, 5000);

    return () => clearInterval(intervalId);
  }, []);

  
  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const formatAddress = (address: string) => {
    return `0x${address.slice(2, 6)}...${address.slice(-4)}`;
  };

  const formatTxHash = (txhash: string | undefined) => {
    if (!txhash) {
      return '';
    }
    return `${txhash.slice(0, 6)}...${txhash.slice(-4)}`;
  };

  const getExplorerLink = (chainId: number, txhash: string) => {
    const baseUrl = explorers[chainId];
    return baseUrl ? `${baseUrl}${txhash}` : '';
  };

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  const startIndex = (page - 1) * maxItemsPerPage;
  const endIndex = startIndex + maxItemsPerPage;

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center'}}>
      <div style={{ marginBottom: '20px', textAlign: 'center' }}>
        <p>Exchange Activity</p>
      </div>
      <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '10px' }}>
        <thead>
          <tr>
            <th style={{ border: '1px solid #ccc', padding: '10px', fontSize: '14px' }}>Total Tx: {totalTrader}</th>
            <th style={{ border: '1px solid #ccc', padding: '10px', fontSize: '14px', lineHeight: '1.5', position: 'relative' }}>
              VANRY Volume: ${totalAmountCore.toFixed(4)}
              <img
                src="https://app.bullpad.org/images/chains/2040.png"
                alt="Icon of Chain 2040"
                style={{ width: '14px', height: '14px', verticalAlign: 'middle', marginLeft: '5px' }}
              />
            </th>
            <th style={{ border: '1px solid #ccc', padding: '10px', fontSize: '14px', lineHeight: '1.5', position: 'relative' }}>
              CORE Volume: ${totalAmountVanry.toFixed(4)}
              <img
                src="https://res.corex.network/token/CORE_0x40375C92d9FAf44d2f9db9Bd9ba41a3317a2404f.png"
                alt="Icon of Chain 1116"
                style={{ width: '14px', height: '14px', verticalAlign: 'middle', marginLeft: '5px' }}
              />
            </th>

          </tr>
        </thead>
      </table>

      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={{ border: '1px solid #ccc', boxShadow: '0px 0px 1px 1px #3ce3f3', padding: '10px', fontSize: '14px' }}>Time</th>
            <th style={{ border: '1px solid #ccc', boxShadow: '0px 0px 1px 1px #3ce3f3', padding: '10px', fontSize: '14px' }}>Sent</th>
            <th style={{ border: '1px solid #ccc', boxShadow: '0px 0px 1px 1px #3ce3f3', padding: '10px', fontSize: '14px' }}>Received</th>
            <th style={{ border: '1px solid #ccc', boxShadow: '0px 0px 1px 1px #3ce3f3', padding: '10px', fontSize: '14px' }}>USD Price</th>
            <th style={{ border: '1px solid #ccc', boxShadow: '0px 0px 1px 1px #3ce3f3', padding: '10px', fontSize: '14px' }}>Type</th>
            <th style={{ border: '1px solid #ccc', boxShadow: '0px 0px 1px 1px #3ce3f3', padding: '10px', fontSize: '14px' }}>TxHash</th>
          </tr>
        </thead>
        <tbody>
          {swaps.slice(startIndex, endIndex).map((swap) => {
            return (
              <tr key={swap._id}>
                <td style={{ border: '1px solid #ccc', boxShadow: '0px 0px 1px 1px #3ce3f3', padding: '10px', fontSize: '12px' }}>{formatDate(swap.timestamp)}</td>

                <td style={{ border: '1px solid #ccc', boxShadow: '0px 0px 1px 1px #3ce3f3', padding: '10px', fontSize: '12px' }}>
                  {`${Number(swap.amount1).toFixed(4)} ${swap.fromCurrency}`}
                </td>
                <td style={{ border: '1px solid #ccc', boxShadow: '0px 0px 1px 1px #3ce3f3', padding: '10px', fontSize: '12px' }}>
                  {`${Number(swap.amount2).toFixed(4)} ${swap.toCurrency}`}
                </td>
                <td style={{ border: '1px solid #ccc', boxShadow: '0px 0px 1px 1px #3ce3f3', padding: '10px', fontSize: '12px' }}>
                  {`$${Number(swap.price).toFixed(6)}`}
                  <img
                    src="https://www.geckoterminal.com/_next/image?url=https%3A%2F%2Fcoin-images.coingecko.com%2Fcoins%2Fimages%2F34424%2Fsmall%2Fusdt_logo.png%3F1704857706&w=32&q=75"
                    alt="Icon of Chain 1116"
                    style={{ width: '14px', height: '14px', verticalAlign: 'middle', marginLeft: '5px' }}
                  />
                </td>
                <td style={{ border: '1px solid #ccc', boxShadow: '0px 0px 1px 1px #3ce3f3', padding: '10px', fontSize: '12px' }}>
                  {`${swap.status}`}
                </td>
                <td style={{ border: '1px solid #ccc', boxShadow: '0px 0px 1px 1px #3ce3f3', padding: '10px', fontSize: '12px' }}>
                  <a href={getExplorerLink(swap.chainId, swap.txhash)} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                    {formatTxHash(swap.txhash)}
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"style={{ marginLeft: '5px' }}><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
                    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
                  </a>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <div style={{ marginTop: '20px', textAlign: 'center' }}>
        <button
        style={{ paddingRight: '5px', background: '#e7f4ff', borderRadius: '5px', border: '1px, solid, green' }}
        type="button"
        onClick={() => handlePageChange(page - 1)}
        disabled={page === 1}
        >
          Previous
        </button>
        <span style={{ margin: '0 10px' }}>Page {page} of {maxPage}</span>
        <button
        style={{ paddingRight: '5px', background: '#e7f4ff', borderRadius: '5px', border: '1px, solid, green' }}
        type="button"
        onClick={() => handlePageChange(page + 1)}
        disabled={page === maxPage}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default SwapTable;
