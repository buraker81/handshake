import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'

@Schema({ _id: false })
class BlockchainRecordSub {
  @Prop()
  txHash?: string

  @Prop()
  blockNumber?: number

  @Prop()
  contractAddress?: string

  @Prop()
  chainId?: number

  @Prop()
  registeredAt?: Date
}

export const BlockchainRecordSubSchema = SchemaFactory.createForClass(BlockchainRecordSub)
