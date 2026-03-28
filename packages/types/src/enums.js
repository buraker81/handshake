"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Source = exports.BadgeLevel = exports.Quantization = exports.ParentSource = exports.Relationship = exports.License = exports.Framework = exports.Task = void 0;
var Task;
(function (Task) {
    Task["TextGeneration"] = "text-generation";
    Task["ImageClassification"] = "image-classification";
    Task["ObjectDetection"] = "object-detection";
    Task["TextClassification"] = "text-classification";
    Task["TokenClassification"] = "token-classification";
    Task["QuestionAnswering"] = "question-answering";
    Task["Summarization"] = "summarization";
    Task["Translation"] = "translation";
    Task["TextToImage"] = "text-to-image";
    Task["ImageToText"] = "image-to-text";
    Task["AudioClassification"] = "audio-classification";
    Task["Other"] = "other";
})(Task || (exports.Task = Task = {}));
var Framework;
(function (Framework) {
    Framework["PyTorch"] = "pytorch";
    Framework["TensorFlow"] = "tensorflow";
    Framework["JAX"] = "jax";
    Framework["ONNX"] = "onnx";
    Framework["Other"] = "other";
})(Framework || (exports.Framework = Framework = {}));
var License;
(function (License) {
    License["Apache2"] = "apache-2.0";
    License["MIT"] = "mit";
    License["GPL3"] = "gpl-3.0";
    License["AGPL3"] = "agpl-3.0";
    License["CcBy4"] = "cc-by-4.0";
    License["CcByNc4"] = "cc-by-nc-4.0";
    License["Llama3"] = "llama-3";
    License["Gemma"] = "gemma";
    License["Other"] = "other";
})(License || (exports.License = License = {}));
var Relationship;
(function (Relationship) {
    Relationship["Finetune"] = "finetune";
    Relationship["Adapter"] = "adapter";
    Relationship["Quantized"] = "quantized";
    Relationship["Merge"] = "merge";
    Relationship["KnowledgeDistillation"] = "knowledge_distillation";
})(Relationship || (exports.Relationship = Relationship = {}));
var ParentSource;
(function (ParentSource) {
    ParentSource["Handshake"] = "handshake";
    ParentSource["HuggingFace"] = "huggingface";
    ParentSource["Other"] = "other";
})(ParentSource || (exports.ParentSource = ParentSource = {}));
var Quantization;
(function (Quantization) {
    Quantization["None"] = "none";
    Quantization["Int8"] = "int8";
    Quantization["Int4"] = "int4";
    Quantization["GPTQ"] = "gptq";
    Quantization["AWQ"] = "awq";
})(Quantization || (exports.Quantization = Quantization = {}));
var BadgeLevel;
(function (BadgeLevel) {
    BadgeLevel["Bronze"] = "bronze";
    BadgeLevel["Silver"] = "silver";
    BadgeLevel["Gold"] = "gold";
    BadgeLevel["Platinum"] = "platinum";
})(BadgeLevel || (exports.BadgeLevel = BadgeLevel = {}));
var Source;
(function (Source) {
    Source["Handshake"] = "handshake";
    Source["HuggingFace"] = "huggingface";
    Source["Other"] = "other";
})(Source || (exports.Source = Source = {}));
//# sourceMappingURL=enums.js.map