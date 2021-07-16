import {
  Asset,
  Networks,
  Operation,
  Transaction,
  TransactionBuilder,
} from 'stellar-sdk';
import { getCurrentAccount, issuerKeyPair, keyPair, server } from './common';

(async () => {
  const fee = await server.fetchBaseFee();
  const asset = new Asset('WETH', issuerKeyPair.publicKey());

  // decode rawtx
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

    // decode tx
    const rawTx = transaction.toXDR();
    console.log(rawTx);
    const decodedTx = new Transaction(rawTx, Networks.TESTNET);
    console.log(decodedTx);
  }
})();
