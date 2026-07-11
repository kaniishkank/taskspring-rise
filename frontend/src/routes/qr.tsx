import { createFileRoute } from "@tanstack/react-router";
import { API_BASE } from "@/lib/api";

export const Route = createFileRoute("/qr")({
  component: QRPage,
});

function QRPage() {
  const qrUrl = `${API_BASE}/qr`;
  return (
    <div className="w-screen min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700">
        <div className="p-4 bg-primary text-primary-foreground text-center font-medium">
          TaskFlow WhatsApp Automation
        </div>
        <iframe 
          src={qrUrl}
          className="w-full h-[500px] border-0 bg-white"
          title="WhatsApp QR Login"
        />
        <div className="p-4 text-center text-sm text-muted-foreground bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
          Scan this QR code with your WhatsApp app to connect.
        </div>
      </div>
    </div>
  );
}
