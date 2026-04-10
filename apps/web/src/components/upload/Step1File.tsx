"use client"

import { useEffect, useRef, useState, type Dispatch } from "react"
import { UploadCloudIcon, FileIcon, CheckCircle2Icon, AlertCircleIcon, Loader2Icon } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { hashFile } from "@/utils/blake3"
import { checkModelHash } from "@/services/api"
import type { WizardState, WizardAction } from "./wizardTypes"

const ACCEPTED_EXTENSIONS = [".safetensors", ".bin", ".pt", ".gguf", ".onnx", ".txt"]

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 ** 2) return `${(bytes / 1024).toFixed(1)} KB`
  if (bytes < 1024 ** 3) return `${(bytes / 1024 ** 2).toFixed(1)} MB`
  return `${(bytes / 1024 ** 3).toFixed(2)} GB`
}

interface Props {
  state: WizardState
  dispatch: Dispatch<WizardAction>
}

export function Step1File({ state, dispatch }: Props) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [dragging, setDragging] = useState(false)

  // Trigger hashing when a file is set
  useEffect(() => {
    if (!state.file || state.hashStatus !== "hashing") return
    let cancelled = false

    hashFile(state.file, (pct) => {
      if (!cancelled) dispatch({ type: "SET_HASH_PROGRESS", progress: pct })
    })
      .then((hash) => {
        if (!cancelled) dispatch({ type: "SET_HASH_DONE", hash })
      })
      .catch(() => {
        if (!cancelled) dispatch({ type: "SET_ERROR", message: "Failed to hash file" })
      })

    return () => { cancelled = true }
  }, [state.file, state.hashStatus, dispatch])

  // Check duplicate after hash is done
  useEffect(() => {
    if (state.duplicateStatus !== "checking" || !state.modelHash) return
    let cancelled = false

    checkModelHash(state.modelHash)
      .then(({ exists }) => {
        if (!cancelled)
          dispatch({ type: "SET_DUPLICATE_STATUS", status: exists ? "duplicate" : "ok" })
      })
      .catch(() => {
        if (!cancelled) dispatch({ type: "SET_DUPLICATE_STATUS", status: "ok" })
      })

    return () => { cancelled = true }
  }, [state.duplicateStatus, state.modelHash, dispatch])

  function handleFile(file: File) {
    dispatch({ type: "SET_FILE", file })
  }

  function onDrop(e: React.DragEvent) {
    e.preventDefault()
    setDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }

  function onInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) handleFile(file)
  }

  const isIdle = !state.file
  const isHashing = state.hashStatus === "hashing"
  const isDuplicate = state.duplicateStatus === "duplicate"
  const isOk = state.hashStatus === "done" && state.duplicateStatus === "ok"
  const isChecking = state.duplicateStatus === "checking"

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold">Upload Model File</h2>
        <p className="text-sm text-muted-foreground mt-0.5">
          Your file is hashed locally — it never touches our servers unencrypted.
        </p>
      </div>

      {isIdle ? (
        <div
          onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
          onDragLeave={() => setDragging(false)}
          onDrop={onDrop}
          onClick={() => inputRef.current?.click()}
          className={`
            flex flex-col items-center justify-center gap-4 rounded-xl border-2 border-dashed
            min-h-[280px] cursor-pointer transition-colors select-none
            ${dragging
              ? "border-white/40 bg-white/5"
              : "border-border hover:border-white/20 hover:bg-white/[0.02]"
            }
          `}
        >
          <div className="flex size-14 items-center justify-center rounded-full bg-white/5">
            <UploadCloudIcon className="size-7 text-muted-foreground" />
          </div>
          <div className="text-center space-y-1">
            <p className="text-sm font-medium">Drop your model file here</p>
            <p className="text-xs text-muted-foreground">
              {ACCEPTED_EXTENSIONS.join("  ·  ")}
            </p>
          </div>
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span className="h-px w-12 bg-border" />
            or
            <span className="h-px w-12 bg-border" />
          </div>
          <p className="text-xs text-muted-foreground/60">Max 25 GB</p>
          <input
            ref={inputRef}
            type="file"
            accept={ACCEPTED_EXTENSIONS.join(",")}
            className="hidden"
            onChange={onInputChange}
          />
        </div>
      ) : (
        <div className="rounded-xl border border-border bg-card/50 p-5 space-y-4">
          {/* File header */}
          <div className="flex items-start gap-3">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-white/5">
              {isOk ? (
                <CheckCircle2Icon className="size-5 text-tx-confirmed" />
              ) : isDuplicate ? (
                <AlertCircleIcon className="size-5 text-destructive" />
              ) : (
                <FileIcon className="size-5 text-muted-foreground" />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium truncate">{state.file?.name}</p>
              <p className="text-xs text-muted-foreground">{state.file ? formatBytes(state.file.size) : ""}</p>
            </div>
            <button
              onClick={() => {
                dispatch({ type: "SET_FILE", file: state.file! })
                // Reset by re-dispatching a fresh file pick
                inputRef.current?.click()
              }}
              className="text-xs text-muted-foreground hover:text-foreground transition-colors shrink-0"
              type="button"
            >
              Change
            </button>
            <input
              ref={inputRef}
              type="file"
              accept={ACCEPTED_EXTENSIONS.join(",")}
              className="hidden"
              onChange={onInputChange}
            />
          </div>

          {/* Hashing progress */}
          {isHashing && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <Loader2Icon className="size-3 animate-spin" />
                  Computing blake3 hash…
                </span>
                <span>{state.hashProgress}%</span>
              </div>
              <Progress value={state.hashProgress} className="h-1.5" />
            </div>
          )}

          {/* Duplicate check spinner */}
          {isChecking && (
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Loader2Icon className="size-3 animate-spin" />
              Checking for duplicates…
            </div>
          )}

          {/* Success state */}
          {isOk && (
            <div className="space-y-2">
              <div className="flex items-center gap-1.5 text-xs text-tx-confirmed">
                <CheckCircle2Icon className="size-3.5" />
                Unique — no duplicate found
              </div>
              <p className="font-mono text-xs text-muted-foreground break-all">
                blake3: {state.modelHash.slice(0, 16)}…{state.modelHash.slice(-8)}
              </p>
            </div>
          )}

          {/* Duplicate state */}
          {isDuplicate && (
            <div className="rounded-lg bg-destructive/10 border border-destructive/30 p-3 space-y-1">
              <div className="flex items-center gap-1.5 text-sm font-medium text-destructive">
                <AlertCircleIcon className="size-4" />
                This model is already registered
              </div>
              <p className="text-xs text-destructive/80">
                A model with this exact file hash exists on Handshake. Upload a different file or view the existing model.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
