interface WalletBalance {
  currency: string;
  amount: number;
  blockchain: string;
}

interface FormattedWalletBalance extends WalletBalance {
  formatted: string;
  priority?: number;
}

// Utility function
const getPriority = (blockchain: string): number => {
  switch (blockchain) {
    case 'Osmosis':
      return 100;
    case 'Ethereum':
      return 50;
    case 'Arbitrum':
      return 30;
    case 'Zilliqa':
    case 'Neo':
      return 20;
    default:
      return -99;
  }
};

const WalletPage = ({ children, ...rest }: BoxProps) => {
  const balances = useWalletBalances();
  const prices = usePrices();

  const sortedBalances = useMemo(() => {
    return [...balances]
      .map((balance: FormattedWalletBalance) => ({ ...balance, priority: getPriority(balance.blockchain) }))
      .filter(balance => balance.priority > -99 && balance.amount > 0)
      .sort((a, b) => b.priority - a.priority);
  }, [balances]);

  return (
    <div {...rest}>
      {sortedBalances.map((balance: FormattedWalletBalance, index: number) => (
        <WalletRow
          key={index}
          amount={balance.amount}
          usdValue={prices[balance.currency] * balance.amount}
          formattedAmount={balance.formatted}
        />
      ))}
    </div>
  );
}
