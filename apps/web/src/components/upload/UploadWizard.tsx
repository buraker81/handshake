"use client"

import { useReducer } from "react"
import { CheckIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { wizardReducer, initialState } from "./wizardReducer"
import { Step1File } from "./Step1File"
import { Step2Identity } from "./Step2Identity"
import { Step3Lineage } from "./Step3Lineage"
import { Step4Enrich } from "./Step4Enrich"
import { Step5Summary } from "./Step5Summary"
import type { WizardState } from "./wizardTypes"

const STEPS = [
  { n: 1, label: "File" },
  { n: 2, label: "Identity" },
  { n: 3, label: "Lineage" },
  { n: 4, label: "Enrich" },
  { n: 5, label: "Review" },
] as const

function canAdvance(state: WizardState): boolean {
  switch (state.step) {
    case 1:
      return state.hashStatus === "done" && state.duplicateStatus === "ok"
    case 2:
      return (
        state.name.trim().length > 0 &&
        state.description.length >= 20 &&
        Boolean(state.task) &&
        Boolean(state.framework) &&
        Boolean(state.license)
      )
    case 3:
    case 4:
      return true
    case 5:
      return false
  }
}

function StepIndicator({ currentStep }: { currentStep: WizardState["step"] }) {
  return (
    <div className="flex items-center gap-0">
      {STEPS.map((step, idx) => {
        const done = currentStep > step.n
        const active = currentStep === step.n

        return (
          <div key={step.n} className="flex items-center">
            {/* Circle */}
            <div className="flex flex-col items-center gap-1.5">
              <div
                className={`
                  flex size-7 items-center justify-center rounded-full border text-xs font-medium transition-colors
                  ${done
                    ? "border-white/40 bg-white/10 text-white/70"
                    : active
                    ? "border-white bg-white text-black"
                    : "border-border bg-transparent text-muted-foreground"
                  }
                `}
              >
                {done ? <CheckIcon className="size-3.5" /> : step.n}
              </div>
              <span
                className={`text-[10px] whitespace-nowrap ${
                  active ? "text-foreground font-medium" : "text-muted-foreground"
                }`}
              >
                {step.label}
              </span>
            </div>
            {/* Connector */}
            {idx < STEPS.length - 1 && (
              <div
                className={`h-px w-10 sm:w-16 mb-5 mx-1 transition-colors ${
                  currentStep > step.n ? "bg-white/20" : "bg-border"
                }`}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}

export function UploadWizard() {
  const [state, dispatch] = useReducer(wizardReducer, initialState)

  const isLastStep = state.step === 5
  const isSuccess = state.uploadStatus === "success"
  const isUploading =
    state.uploadStatus === "getting_url" ||
    state.uploadStatus === "uploading_file" ||
    state.uploadStatus === "submitting"

  function handleNext() {
    if (state.step < 5)
      dispatch({ type: "SET_STEP", step: (state.step + 1) as WizardState["step"] })
  }

  function handleBack() {
    if (state.step > 1)
      dispatch({ type: "SET_STEP", step: (state.step - 1) as WizardState["step"] })
  }

  return (
    <div className="flex flex-col gap-8 p-6 max-w-3xl mx-auto w-full">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight">Upload Model</h1>
        <p className="text-sm text-muted-foreground">
          Register your model on Handshake — hashed, stored on IPFS, provenance-tracked.
        </p>
      </div>

      {/* Step indicator */}
      {!isSuccess && (
        <StepIndicator currentStep={state.step} />
      )}

      {/* Step content */}
      <div className="min-h-[340px]">
        {state.step === 1 && <Step1File state={state} dispatch={dispatch} />}
        {state.step === 2 && <Step2Identity state={state} dispatch={dispatch} />}
        {state.step === 3 && <Step3Lineage state={state} dispatch={dispatch} />}
        {state.step === 4 && <Step4Enrich state={state} dispatch={dispatch} />}
        {state.step === 5 && <Step5Summary state={state} dispatch={dispatch} />}
      </div>

      {/* Navigation footer — hidden on step 5 and after success */}
      {!isLastStep && !isSuccess && (
        <div className="flex items-center justify-between pt-4 border-t border-border/50">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={state.step === 1}
          >
            Back
          </Button>
          <Button
            onClick={handleNext}
            disabled={!canAdvance(state)}
          >
            Continue
          </Button>
        </div>
      )}

      {/* Back button on step 5 (before uploading) */}
      {isLastStep && !isSuccess && !isUploading && (
        <div className="pt-4 border-t border-border/50">
          <Button variant="outline" onClick={handleBack}>
            Back
          </Button>
        </div>
      )}
    </div>
  )
}
