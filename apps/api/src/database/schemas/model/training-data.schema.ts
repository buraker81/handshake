import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import type { IDataset } from '@handshake/types'

@Schema({ _id: false })
class DatasetSub {
  @Prop({ required: true })
  name: string

  @Prop()
  sourceId?: string

  @Prop()
  license?: string
}
const DatasetSubSchema = SchemaFactory.createForClass(DatasetSub)

@Schema({ _id: false })
class TrainingDataSub {
  @Prop()
  summary?: string

  @Prop({ type: [DatasetSubSchema], default: [] })
  datasets?: IDataset[]

  @Prop()
  privacyMeasures?: string
}

export const TrainingDataSubSchema = SchemaFactory.createForClass(TrainingDataSub)
