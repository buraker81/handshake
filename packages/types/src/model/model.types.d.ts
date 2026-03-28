import { Relationship, Source } from "../enums";
export interface IBlockchainRecord {
    txHash?: string;
    blockNumber?: number;
    contractAddress?: string;
    chainId?: number;
    registeredAt?: Date;
}
export interface IBenchmark {
    name: string;
    score?: number;
    metric?: string;
    date?: string;
}
export interface IEvaluation {
    benchmarks?: IBenchmark[];
    limitations?: string;
}
export interface IDataset {
    name: string;
    sourceId?: string;
    license?: string;
}
export interface ITrainingData {
    summary?: string;
    datasets?: IDataset[];
    privacyMeasures?: string;
}
export interface IParentRef {
    name: string;
    source: Source;
    relationship: Relationship;
    handshakeId?: string;
    modelHash?: string;
    externalId?: string;
}
export interface IModel {
    _id: string;
    name: string;
    description?: string;
    version: string;
    task: string;
    framework: string;
    license: string;
    size?: number;
    modelType?: string;
    parameters?: string;
    contextLength?: number;
    quantization?: string;
    ownerAddress: string;
    modelFileCid: string;
    metadataCid: string;
    modelHash: string;
    baseModel?: IParentRef[];
    trainingData?: ITrainingData;
    tags?: string[];
    evaluation?: IEvaluation;
    languages?: string[];
    intendedUse?: string;
    blockchain?: IBlockchainRecord;
    onChainRegistered: boolean;
    createdAt: Date;
    updatedAt: Date;
}
