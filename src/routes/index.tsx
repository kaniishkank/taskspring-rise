import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: MGGApp,
});

function MGGApp() {
  return (
    <iframe
      src="/mgg.html"
      title="Mahatma Global Gateway"
      style={{
        position: "fixed",
        inset: 0,
        width: "100vw",
        height: "100vh",
        border: 0,
      }}
    />
  );
}