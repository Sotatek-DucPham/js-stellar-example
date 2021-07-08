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
  const asset = new Asset('WETH', issuerKeyPair.publicKey());

  // build offer
  {
    const account = await getCurrentAccount(keyPair);
    const transaction = new TransactionBuilder(account, {
      fee: fee.toString(),
      networkPassphrase: Networks.TESTNET,
    })
      .addOperation(
        Operation.manageBuyOffer({
          buying: Asset.native(),
          selling: asset,
          buyAmount: '1',
          price: '1',
        })
      )
      .setTimeout(30)
      .build();
    transaction.sign(keyPair);
    const tx = await submitTransaction(transaction);
    console.log(`OK, tx=${tx.hash}`);
  }
})();
