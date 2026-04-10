import { AuthGate } from "@/components/AuthGate"
import { UploadWizard } from "@/components/upload/UploadWizard"

export default function UploadPage() {
  return (
    <AuthGate>
      <UploadWizard />
    </AuthGate>
  )
}
