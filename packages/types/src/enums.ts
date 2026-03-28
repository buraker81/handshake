export enum Task {
    TextGeneration = 'text-generation',
    ImageClassification = 'image-classification',
    ObjectDetection = 'object-detection',
    TextClassification = 'text-classification',
    TokenClassification = 'token-classification',
    QuestionAnswering = 'question-answering',
    Summarization = 'summarization',
    Translation = 'translation',
    TextToImage = 'text-to-image',
    ImageToText = 'image-to-text',
    AudioClassification = 'audio-classification',
    Other = 'other',
}

export enum Framework {
    PyTorch = 'pytorch',
    TensorFlow = 'tensorflow',
    JAX = 'jax',
    ONNX = 'onnx',
    Other = 'other',
}

export enum License {
    Apache2 = 'apache-2.0',
    MIT = 'mit',
    GPL3 = 'gpl-3.0',
    AGPL3 = 'agpl-3.0',
    CcBy4 = 'cc-by-4.0',
    CcByNc4 = 'cc-by-nc-4.0',
    Llama3 = 'llama-3',
    Gemma = 'gemma',
    Other = 'other',
}

export enum Relationship {
    Finetune = 'finetune',
    Adapter = 'adapter',
    Quantized = 'quantized',
    Merge = 'merge',
    KnowledgeDistillation = 'knowledge_distillation',
}

export enum ParentSource {
    Handshake = 'handshake',
    HuggingFace = 'huggingface',
    Other = 'other',
}

export enum Quantization {
    None = 'none',
    Int8 = 'int8',
    Int4 = 'int4',
    GPTQ = 'gptq',
    AWQ = 'awq',
}

export enum BadgeLevel {
    Bronze = 'bronze',
    Silver = 'silver',
    Gold = 'gold',
    Platinum = 'platinum',
}

export enum Source {
    Handshake = 'handshake',
    HuggingFace = 'huggingface',
    Other = 'other',
}