"use client";

import { useState } from "react";
import { generateQRCode } from "./utils/generateQRCode";

export default function Home() {
  const [link, setLink] = useState("");
  const [logo, setLogo] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setLogo(reader.result as string); // Base64 Image
    };
    reader.readAsDataURL(file);
  };

  const handleGenerate = async () => {
    if (!link.trim()) {
      alert("Bitte einen Link eingeben.");
      return;
    }

    setLoading(true);

    try {
      await generateQRCode({
        link,
        logoSrc: logo ?? undefined,
        fileName: "QR-Code",
      });
    } catch (error) {
      console.error(error);
      alert("Fehler beim Generieren.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex justify-center items-center bg-gray-100 p-8 min-h-screen text-indigo-700">
      <div className="space-y-6 bg-white shadow-xl p-8 rounded-2xl w-full max-w-xl">
        <h1 className="font-bold text-3xl text-center">QR-Code Generator</h1>

        {/* Link Input */}
        <div className="space-y-2">
          <label className="font-medium">Link</label>
          <input
            value={link}
            onChange={(e) => setLink(e.target.value)}
            placeholder="https://example.com"
            className="p-3 border rounded-lg w-full"
          />
        </div>

        {/* Logo Upload */}
        <div className="space-y-2">
          <label className="font-medium">Logo (optional)</label>

          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full"
          />

          {logo && (
            <img
              src={logo}
              alt="Logo Preview"
              className="mt-2 border rounded h-20 object-contain"
            />
          )}
        </div>

        {/* Button */}
        <button
          onClick={handleGenerate}
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 py-3 rounded-lg w-full font-semibold text-white"
        >
          {loading ? "Erzeuge QR-Code..." : "QR-Code herunterladen"}
        </button>
      </div>
    </main>
  );
}
