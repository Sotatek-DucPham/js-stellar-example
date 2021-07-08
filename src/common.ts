import 'dotenv/config';
import { Account, Keypair, Server, Transaction } from 'stellar-sdk';

const ISSUER_PRIVATE_KEY = process.env.ISSUER_PRIVATE_KEY || '';
const PRIVATE_KEY = process.env.PRIVATE_KEY || '';
const HORIZON_URL =
  process.env.HORIZON_URL || 'https://horizon-testnet.stellar.org';

export const server = new Server(HORIZON_URL);
export const issuerKeyPair = Keypair.fromSecret(ISSUER_PRIVATE_KEY);
export const keyPair = Keypair.fromSecret(PRIVATE_KEY);

export const getCurrentAccount = async (kp: Keypair) => {
  const account = await server.loadAccount(kp.publicKey());
  return new Account(account.accountId(), account.sequenceNumber().toString());
};

export const submitTransaction = async (transaction: Transaction) => {
  try {
    const tx = await server.submitTransaction(transaction);
    return tx;
  } catch (err) {
    console.log(JSON.stringify(err.response.data, null, 2));
    throw err;
  }
};
