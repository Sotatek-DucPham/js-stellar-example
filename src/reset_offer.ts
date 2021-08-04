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

    const { records } = await server
      .offers()
      .forAccount(keyPair.publicKey())
      .call();

    let transaction = new TransactionBuilder(account, {
      fee: (fee * records.length).toString(),
      networkPassphrase: Networks.TESTNET,
    });
    for (let record of records) {
      transaction = transaction.addOperation(
        Operation.manageSellOffer({
          buying: buying,
          selling: selling,
          amount: '0',
          price: '0.2',
          offerId: record.id,
        })
      );
    }
    const txBuild = transaction.setTimeout(30).build();

    txBuild.sign(keyPair);
    const tx = await submitTransaction(txBuild);
    console.log(`RESET OK, tx=${tx.hash}`);
  }
})();
