import { toast } from "sonner"

export function printPdf(htmlContent: string) {
  const printWindow = window.open("", "_blank")
  if (!printWindow) {
    toast.error("Failed to open print window. Please allow popups.")
    return
  }

  // Set HTML content directly via documentElement
  printWindow.document.documentElement.innerHTML = htmlContent

  // Allow browser to parse/render, then trigger print & close
  setTimeout(() => {
    printWindow.print()
    printWindow.close()
  }, 300)
}
