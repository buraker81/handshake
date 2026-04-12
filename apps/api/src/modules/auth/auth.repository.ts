import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import type { Model } from "mongoose";
import type { NonceDocument } from "./schemas/nonce.schema";
import { NonceRecord } from "./schemas/nonce.schema";
import type { SessionDocument } from "./schemas/session.schema";
import { SessionRecord } from "./schemas/session.schema";

@Injectable()
export class AuthRepository {
  constructor(
    @InjectModel(NonceRecord.name) private readonly nonceModel: Model<NonceDocument>,
    @InjectModel(SessionRecord.name) private readonly sessionModel: Model<SessionDocument>,
  ) {}

  async createNonce(nonce: string, expiresAt: Date): Promise<void> {
    await this.nonceModel.create({ nonce, used: false, expiresAt });
  }

  async findNonce(nonce: string): Promise<NonceDocument | null> {
    return this.nonceModel.findOne({ nonce }).lean<NonceDocument>().exec();
  }

  async markNonceUsed(nonce: string): Promise<void> {
    await this.nonceModel.updateOne({ nonce }, { $set: { used: true } });
  }

  async createSession(sessionId: string, walletAddress: string, expiresAt: Date): Promise<void> {
    await this.sessionModel.create({ sessionId, walletAddress, expiresAt });
  }

  async findSession(sessionId: string): Promise<SessionDocument | null> {
    return this.sessionModel.findOne({ sessionId }).lean<SessionDocument>().exec();
  }

  async deleteSession(sessionId: string): Promise<void> {
    await this.sessionModel.deleteOne({ sessionId });
  }
}
