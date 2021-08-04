import { Asset, Networks, Operation, TransactionBuilder } from 'stellar-sdk';
import {
  getCurrentAccount,
  issuerKeyPair,
  keyPair,
  server,
  submitTransaction,
} from './common';

(async () => {
  const fee = await server.fetchBaseFee();
  const selling = new Asset('DAI', issuerKeyPair.publicKey());
  const buying = new Asset('USDT', issuerKeyPair.publicKey());

  // build offer
  {
    const account = await getCurrentAccount(keyPair);
    const transaction = new TransactionBuilder(account, {
      fee: fee.toString(),
      networkPassphrase: Networks.TESTNET,
    })
      .addOperation(
        Operation.manageSellOffer({
          buying: buying,
          selling: selling,
          amount: '10',
          price: '0.2',
        })
      )
      .setTimeout(30)
      .build();
    transaction.sign(keyPair);
    const tx = await submitTransaction(transaction);
    console.log(`SELL OK, tx=${tx.hash}`);
  }
})();
