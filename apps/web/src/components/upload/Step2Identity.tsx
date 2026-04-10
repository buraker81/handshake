"use client"

import type { Dispatch } from "react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Task, Framework, License } from "@handshake/types"
import type { WizardState, WizardAction } from "./wizardTypes"

const TASK_LABELS: Record<Task, string> = {
  [Task.TextGeneration]: "Text Generation",
  [Task.ImageClassification]: "Image Classification",
  [Task.ObjectDetection]: "Object Detection",
  [Task.TextClassification]: "Text Classification",
  [Task.TokenClassification]: "Token Classification",
  [Task.QuestionAnswering]: "Question Answering",
  [Task.Summarization]: "Summarization",
  [Task.Translation]: "Translation",
  [Task.TextToImage]: "Text to Image",
  [Task.ImageToText]: "Image to Text",
  [Task.AudioClassification]: "Audio Classification",
  [Task.Other]: "Other",
}

const LICENSE_LABELS: Record<License, string> = {
  [License.Apache2]: "Apache 2.0",
  [License.MIT]: "MIT",
  [License.GPL3]: "GPL 3.0",
  [License.AGPL3]: "AGPL 3.0",
  [License.CcBy4]: "CC BY 4.0",
  [License.CcByNc4]: "CC BY-NC 4.0",
  [License.Llama3]: "Llama 3 Community",
  [License.Gemma]: "Gemma",
  [License.Other]: "Other",
}

interface Props {
  state: WizardState
  dispatch: Dispatch<WizardAction>
}

export function Step2Identity({ state, dispatch }: Props) {
  type IdentityPayload = Partial<Pick<WizardState, "name" | "description" | "version" | "task" | "framework" | "license">>
  function patch(payload: IdentityPayload) {
    dispatch({ type: "PATCH_IDENTITY", payload })
  }

  const descLen = state.description.length
  const descValid = descLen >= 20

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold">Model Identity</h2>
        <p className="text-sm text-muted-foreground mt-0.5">
          Basic metadata — required for registration.
        </p>
      </div>

      <div className="grid gap-5">
        {/* Name */}
        <div className="space-y-1.5">
          <Label htmlFor="name">
            Name <span className="text-destructive">*</span>
          </Label>
          <Input
            id="name"
            placeholder="e.g. llama-3-8b-instruct-tr"
            value={state.name}
            onChange={(e) => patch({ name: e.target.value })}
          />
        </div>

        {/* Description */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <Label htmlFor="description">
              Description <span className="text-destructive">*</span>
            </Label>
            <span className={`text-xs ${descValid ? "text-tx-confirmed" : "text-muted-foreground"}`}>
              {descLen}/20 min
            </span>
          </div>
          <Textarea
            id="description"
            placeholder="Describe what this model does, how it was trained, and its use case…"
            rows={4}
            value={state.description}
            onChange={(e) => patch({ description: e.target.value })}
            className={!descValid && descLen > 0 ? "border-destructive/50" : ""}
          />
          {!descValid && descLen > 0 && (
            <p className="text-xs text-destructive">Minimum 20 characters required.</p>
          )}
        </div>

        {/* Version */}
        <div className="space-y-1.5">
          <Label htmlFor="version">Version</Label>
          <Input
            id="version"
            placeholder="1.0.0"
            value={state.version}
            onChange={(e) => patch({ version: e.target.value })}
          />
          <p className="text-xs text-muted-foreground">Semantic versioning — e.g. 1.0.0, 2.1.3</p>
        </div>

        {/* Task + Framework */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label>
              Task <span className="text-destructive">*</span>
            </Label>
            <Select
              value={state.task || ""}
              onValueChange={(v) => patch({ task: v as Task })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select task…" />
              </SelectTrigger>
              <SelectContent>
                {Object.values(Task).map((t) => (
                  <SelectItem key={t} value={t}>
                    {TASK_LABELS[t]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label>
              Framework <span className="text-destructive">*</span>
            </Label>
            <Select
              value={state.framework || ""}
              onValueChange={(v) => patch({ framework: v as Framework })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select framework…" />
              </SelectTrigger>
              <SelectContent>
                {Object.values(Framework).map((f) => (
                  <SelectItem key={f} value={f}>
                    {f.charAt(0).toUpperCase() + f.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* License */}
        <div className="space-y-1.5">
          <Label>
            License <span className="text-destructive">*</span>
          </Label>
          <Select
            value={state.license || ""}
            onValueChange={(v) => patch({ license: v as License })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select license…" />
            </SelectTrigger>
            <SelectContent>
              {Object.values(License).map((l) => (
                <SelectItem key={l} value={l}>
                  <span className="font-mono text-xs mr-2 text-muted-foreground">{l}</span>
                  {LICENSE_LABELS[l]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  )
}
