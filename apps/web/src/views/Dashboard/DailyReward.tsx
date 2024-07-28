import React, { useState, useEffect, useCallback } from 'react';
import { useSigner } from 'wagmi';
import { useDailyClaimContract } from 'hooks/useContract';
import { Box, Flex, Button, Text } from '@pancakeswap/uikit';

const ClaimReward: React.FC = () => {
  const dailyClaimContract = useDailyClaimContract();
  const [lastClaimedTime, setLastClaimedTime] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const { data: signer } = useSigner();

  const updateLastClaimed = useCallback(async () => {
    if (!dailyClaimContract || !signer) return;
    const lastClaimed = await dailyClaimContract.getLastClaimed(signer);
    setLastClaimedTime(lastClaimed.toNumber());
    const now = Math.floor(Date.now() / 1000);
    if (lastClaimed.toNumber() + 86400 > now) {
      setTimeLeft(lastClaimed.toNumber() + 86400 - now);
    }
  }, [dailyClaimContract, signer]);

  const claimReward = async () => {
    if (!dailyClaimContract || !signer) return;
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const tx = await dailyClaimContract.claimReward();
      await tx.wait();
      setSuccess("Reward claimed successfully!");
    } catch (err) {
      setError(`Error claiming reward: ${(err as Error).message}`);
    }
    setLoading(false);
    updateLastClaimed();
  };

  useEffect(() => {
    if (dailyClaimContract && signer) {
      updateLastClaimed();
    }
  }, [dailyClaimContract, signer, updateLastClaimed]);

  useEffect(() => {
    if (timeLeft !== null) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev === null) return null;
          if (prev <= 1) {
            clearInterval(timer);
            updateLastClaimed();
            return null;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
    return undefined; // Explicitly return undefined
  }, [timeLeft, updateLastClaimed]);

  const formatTimeLeft = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h}h ${m}m ${s}s`;
  };

  return (
    <Flex style={{ alignItems: 'center', justifyContent: 'center', border: '2px solid #80e1e6', borderRadius: '10px', margin: '5px', boxShadow: '2px 2px 4px 2px #919191', padding: '10px' }}>
      <Text style={{ fontSize: '16px', paddingRight: '20px' }}>
        Daily Rewards
      </Text>
      <Box>
        {!timeLeft ? (
          <Button onClick={claimReward} disabled={loading}>
            {loading ? "Claiming..." : "Claim (2 BULL)"}
          </Button>
        ) : (
          <Text>Next claim available in: {formatTimeLeft(timeLeft)}</Text>
        )}
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {success && <p style={{ color: 'green' }}>{success}</p>}
        {lastClaimedTime && (
          <p>Last claimed: {new Date(lastClaimedTime * 1000).toLocaleString()}</p>
        )}
      </Box>
    </Flex>
  );
};

export default ClaimReward;
