import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Source, Relationship } from '@handshake/types'

@Schema({ _id: false })
class ParentRefSub {
  @Prop({ required: true, enum: Object.values(Source) })
  source: string

  @Prop({ required: true })
  name: string

  @Prop({ required: true, enum: Object.values(Relationship) })
  relationship: string

  @Prop()
  handshakeId?: string

  @Prop()
  externalId?: string

  @Prop()
  modelHash?: string
}

export const ParentRefSubSchema = SchemaFactory.createForClass(ParentRefSub)
