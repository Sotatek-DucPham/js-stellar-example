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
  // query all offers
  {
    const offers = await server.offers().limit(100).call();
    console.log(offers);
  }

  // query offers of an user
  {
    const offers = await server
      .offers()
      .forAccount(keyPair.publicKey())
      .limit(100)
      .call();
    console.log(offers);
  }

  // query operations
  {
    const ops = await server.operations().limit(100).call();
    console.log(ops);
  }
})();
