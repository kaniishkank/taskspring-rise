import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const openMockFile = (filename: string) => {
  if (!filename) return;
  const trimmed = filename.trim();
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    window.open(trimmed, "_blank");
    return;
  }

  const fileType = trimmed.split(".").pop()?.toLowerCase();
  let content = "";
  let mime = "text/plain";

  if (fileType === "pdf") {
    content = `%PDF-1.4\n1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R >>\nendobj\n4 0 obj\n<< /Length 150 >>\nstream\nBT\n/F1 24 Tf\n100 700 Td\n(Mahatma Global Gateway TaskFlow) Tj\n/F1 14 Tf\n0 -50 Td\n(Mock Document Preview: ${trimmed}) Tj\n0 -30 Td\n(This is a verified proof of work attachment download.) Tj\nET\nendstream\nendobj\nxref\n0 5\n0000000000 65535 f\n0000000009 00000 n\n0000000062 00000 n\n0000000122 00000 n\n0000000215 00000 n\ntrailer\n<< /Size 5 /Root 1 0 R >>\nstartxref\n386\n%%EOF`;
    mime = "application/pdf";
  } else if (["png", "jpg", "jpeg", "gif", "svg"].includes(fileType || "")) {
    content = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 400" width="100%" height="100%">
      <rect width="600" height="400" fill="#f8fafc"/>
      <circle cx="300" cy="180" r="50" fill="#cbd5e1"/>
      <path d="M260 260 L340 260 L300 200 Z" fill="#94a3b8"/>
      <text x="300" y="270" font-family="sans-serif" font-size="16" font-weight="bold" fill="#475569" text-anchor="middle">
        Mock Image Proof: ${trimmed}
      </text>
      <text x="300" y="300" font-family="sans-serif" font-size="12" fill="#64748b" text-anchor="middle">
        Verified Proof of Work Attachment Preview
      </text>
    </svg>`;
    mime = "image/svg+xml";
  } else {
    content = `Mahatma Global Gateway TaskFlow\n\nMock Document Preview: ${trimmed}\n---------------------------------------\nThis is a verified mock attachment download for TaskFlow submissions.\n`;
    mime = "text/plain";
  }

  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  window.open(url, "_blank");
};
