import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BACKEND_URL } from 'config/constants/backendApi';


interface Swap {
  _id: string;
  userAddress: string;
  currencyA: string;
  currencyB: string;
  amountA: string;
  amountB: string;
  status: string;
  price: number;
  txhash: string;
  timestamp: string;
  chainId: number;
}

interface Remove {
  _id: string;
  chainId: number;
  account: string;
  currencyA: string;
  currencyB: string;
  amountA: string;
  amountB: string;
  status: string;
  timestamp: string;
}

const SwapTable: React.FC = () => {
  const [swaps, setSwaps] = useState<Swap[]>([]);
  const [removes, setRemoves] = useState<Remove[]>([]);
  const [page, setPage] = useState(1);
  const [maxPage, setMaxPage] = useState(1);
  const maxItemsPerPage = 5;

  const explorers = {
    1116: 'https://scan.coredao.org/tx/',
    2040: 'https://explorer.vanarchain.com/tx/',
  };

  useEffect(() => {
    const fetchAdds = async () => {
      try {
        const response = await axios.get<{ adds: Swap[] }>(`${BACKEND_URL}/api/adds`);
        const fetchedSwaps = response.data.adds;

        if (Array.isArray(fetchedSwaps)) {
          const sortedSwaps = fetchedSwaps
            .slice()
            .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

          setSwaps(sortedSwaps);
          setMaxPage(Math.ceil(fetchedSwaps.length / maxItemsPerPage));
        } else {
          console.error('Fetched swaps is not an array:', fetchedSwaps);
        }
      } catch (error) {
        console.error('Failed to fetch swaps:', error);
      }
    };

    fetchAdds();

    const intervalId = setInterval(fetchAdds, 5000);

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    const fetchRemoves = async () => {
      try {
        const response = await axios.get<{ removes: Remove[] }>(`${BACKEND_URL}/api/removes`);
        const fetchedRemoves = response.data.removes;

        if (Array.isArray(fetchedRemoves)) {
          const sortedRemoves = fetchedRemoves
            .slice()
            .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

          setRemoves(sortedRemoves);
          setMaxPage(Math.ceil(fetchedRemoves.length / maxItemsPerPage));
        } else {
          console.error('Fetched removes is not an array:', fetchedRemoves);
        }
      } catch (error) {
        console.error('Failed to fetch removes:', error);
      }
    };

    fetchRemoves();

    const intervalId = setInterval(fetchRemoves, 5000);

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
    <div style={{ padding: "5px",margin: '10px' }}>
      <div style={{ marginBottom: '20px', textAlign: 'center' }}>
        <p>All Liqudity Activity</p>
      </div>
      {/* <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '10px' }}>
        <thead>
          <tr>
            <th style={{ border: '1px solid #ccc', padding: '10px', fontSize: '14px' }}>Total Tx: {totalTrader}</th>
            <th style={{ border: '1px solid #ccc', padding: '10px', fontSize: '14px', lineHeight: '1.5', position: 'relative' }}>
              TVL in VANAR: ${totalAmountCore.toFixed(4)}
              <img
                src="https://www.geckoterminal.com/_next/image?url=https%3A%2F%2Fcoin-images.coingecko.com%2Fcoins%2Fimages%2F34424%2Fsmall%2Fusdt_logo.png%3F1704857706&w=32&q=75"
                alt="Icon of Chain 2040"
                style={{ width: '14px', height: '14px', verticalAlign: 'middle', marginLeft: '5px' }}
              />
            </th>
            <th style={{ border: '1px solid #ccc', padding: '10px', fontSize: '14px', lineHeight: '1.5', position: 'relative' }}>
              TVL in CORE: ${totalAmountVanry.toFixed(4)}
              <img
                src="https://www.geckoterminal.com/_next/image?url=https%3A%2F%2Fcoin-images.coingecko.com%2Fcoins%2Fimages%2F34424%2Fsmall%2Fusdt_logo.png%3F1704857706&w=32&q=75"
                alt="Icon of Chain 1116"
                style={{ width: '14px', height: '14px', verticalAlign: 'middle', marginLeft: '5px' }}
              />
            </th>

          </tr>
        </thead>
      </table> */}

      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={{ border: '1px solid #ccc', boxShadow: '0px 0px 1px 1px #3ce3f3', padding: '10px', fontSize: '14px' }}>Time</th>
            <th style={{ border: '1px solid #ccc', boxShadow: '0px 0px 1px 1px #3ce3f3', padding: '10px', fontSize: '14px' }}>Token</th>
            <th style={{ border: '1px solid #ccc', boxShadow: '0px 0px 1px 1px #3ce3f3', padding: '10px', fontSize: '14px' }}>Amount</th>
            <th style={{ border: '1px solid #ccc', boxShadow: '0px 0px 1px 1px #3ce3f3', padding: '10px', fontSize: '14px' }}>Type</th>
          </tr>
        </thead>
        <tbody>
          {swaps.slice(startIndex, endIndex).map((swap) => {
            return (
              <tr key={swap._id} style={{ textAlign: 'center' }}>
                <td style={{ border: '1px solid #ccc', boxShadow: '0px 0px 1px 1px #3ce3f3', padding: '10px', fontSize: '12px' }}>{formatDate(swap.timestamp)}</td>

                <td style={{ border: '1px solid #ccc', boxShadow: '0px 0px 1px 1px #3ce3f3', padding: '10px', fontSize: '12px' }}>
                  {`${swap.currencyA}`}/{`${swap.currencyB}`}
                </td>
                <td style={{ border: '1px solid #ccc', boxShadow: '0px 0px 1px 1px #3ce3f3', padding: '10px', fontSize: '12px' }}>
                  {`${Number(swap.amountA).toFixed(3)}`}/{`${Number(swap.amountB).toFixed(3)}`}
                </td>
                <td style={{ border: '1px solid #ccc', boxShadow: '0px 0px 1px 1px #3ce3f3', padding: '10px', fontSize: '12px' }}>
                  {`${swap.status}`}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
        <thead>
          <tr>
            <th style={{ border: '1px solid #ccc', boxShadow: '0px 0px 1px 1px #3ce3f3', padding: '10px', fontSize: '14px' }}>Time</th>
            <th style={{ border: '1px solid #ccc', boxShadow: '0px 0px 1px 1px #3ce3f3', padding: '10px', fontSize: '14px' }}>Token</th>
            <th style={{ border: '1px solid #ccc', boxShadow: '0px 0px 1px 1px #3ce3f3', padding: '10px', fontSize: '14px' }}>Amount</th>
            <th style={{ border: '1px solid #ccc', boxShadow: '0px 0px 1px 1px #3ce3f3', padding: '10px', fontSize: '14px' }}>Type</th>
          </tr>
        </thead>
        <tbody>
          {removes.slice(startIndex, endIndex).map((remove) => {
            return (
              <tr key={remove._id} style={{ textAlign: 'center' }}>
                <td style={{ border: '1px solid #ccc', boxShadow: '0px 0px 1px 1px #3ce3f3', padding: '10px', fontSize: '12px' }}>{formatDate(remove.timestamp)}</td>

                <td style={{ border: '1px solid #ccc', boxShadow: '0px 0px 1px 1px #3ce3f3', padding: '10px', fontSize: '12px' }}>
                  {`${remove.currencyA}`}/{`${remove.currencyB}`}
                </td>
                <td style={{ border: '1px solid #ccc', boxShadow: '0px 0px 1px 1px #3ce3f3', padding: '10px', fontSize: '12px' }}>
                  {`${Number(remove.amountA).toFixed(4)}`}/{`${Number(remove.amountB).toFixed(4)}`}
                </td>
                <td style={{ border: '1px solid #ccc', boxShadow: '0px 0px 1px 1px #3ce3f3', padding: '10px', fontSize: '12px' }}>
                  {`${remove.status}`}
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
          ←
        </button>
        <span style={{ margin: '0 10px' }}>Page {page} of {maxPage}</span>
        <button
        style={{ paddingRight: '5px', background: '#e7f4ff', borderRadius: '5px', border: '1px, solid, green' }}
        type="button"
        onClick={() => handlePageChange(page + 1)}
        disabled={page === maxPage}
        >
          →
        </button>
      </div>
    </div>
  );
};

export default SwapTable;
