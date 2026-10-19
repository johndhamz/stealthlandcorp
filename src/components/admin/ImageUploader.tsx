"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { ArrowDown, ArrowUp, ImagePlus, Loader2, Trash2 } from "lucide-react";
import { getBrowserClient } from "@/lib/supabase/client";
import { btn, input, label as labelCls } from "./ui";

interface Props {
  name: string;
  label: string;
  initial: string[];
  folder: string;
  hint?: string;
  single?: boolean;
}

/** Uploads to the property-images bucket and keeps an ordered list of URLs in a hidden input. */
export function ImageUploader({ name, label, initial, folder, hint, single }: Props) {
  const [urls, setUrls] = useState<string[]>(initial);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [manual, setManual] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  async function upload(files: FileList | null) {
    if (!files?.length) return;
    setBusy(true);
    setError(null);
    try {
      const supabase = getBrowserClient();
      const added: string[] = [];
      for (const file of Array.from(files)) {
        const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
        const path = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
        const { error: upErr } = await supabase.storage.from("property-images").upload(path, file, { cacheControl: "31536000", upsert: false });
        if (upErr) throw upErr;
        const { data } = supabase.storage.from("property-images").getPublicUrl(path);
        added.push(data.publicUrl);
      }
      setUrls((u) => (single ? added.slice(-1) : [...u, ...added]));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setBusy(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  function move(i: number, dir: -1 | 1) {
    setUrls((u) => {
      const next = [...u];
      const j = i + dir;
      if (j < 0 || j >= next.length) return u;
      [next[i], next[j]] = [next[j], next[i]];
      return next;
    });
  }

  return (
    <div>
      <span className={labelCls}>{label}</span>
      <input type="hidden" name={name} value={single ? urls[0] ?? "" : JSON.stringify(urls)} />
      {urls.length > 0 && (
        <ul className={`mb-3 grid gap-3 ${single ? "grid-cols-1 sm:max-w-xs" : "grid-cols-2 sm:grid-cols-4"}`}>
          {urls.map((u, i) => (
            <li key={`${u}-${i}`} className="group relative aspect-[4/3] overflow-hidden rounded-lg border border-navy-900/10 bg-cream">
              <Image src={u} alt="" fill sizes="200px" className="object-cover" unoptimized={u.startsWith("http://")} />
              <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-1 bg-navy-950/70 p-1.5 opacity-0 transition group-hover:opacity-100">
                {!single && (
                  <span className="flex gap-1">
                    <button type="button" onClick={() => move(i, -1)} aria-label="Move up" className="rounded bg-white/10 p-1 text-white hover:bg-gold-500 hover:text-navy-900"><ArrowUp className="size-3.5" /></button>
                    <button type="button" onClick={() => move(i, 1)} aria-label="Move down" className="rounded bg-white/10 p-1 text-white hover:bg-gold-500 hover:text-navy-900"><ArrowDown className="size-3.5" /></button>
                  </span>
                )}
                <button type="button" onClick={() => setUrls((x) => x.filter((_, k) => k !== i))} aria-label="Remove" className="rounded bg-white/10 p-1 text-white hover:bg-red-500"><Trash2 className="size-3.5" /></button>
              </div>
              {i === 0 && !single && <span className="absolute left-1.5 top-1.5 rounded bg-gold-500 px-1.5 py-0.5 text-[10px] font-semibold text-navy-900">Cover</span>}
            </li>
          ))}
        </ul>
      )}
      <div className="flex flex-wrap items-center gap-2">
        <label className={`${btn.secondary} cursor-pointer`}>
          {busy ? <Loader2 className="size-4 animate-spin" /> : <ImagePlus className="size-4" />}
          {busy ? "Uploading" : single ? "Choose image" : "Upload images"}
          <input ref={fileRef} type="file" accept="image/*" multiple={!single} className="hidden" onChange={(e) => upload(e.target.files)} disabled={busy} />
        </label>
        <input
          value={manual}
          onChange={(e) => setManual(e.target.value)}
          placeholder="or paste an image URL / path"
          className={`${input} max-w-xs !py-2`}
          onKeyDown={(e) => {
            if (e.key === "Enter" && manual.trim()) {
              e.preventDefault();
              setUrls((u) => (single ? [manual.trim()] : [...u, manual.trim()]));
              setManual("");
            }
          }}
        />
        <button type="button" onClick={() => { if (manual.trim()) { setUrls((u) => (single ? [manual.trim()] : [...u, manual.trim()])); setManual(""); } }} className={btn.secondary}>
          Add
        </button>
      </div>
      {hint && <p className="mt-1 text-xs text-navy-600">{hint}</p>}
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}
