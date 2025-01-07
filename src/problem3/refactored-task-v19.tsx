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

  // Option 1: Using map, filter, and sort - Time complexity: O(n log n) - worst case | space complexity: O(n)
  // Time complexity - Average case: O(n log n)
  const sortedBalances = (): FormattedWalletBalance[] => {
    return [...balances]
      .map((balance: FormattedWalletBalance) => ({ ...balance, priority: getPriority(balance.blockchain) }))
      .filter((balance) => balance.priority > -99 && balance.amount > 0)
      .sort((a, b) => b.priority - a.priority);
  };

  // Option 2: Using reduce and binary search - Time complexity: O(n ^ 2) - worst case | space complexity: O(n)
  // Time complexity - Average case: close to O(n log n)
  const sortedBalances_2 = () => {
    const compareBalancesByPriority = (a: FormattedWalletBalance, b: FormattedWalletBalance) => {
      const priorityA = getPriority(a.blockchain);
      const priorityB = getPriority(b.blockchain);
      return priorityB - priorityA; // Descending order
    };

    return balances.reduce<FormattedWalletBalance[]>((accumulator, balance) => {
      const priority = getPriority(balance.blockchain);
      if (priority > -99 && balance.amount > 0) {
        // Find insertion index using binary search (more efficient than linear search)
        let low = 0;
        let high = accumulator.length;

        while (low < high) {
          const mid = Math.floor((low + high) / 2);
          if (compareBalancesByPriority(balance, accumulator[mid]) > 0) {
            high = mid;
          } else {
            low = mid + 1;
          }
        }
        accumulator.splice(low, 0, balance);
      }
      return accumulator;
    }, []);
  };

  // If space is a concern, Option 2 is better since it has a lower space complexity.
  // If time is a concern, Option 1 is better since it has a lower time complexity.

  return (
    <div {...rest}>
      {sortedBalances().map((balance: FormattedWalletBalance, index: number) => (
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
