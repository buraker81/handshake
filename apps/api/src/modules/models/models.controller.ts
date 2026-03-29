import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  Query,
  Req,
  UseGuards,
  HttpCode,
  HttpStatus,
} from "@nestjs/common";
import { ApiBody, ApiOperation, ApiTags } from "@nestjs/swagger";
import { ModelsService } from "./models.service";
import { ListModelsQueryDto } from "./requests/list-models-query-dto";
import { AuthGuard } from "../auth/auth.guard";
import { Request } from "express";
import { CreateModelDTO, CreateModelSchema } from "@handshake/types";
import { ValidationPipe } from "../../common/pipes/zod-validation.pipe";

type AuthRequest = Request & { user: { walletAddress: string } };

@ApiTags("models")
@Controller("models")
export class ModelsController {
  constructor(private readonly modelsService: ModelsService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "List models" })
  listModels(@Query() query: ListModelsQueryDto) {
    return this.modelsService.listModels(query);
  }

  // Must be before :id to avoid route collision
  @Get("check/:hash")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Check if model hash already exists" })
  checkDuplicate(@Param("hash") hash: string) {
    return this.modelsService.checkDuplicate(hash);
  }

  @Get(":id")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Get model by ID" })
  getModel(@Param("id") id: string) {
    return this.modelsService.getModel(id);
  }

  @Post()
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: "Upload a new model (requires auth)" })
  @ApiBody({
    schema: {
      type: "object",
      required: ["name", "description", "version", "task", "framework", "license", "modelHash", "modelFileCid"],
      properties: {
        name: { type: "string", example: "llama-3-8b-finetune" },
        description: { type: "string", example: "A fine-tuned LLaMA 3 8B on legal documents" },
        version: { type: "string", example: "1.0.0" },
        task: {
          type: "string",
          enum: ["text-generation", "image-classification", "object-detection", "text-classification",
                 "token-classification", "question-answering", "summarization", "translation",
                 "text-to-image", "image-to-text", "audio-classification", "other"],
          example: "text-generation",
        },
        framework: {
          type: "string",
          enum: ["pytorch", "tensorflow", "jax", "onnx", "other"],
          example: "pytorch",
        },
        license: {
          type: "string",
          enum: ["apache-2.0", "mit", "gpl-3.0", "agpl-3.0", "cc-by-4.0", "cc-by-nc-4.0", "llama-3", "gemma", "other"],
          example: "apache-2.0",
        },
        modelHash: { type: "string", example: "a1b2c3d4e5f6..." },
        modelFileCid: { type: "string", example: "QmXyz..." },
        baseModel: {
          type: "array",
          items: {
            type: "object",
            properties: {
              source: { type: "string", enum: ["handshake", "huggingface", "other"] },
              name: { type: "string" },
              relationship: { type: "string", enum: ["finetune", "adapter", "quantized", "merge", "knowledge_distillation"] },
              handshakeId: { type: "string" },
              externalId: { type: "string" },
            },
          },
        },
        tags: { type: "array", items: { type: "string" }, example: ["legal", "llm"] },
        languages: { type: "array", items: { type: "string" }, example: ["en", "tr"] },
        intendedUse: { type: "string", example: "Legal document summarization for enterprise" },
        size: { type: "number", example: 16000 },
        quantization: { type: "string", enum: ["none", "int8", "int4", "gptq", "awq"] },
        parameters: { type: "string", example: "8B" },
        contextLength: { type: "number", example: 8192 },
      },
    },
  })
  createModel(
    @Body(new ValidationPipe(CreateModelSchema)) body: CreateModelDTO,
    @Req() req: AuthRequest,
  ) {
    return this.modelsService.createModel(body, req.user.walletAddress);
  }
}
