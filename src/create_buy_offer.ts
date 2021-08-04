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
  const buying = new Asset('DAI', issuerKeyPair.publicKey());
  const selling = new Asset('USDT', issuerKeyPair.publicKey());

  // build offer
  {
    const account = await getCurrentAccount(keyPair);
    const transaction = new TransactionBuilder(account, {
      fee: fee.toString(),
      networkPassphrase: Networks.TESTNET,
    })
      .addOperation(
        Operation.manageBuyOffer({
          buying: buying,
          selling: selling,
          buyAmount: '10',
          price: '10',
        })
      )
      .setTimeout(30)
      .build();
    transaction.sign(keyPair);
    const tx = await submitTransaction(transaction);
    console.log(`BUY OK, tx=${tx.hash}`);
  }
})();
