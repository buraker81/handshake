import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export type NonceDocument = NonceRecord & Document;

@Schema({ collection: "nonces" })
export class NonceRecord {
  @Prop({ required: true, unique: true, index: true })
  nonce: string;

  @Prop({ required: true, default: false })
  used: boolean;

  @Prop({ required: true })
  expiresAt: Date;
}

export const NonceSchema = SchemaFactory.createForClass(NonceRecord);

NonceSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
