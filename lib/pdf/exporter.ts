import { toast } from "sonner"

export function printPdf(htmlContent: string) {
  const printWindow = window.open("", "_blank")
  if (!printWindow) {
    toast.error("Failed to open print window. Please allow popups.")
    return
  }

  // Set HTML content directly via documentElement
  printWindow.document.documentElement.innerHTML = htmlContent

  // Allow browser to parse/render, then trigger print
  setTimeout(() => {
    printWindow.focus()
    printWindow.print()

    // Check if on a mobile device.
    // On mobile, do NOT close the window automatically because:
    // 1. window.print() is non-blocking, so calling close() immediately cancels the print dialog/sheet.
    // 2. Keeping the window open allows mobile users to view the export, use the system share sheet, or manually print.
    const isMobile = /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent)
    if (!isMobile) {
      printWindow.close()
    }
  }, 300)
}
