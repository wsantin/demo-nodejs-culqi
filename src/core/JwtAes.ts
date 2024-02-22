import { createCipheriv, createDecipheriv, randomInt } from "crypto"
import  { sign, verify, JwtPayload} from "jsonwebtoken"

import { InternalError, BadTokenError, TokenExpiredError } from './ApiError';

const tokenKey: Buffer = Buffer.from(process.env.tokenKey as string, "hex");
const payloadKey: Buffer = Buffer.from(process.env.payloadKey as string, "hex");
const payloadIv: Buffer = Buffer.from(process.env.payloadIv as string, "hex");
const encryptionAlgorithm = process.env.encryptionAlgorithm as string

interface Payload {
  card_number: string;
  cvv: string;
  expiration_month: string;
  expiration_year: string;
  email: string;
}

function encryptPayload(payload: Payload): string {
  const cipher = createCipheriv(encryptionAlgorithm, payloadKey, payloadIv);
  let encrypted = cipher.update(JSON.stringify(payload), 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return encrypted;
}

function decryptPayload(encrypted: string): Payload {
  const decipher = createDecipheriv(encryptionAlgorithm, payloadKey, payloadIv);
  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return JSON.parse(decrypted);
}

function createToken(payload: Payload, expiresIn: string): string {
  const encryptedPayload = encryptPayload(payload);
  console.log("expiresIn: ",expiresIn)
  return sign({ data: encryptedPayload }, tokenKey, { expiresIn: expiresIn || '1h' });
}

function verifyToken(token: string): any{
  
  try {
    const decoded = verify(token, tokenKey) as JwtPayload;
    const decryptedPayload = decryptPayload(decoded.data as string);
    return { valid: true, payload: decryptedPayload };
  } catch (error: any) {

    if (error.name === 'TokenExpiredError') throw new TokenExpiredError();
    else throw new BadTokenError()
  }
}

export { verifyToken, createToken }
 