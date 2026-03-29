import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export type SessionDocument = SessionRecord & Document;

@Schema({ collection: "sessions" })
export class SessionRecord {
  @Prop({ required: true, unique: true, index: true })
  sessionId: string;

  @Prop({ required: true, index: true })
  walletAddress: string;

  @Prop({ required: true })
  expiresAt: Date;
}

export const SessionSchema = SchemaFactory.createForClass(SessionRecord);

SessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
