import { BadRequestException, Injectable, Logger, UnauthorizedException } from "@nestjs/common";
import { SiweMessage, generateNonce } from "siwe";
import { v4 as uuidv4 } from "uuid";
import type { AuthRepository } from "./auth.repository";
import { AUTH_CONSTANTS } from "../../common/constants";

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(private readonly repo: AuthRepository) {}

  async generateNonce(): Promise<string> {
    const nonce = generateNonce();
    const expiresAt = new Date(Date.now() + AUTH_CONSTANTS.NONCE_TTL_MS);

    await this.repo.createNonce(nonce, expiresAt);

    this.logger.debug(`Nonce generated, expires at ${expiresAt.toISOString()}`);
    return nonce;
  }

  async verifyAndCreateSession(message: string, signature: string): Promise<string> {
    let siweMessage: SiweMessage;
    try {
      siweMessage = new SiweMessage(message);
    } catch {
      this.logger.warn("SIWE verification failed: invalid message format");
      throw new BadRequestException("Invalid SIWE message format");
    }

    const expectedDomain = new URL(process.env.CLIENT_URL!).host;
    const result = await siweMessage.verify({ signature, domain: expectedDomain });

    if (!result.success) {
      this.logger.warn(`SIWE signature verification failed for address=${siweMessage.address}`);
      throw new UnauthorizedException("Signature verification failed");
    }

    const { nonce, address, chainId, issuedAt } = result.data;

    const expectedChainId = Number(process.env.CHAIN_ID);
    if (chainId !== expectedChainId) {
      this.logger.warn(
        `Chain ID mismatch: expected=${expectedChainId} got=${chainId} address=${address}`,
      );
      throw new UnauthorizedException("Invalid chain ID");
    }

    if (issuedAt) {
      const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
      if (new Date(issuedAt) < fiveMinutesAgo) {
        this.logger.warn(`SIWE message too old: issuedAt=${issuedAt} address=${address}`);
        throw new UnauthorizedException("SIWE message too old");
      }
    }

    const nonceDoc = await this.repo.findNonce(nonce);

    if (!nonceDoc) {
      this.logger.warn(`Nonce not found: address=${address}`);
      throw new UnauthorizedException("Invalid nonce");
    }

    if (nonceDoc.used) {
      this.logger.warn(`Nonce replay attempt: address=${address}`);
      throw new UnauthorizedException("Nonce already used");
    }

    if (nonceDoc.expiresAt < new Date()) {
      this.logger.warn(`Nonce expired: address=${address}`);
      throw new UnauthorizedException("Nonce expired");
    }

    await this.repo.markNonceUsed(nonce);

    const sessionId = uuidv4();
    const expiresAt = new Date(Date.now() + AUTH_CONSTANTS.SESSION_TTL_MS);

    await this.repo.createSession(sessionId, address, expiresAt);

    this.logger.log(`Session created: address=${address} expires=${expiresAt.toISOString()}`);
    return sessionId;
  }

  async getSession(sessionId: string): Promise<{ walletAddress: string } | null> {
    const session = await this.repo.findSession(sessionId);

    if (!session) return null;

    if (session.expiresAt < new Date()) {
      this.logger.debug(`Session expired for wallet=${session.walletAddress}`);
      return null;
    }

    return { walletAddress: session.walletAddress };
  }

  async logout(sessionId: string): Promise<void> {
    const session = await this.repo.findSession(sessionId);
    await this.repo.deleteSession(sessionId);

    if (session) {
      this.logger.log(`Session destroyed: wallet=${session.walletAddress}`);
    }
  }
}
