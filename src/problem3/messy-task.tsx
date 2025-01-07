interface WalletBalance {
  currency: string;
  amount: number;
}

// ISSUE: FormattedWalletBalance could be extend from WalletBalance
interface FormattedWalletBalance {
  currency: string;
  amount: number;
  formatted: string;
}

interface Props extends BoxProps { } // ISSUE: PROPS is empty interface, could be removed (kind of an anti-pattern)

const WalletPage: React.FC<Props> = (props: Props) => {
  // ISSUE: children is not used, hence using React.FC<Props> is not necessary, and could be deconstructed directly in the function
  // ASSUMPTION: children is also defined in the BoxProps interface.
  const { children, ...rest } = props;
  const balances = useWalletBalances();
  const prices = usePrices();

  // ISSUE: getPriority should be a utility function outside of the component, defined here could lead to un-necessary re-render the component.
  const getPriority = (blockchain: any): number => {
    switch (blockchain) {
      case 'Osmosis':
        return 100;
      case 'Ethereum':
        return 50;
      case 'Arbitrum':
        return 30;
      case 'Zilliqa': // ISSUE: Should fallthrough to 'Neo' case since it has the same priority
        return 20;
      case 'Neo':
        return 20;
      default:
        return -99;
    }
  };

  // ISSUE: in v19, useMemo is not necessary, React compiler will optimize the code automatically.
  const sortedBalances = useMemo(() => {
    // ISSUE: getPriority is called multiple times, it could be optimized by calling it once and store the result with map function.
    // ISSUE: the filter function is not clean, could be refactored to be more readable.
    return balances
      .filter((balance: WalletBalance) => { // ISSUE: Incorrect type for balance, it should be FormattedWalletBalance
        const balancePriority = getPriority(balance.blockchain); // ISSUE: blockchain is not defined in WalletBalance interface
        if (lhsPriority > -99) { // ISSUE: lhsPriority is not defined, it should be balancePriority
          if (balance.amount <= 0) { // ISSUE: inverted logic:  if (balance.amount <= 0) and return true meant that balances with an amount less than or equal to 0 were being included in the filtered results. Should be if (balance.amount > 0)
            return true;
          }
        }
        return false;
      })
      .sort((lhs: WalletBalance, rhs: WalletBalance) => {
        // ISSUE: sort function is not clean, could be refactored to be more readable.
        const leftPriority = getPriority(lhs.blockchain);
        const rightPriority = getPriority(rhs.blockchain);
        if (leftPriority > rightPriority) {
          return -1;
        } else if (rightPriority > leftPriority) {
          return 1;
        }
      });
  }, [balances, prices]); // ISSUE: dependencies is not correct, it should be [balances]
  // but since balances is an array, it will re-render the component when the array is changed even if the value is the same.
  // it is because the array is a reference type, so it will be re-rendered when the reference is changed (assuming useWalletBalances is a hook that returns new array every time it is called)
  // (This is because react dependency is compared by reference, not by value)
  // To use balances as a dependency, the only way to prevent unnecessary recalculations is to ensure that the balances array's reference only changes when its content changes. This means useWalletBalances hook need to control how balances is updated.
  // And only update the balances when the content is changed, and return the same reference when the content is the same.

  // ISSUE: formattedBalances is not used, it could be removed.
  const formattedBalances = sortedBalances.map((balance: WalletBalance) => {
    return {
      ...balance,
      formatted: balance.amount.toFixed(),
    };
  });

  // ISSUE: rows is not necessary, it could be use directly in the return statement.
  const rows = sortedBalances.map((balance: FormattedWalletBalance, index: number) => {
    // ISSUE: usdValue is not necessary, it could be use directly in the input of WalletRow.
    const usdValue = prices[balance.currency] * balance.amount;
    return (
      // ISSUE: className is not defined. I will remove it from the code since there is no information about this object in the code.
      <WalletRow className={classes.row} key={index} amount={balance.amount} usdValue={usdValue} formattedAmount={balance.formatted} />
    );
  });

  return <div {...rest}>{rows}</div>;
};