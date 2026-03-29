import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import type { IBenchmark } from "@handshake/types";

@Schema({ _id: false })
class BenchmarkSub {
  @Prop({ required: true })
  name: string;

  @Prop()
  score?: number;

  @Prop()
  metric?: string;

  @Prop()
  date?: string;
}
const BenchmarkSubSchema = SchemaFactory.createForClass(BenchmarkSub);

@Schema({ _id: false })
class EvaluationSub {
  @Prop({ type: [BenchmarkSubSchema] })
  benchmarks?: IBenchmark[];

  @Prop()
  limitations?: string;
}

export const EvaluationSubSchema = SchemaFactory.createForClass(EvaluationSub);
