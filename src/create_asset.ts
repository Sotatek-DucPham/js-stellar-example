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
  const asset = new Asset('WBTC', issuerKeyPair.publicKey());

  // trust line
  {
    const account = await getCurrentAccount(keyPair);
    const transaction = new TransactionBuilder(account, {
      fee: fee.toString(),
      networkPassphrase: Networks.TESTNET,
    })
      .addOperation(Operation.changeTrust({ asset }))
      .setTimeout(30)
      .build();
    transaction.sign(keyPair);
    const tx = await submitTransaction(transaction);
    console.log(`Trusted, tx=${tx.hash}`);
  }

  // allow trust
  {
    const issuerAccount = await getCurrentAccount(issuerKeyPair);
    const transaction = new TransactionBuilder(issuerAccount, {
      fee: fee.toString(),
      networkPassphrase: Networks.TESTNET,
    })
      .addOperation(
        Operation.allowTrust({
          trustor: keyPair.publicKey(),
          assetCode: asset.code,
          authorize: 2,
        })
      )
      .setTimeout(30)
      .build();
    transaction.sign(issuerKeyPair);
    const tx = await submitTransaction(transaction);
    console.log(`AllowTrust, tx=${tx.hash}`);
  }

  // create asset
  {
    const issuerAccount = await getCurrentAccount(issuerKeyPair);
    const transaction = new TransactionBuilder(issuerAccount, {
      fee: fee.toString(),
      networkPassphrase: Networks.TESTNET,
    })
      .addOperation(
        Operation.payment({
          destination: keyPair.publicKey(),
          asset: asset,
          amount: '1000',
        })
      )
      .setTimeout(30)
      .build();
    transaction.sign(issuerKeyPair);
    const tx = await submitTransaction(transaction);
    console.log(`Minted, tx=${tx.hash}`);
  }
})();
