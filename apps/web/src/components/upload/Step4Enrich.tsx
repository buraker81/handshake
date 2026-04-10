"use client"

import { useState, type Dispatch, type KeyboardEvent } from "react"
import { PlusIcon, Trash2Icon, XIcon } from "lucide-react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Quantization } from "@handshake/types"
import type { IDataset, IBenchmark } from "@handshake/types"
import type { WizardState, WizardAction } from "./wizardTypes"

interface Props {
  state: WizardState
  dispatch: Dispatch<WizardAction>
}

function SectionHeader({ title, description }: { title: string; description: string }) {
  return (
    <div className="pb-3 border-b border-border/50">
      <p className="text-sm font-semibold">{title}</p>
      <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
    </div>
  )
}

export function Step4Enrich({ state, dispatch }: Props) {
  const [tagInput, setTagInput] = useState("")
  const [langInput, setLangInput] = useState("")
  const [datasetForm, setDatasetForm] = useState<IDataset>({ name: "", sourceId: "", license: "" })
  const [showDatasetForm, setShowDatasetForm] = useState(false)
  const [benchmarkForm, setBenchmarkForm] = useState<{ name: string; score: string; metric: string; date: string }>({ name: "", score: "", metric: "", date: "" })
  const [showBenchmarkForm, setShowBenchmarkForm] = useState(false)

  function addTag(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key !== "Enter" && e.key !== ",") return
    e.preventDefault()
    const tag = tagInput.trim().toLowerCase()
    if (tag && !state.tags.includes(tag)) {
      dispatch({ type: "PATCH_ENRICH", payload: { tags: [...state.tags, tag] } })
    }
    setTagInput("")
  }

  function removeTag(tag: string) {
    dispatch({ type: "PATCH_ENRICH", payload: { tags: state.tags.filter((t) => t !== tag) } })
  }

  function addLanguage(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key !== "Enter" && e.key !== ",") return
    e.preventDefault()
    const lang = langInput.trim().toLowerCase()
    if (lang && !state.languages.includes(lang)) {
      dispatch({ type: "PATCH_ENRICH", payload: { languages: [...state.languages, lang] } })
    }
    setLangInput("")
  }

  function removeLanguage(lang: string) {
    dispatch({ type: "PATCH_ENRICH", payload: { languages: state.languages.filter((l) => l !== lang) } })
  }

  function addDataset() {
    if (!datasetForm.name.trim()) return
    const dataset: IDataset = {
      name: datasetForm.name.trim(),
      ...(datasetForm.sourceId ? { sourceId: datasetForm.sourceId.trim() } : {}),
      ...(datasetForm.license ? { license: datasetForm.license.trim() } : {}),
    }
    dispatch({
      type: "PATCH_ENRICH",
      payload: { trainingData: { ...state.trainingData, datasets: [...state.trainingData.datasets, dataset] } },
    })
    setDatasetForm({ name: "", sourceId: "", license: "" })
    setShowDatasetForm(false)
  }

  function removeDataset(i: number) {
    dispatch({
      type: "PATCH_ENRICH",
      payload: {
        trainingData: {
          ...state.trainingData,
          datasets: state.trainingData.datasets.filter((_, idx) => idx !== i),
        },
      },
    })
  }

  function addBenchmark() {
    if (!benchmarkForm.name.trim()) return
    const benchmark: IBenchmark = {
      name: benchmarkForm.name.trim(),
      ...(benchmarkForm.score !== "" ? { score: parseFloat(benchmarkForm.score) } : {}),
      ...(benchmarkForm.metric ? { metric: benchmarkForm.metric.trim() } : {}),
      ...(benchmarkForm.date ? { date: benchmarkForm.date.trim() } : {}),
    }
    dispatch({
      type: "PATCH_ENRICH",
      payload: { evaluation: { ...state.evaluation, benchmarks: [...state.evaluation.benchmarks, benchmark] } },
    })
    setBenchmarkForm({ name: "", score: "", metric: "", date: "" })
    setShowBenchmarkForm(false)
  }

  function removeBenchmark(i: number) {
    dispatch({
      type: "PATCH_ENRICH",
      payload: {
        evaluation: {
          ...state.evaluation,
          benchmarks: state.evaluation.benchmarks.filter((_, idx) => idx !== i),
        },
      },
    })
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-lg font-semibold">Enrich Metadata</h2>
        <p className="text-sm text-muted-foreground mt-0.5">
          All fields optional — each one improves your provenance score and discoverability.
        </p>
      </div>

      {/* ── Model Details ──────────────────────────────────────────── */}
      <div className="space-y-4">
        <SectionHeader
          title="Model Details"
          description="Architecture and capability metadata."
        />
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label className="text-xs">Model type / architecture</Label>
            <Input
              placeholder="e.g. Llama-3, Mistral, ViT-L"
              value={state.modelType}
              onChange={(e) => dispatch({ type: "PATCH_ENRICH", payload: { modelType: e.target.value } })}
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Parameters</Label>
            <Input
              placeholder="e.g. 7B, 13B, 70B"
              value={state.parameters}
              onChange={(e) => dispatch({ type: "PATCH_ENRICH", payload: { parameters: e.target.value } })}
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Context length</Label>
            <Input
              type="number"
              placeholder="e.g. 8192"
              value={state.contextLength}
              onChange={(e) => dispatch({ type: "PATCH_ENRICH", payload: { contextLength: e.target.value } })}
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Quantization</Label>
            <Select
              value={state.quantization || "none_placeholder"}
              onValueChange={(v) =>
                dispatch({ type: "PATCH_ENRICH", payload: { quantization: v === "none_placeholder" ? "" : v as Quantization } })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="None" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none_placeholder">None</SelectItem>
                {Object.values(Quantization).filter(q => q !== Quantization.None).map((q) => (
                  <SelectItem key={q} value={q}>{q.toUpperCase()}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* ── Training Data ──────────────────────────────────────────── */}
      <div className="space-y-4">
        <SectionHeader
          title="Training Data"
          description="Datasets used and privacy measures — EU AI Act Annex IV."
        />

        <div className="space-y-1.5">
          <Label className="text-xs">Training summary</Label>
          <Textarea
            placeholder="Brief description of how the model was trained…"
            rows={3}
            value={state.trainingData.summary}
            onChange={(e) =>
              dispatch({ type: "PATCH_ENRICH", payload: { trainingData: { ...state.trainingData, summary: e.target.value } } })
            }
          />
        </div>

        {/* Datasets */}
        <div className="space-y-2">
          <Label className="text-xs">Datasets</Label>
          {state.trainingData.datasets.map((ds, i) => (
            <div key={i} className="flex items-center gap-2 rounded-lg border border-border bg-card/50 px-3 py-2">
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium truncate">{ds.name}</p>
                {(ds.sourceId || ds.license) && (
                  <p className="text-xs text-muted-foreground truncate">
                    {[ds.sourceId, ds.license].filter(Boolean).join(" · ")}
                  </p>
                )}
              </div>
              <button type="button" onClick={() => removeDataset(i)} className="text-muted-foreground hover:text-destructive transition-colors shrink-0">
                <Trash2Icon className="size-3.5" />
              </button>
            </div>
          ))}
          {showDatasetForm ? (
            <div className="rounded-lg border border-border p-3 space-y-3">
              <div className="space-y-1.5">
                <Label className="text-xs">Dataset name *</Label>
                <Input
                  placeholder="e.g. OpenHermes-2.5"
                  value={datasetForm.name}
                  onChange={(e) => setDatasetForm({ ...datasetForm, name: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1.5">
                  <Label className="text-xs">Source ID / URL</Label>
                  <Input
                    placeholder="teknium/OpenHermes-2.5"
                    value={datasetForm.sourceId}
                    onChange={(e) => setDatasetForm({ ...datasetForm, sourceId: e.target.value })}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">License</Label>
                  <Input
                    placeholder="cc-by-4.0"
                    value={datasetForm.license}
                    onChange={(e) => setDatasetForm({ ...datasetForm, license: e.target.value })}
                  />
                </div>
              </div>
              <div className="flex gap-2 justify-end">
                <Button variant="outline" size="sm" onClick={() => { setDatasetForm({ name: "", sourceId: "", license: "" }); setShowDatasetForm(false) }}>
                  Cancel
                </Button>
                <Button size="sm" onClick={addDataset} disabled={!datasetForm.name.trim()}>
                  Add
                </Button>
              </div>
            </div>
          ) : (
            <Button variant="outline" size="sm" onClick={() => setShowDatasetForm(true)} className="w-full border-dashed">
              <PlusIcon className="size-3.5 mr-1.5" />
              Add dataset
            </Button>
          )}
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs">Privacy measures</Label>
          <Textarea
            placeholder="GDPR compliance, PII handling, data anonymization details…"
            rows={2}
            value={state.trainingData.privacyMeasures}
            onChange={(e) =>
              dispatch({ type: "PATCH_ENRICH", payload: { trainingData: { ...state.trainingData, privacyMeasures: e.target.value } } })
            }
          />
        </div>
      </div>

      {/* ── Evaluation ────────────────────────────────────────────── */}
      <div className="space-y-4">
        <SectionHeader
          title="Evaluation"
          description="Benchmark results and known limitations."
        />

        {/* Benchmarks */}
        <div className="space-y-2">
          <Label className="text-xs">Benchmarks</Label>
          {state.evaluation.benchmarks.map((bm, i) => (
            <div key={i} className="flex items-center gap-2 rounded-lg border border-border bg-card/50 px-3 py-2">
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium">{bm.name}</p>
                {(bm.score !== undefined || bm.metric) && (
                  <p className="text-xs text-muted-foreground">
                    {bm.score !== undefined ? `${bm.score}` : ""}
                    {bm.metric ? ` ${bm.metric}` : ""}
                  </p>
                )}
              </div>
              <button type="button" onClick={() => removeBenchmark(i)} className="text-muted-foreground hover:text-destructive transition-colors">
                <Trash2Icon className="size-3.5" />
              </button>
            </div>
          ))}
          {showBenchmarkForm ? (
            <div className="rounded-lg border border-border p-3 space-y-3">
              <div className="space-y-1.5">
                <Label className="text-xs">Benchmark name *</Label>
                <Input
                  placeholder="e.g. MMLU, HumanEval, ARC-C"
                  value={benchmarkForm.name}
                  onChange={(e) => setBenchmarkForm({ ...benchmarkForm, name: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div className="space-y-1.5">
                  <Label className="text-xs">Score</Label>
                  <Input
                    type="number"
                    placeholder="78.5"
                    value={benchmarkForm.score}
                    onChange={(e) => setBenchmarkForm({ ...benchmarkForm, score: e.target.value })}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Metric</Label>
                  <Input
                    placeholder="accuracy"
                    value={benchmarkForm.metric}
                    onChange={(e) => setBenchmarkForm({ ...benchmarkForm, metric: e.target.value })}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Date</Label>
                  <Input
                    placeholder="2024-10"
                    value={benchmarkForm.date}
                    onChange={(e) => setBenchmarkForm({ ...benchmarkForm, date: e.target.value })}
                  />
                </div>
              </div>
              <div className="flex gap-2 justify-end">
                <Button variant="outline" size="sm" onClick={() => { setBenchmarkForm({ name: "", score: "", metric: "", date: "" }); setShowBenchmarkForm(false) }}>
                  Cancel
                </Button>
                <Button size="sm" onClick={addBenchmark} disabled={!benchmarkForm.name.trim()}>
                  Add
                </Button>
              </div>
            </div>
          ) : (
            <Button variant="outline" size="sm" onClick={() => setShowBenchmarkForm(true)} className="w-full border-dashed">
              <PlusIcon className="size-3.5 mr-1.5" />
              Add benchmark
            </Button>
          )}
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs">Limitations</Label>
          <Textarea
            placeholder="Known failure modes, biases, edge cases, out-of-distribution behavior…"
            rows={3}
            value={state.evaluation.limitations}
            onChange={(e) =>
              dispatch({ type: "PATCH_ENRICH", payload: { evaluation: { ...state.evaluation, limitations: e.target.value } } })
            }
          />
        </div>
      </div>

      {/* ── Discovery ─────────────────────────────────────────────── */}
      <div className="space-y-4">
        <SectionHeader
          title="Discovery & Compliance"
          description="Tags, languages, and EU AI Act intended use field."
        />

        {/* Tags */}
        <div className="space-y-1.5">
          <Label className="text-xs">Tags</Label>
          <div className="flex flex-wrap gap-1.5 min-h-[2rem]">
            {state.tags.map((tag) => (
              <span key={tag} className="inline-flex items-center gap-1 rounded-full bg-secondary px-2 py-0.5 text-xs">
                {tag}
                <button type="button" onClick={() => removeTag(tag)} className="text-muted-foreground hover:text-foreground">
                  <XIcon className="size-2.5" />
                </button>
              </span>
            ))}
          </div>
          <Input
            placeholder="Type a tag and press Enter…"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={addTag}
          />
        </div>

        {/* Languages */}
        <div className="space-y-1.5">
          <Label className="text-xs">Languages</Label>
          <div className="flex flex-wrap gap-1.5 min-h-[2rem]">
            {state.languages.map((lang) => (
              <Badge key={lang} variant="secondary" className="text-xs gap-1">
                {lang}
                <button type="button" onClick={() => removeLanguage(lang)}>
                  <XIcon className="size-2.5" />
                </button>
              </Badge>
            ))}
          </div>
          <Input
            placeholder="Type a language code (en, tr, de…) and press Enter"
            value={langInput}
            onChange={(e) => setLangInput(e.target.value)}
            onKeyDown={addLanguage}
          />
        </div>

        {/* Intended use */}
        <div className="space-y-1.5">
          <Label className="text-xs">Intended use (EU AI Act Annex IV)</Label>
          <Textarea
            placeholder="Describe the purpose, target users, and deployment context of this model…"
            rows={4}
            value={state.intendedUse}
            onChange={(e) => dispatch({ type: "PATCH_ENRICH", payload: { intendedUse: e.target.value } })}
          />
        </div>
      </div>
    </div>
  )
}
