import {
  AuthRequiredFlag,
  AuthRevocableFlag,
  Networks,
  Operation,
  TransactionBuilder,
} from 'stellar-sdk';
import {
  getCurrentAccount,
  issuerKeyPair,
  keyPair,
  server,
  submitTransaction,
} from './common';

(async () => {
  const fee = await server.fetchBaseFee();

  // set auth flags
  {
    const issuerAccount = await getCurrentAccount(issuerKeyPair);
    const transaction = new TransactionBuilder(issuerAccount, {
      fee: fee.toString(),
      networkPassphrase: Networks.TESTNET,
    })
      .addOperation(
        Operation.setOptions({
          setFlags: AuthRequiredFlag,
        })
      )
      .addOperation(
        Operation.setOptions({
          setFlags: AuthRevocableFlag,
        })
      )
      .setTimeout(30)
      .build();
    transaction.sign(issuerKeyPair);
    const tx = await submitTransaction(transaction);
    console.log(`SetOptions, tx=${tx.hash}`);
  }
})();
