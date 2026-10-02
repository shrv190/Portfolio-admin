"use client";
import { useState } from "react";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from "@/lib/firebase";

export default function ImageUpload({ onUpload }: { onUpload: (url: string) => void }) {
  const [method, setMethod] = useState<"link" | "upload">("link");
  const [link, setLink] = useState("");
  const [uploading, setUploading] = useState(false);

  const handleLinkSubmit = () => {
    if (link) onUpload(link);
    setLink("");
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const storageRef = ref(storage, `uploads/${Date.now()}_${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    setUploading(true);
    uploadTask.on(
      "state_changed",
      null,
      (error) => {
        console.error("Upload failed", error);
        setUploading(false);
      },
      async () => {
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
        onUpload(downloadURL);
        setUploading(false);
      }
    );
  };

  return (
    <div className="p-4 border rounded bg-slate-50 mb-4">
      <div className="flex gap-4 mb-4">
        <label className="flex items-center gap-2 text-sm font-medium">
          <input type="radio" checked={method === "link"} onChange={() => setMethod("link")} /> Use Link
        </label>
        <label className="flex items-center gap-2 text-sm font-medium">
          <input type="radio" checked={method === "upload"} onChange={() => setMethod("upload")} /> Upload File
        </label>
      </div>

      {method === "link" ? (
        <div className="flex gap-2">
          <input 
            type="text" 
            placeholder="Paste image URL..." 
            value={link} 
            onChange={e => setLink(e.target.value)}
            className="flex-1 p-2 border rounded"
          />
          <button type="button" onClick={handleLinkSubmit} className="bg-blue-600 text-white px-4 py-2 rounded">Add</button>
        </div>
      ) : (
        <div>
          <input type="file" accept="image/*" onChange={handleFileUpload} disabled={uploading} className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
          {uploading && <p className="text-sm text-blue-600 mt-2">Uploading...</p>}
        </div>
      )}
    </div>
  );
}
