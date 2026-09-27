"use client";

import { CSSProperties, FormEvent, KeyboardEvent, MouseEvent, useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { Check, Clipboard, ExternalLink, Eye, EyeOff, Globe2, GripVertical, ImagePlus, KeyRound, Layers3, LayoutGrid, Link2, LoaderCircle, LockKeyhole, PackagePlus, Pencil, Plus, Rows3, Save, Sparkles, Trash2, UserRound, X } from "lucide-react";
import { toast } from "sonner";

import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { ProjectCardSkeleton } from "@/components/project-card-skeleton";

const COLOR_THEMES = {
  orange: { name: "Orange", accent: "#f97316", soft: "rgba(249,115,22,.12)", border: "rgba(249,115,22,.28)" },
  blue: { name: "Blue", accent: "#3b82f6", soft: "rgba(59,130,246,.12)", border: "rgba(59,130,246,.28)" },
  emerald: { name: "Emerald", accent: "#10b981", soft: "rgba(16,185,129,.12)", border: "rgba(16,185,129,.28)" },
  violet: { name: "Violet", accent: "#8b5cf6", soft: "rgba(139,92,246,.12)", border: "rgba(139,92,246,.28)" },
  rose: { name: "Rose", accent: "#f43f5e", soft: "rgba(244,63,94,.12)", border: "rgba(244,63,94,.28)" },
  cyan: { name: "Cyan", accent: "#06b6d4", soft: "rgba(6,182,212,.12)", border: "rgba(6,182,212,.28)" },
} as const;
type ProductColor = keyof typeof COLOR_THEMES;
type ViewMode = "cards" | "compact";
type LinkKind = "Site" | "Figma" | "Prototype";
export type Product = { id: number; industry: string; name: string; idea: string; link: string; password: string; color: ProductColor; logoUrl: string; featured: boolean | number; sortOrder: number };
type ProductDraft = Omit<Product, "id" | "sortOrder">;
const EMPTY_DRAFT: ProductDraft = { industry: "", name: "", idea: "", link: "", password: "", color: "orange", logoUrl: "", featured: false };
type BoardProfile = { linkedinUrl: string; avatarUrl: string };
const EMPTY_PROFILE: BoardProfile = { linkedinUrl: "", avatarUrl: "" };
const PORTFOLIO_URL = "https://vitaliydiduh.com/";
const PORTFOLIO_FAVICON_URL = "https://framerusercontent.com/images/Uwv9M4ULthNabbANJCvPkyWWw70.png";

function tagsFromIndustry(value: string) { return value.split(",").map((tag) => tag.trim()).filter(Boolean); }

function normaliseLink(value: string) {
  const trimmed = value.trim();
  if (!trimmed) return "";
  return /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
}

function getHost(value: string) {
  try { return new URL(normaliseLink(value)).host.replace(/^www\./, ""); } catch { return value; }
}

function getDisplayLink(value: string) {
  try {
    const url = new URL(normaliseLink(value));
    const host = url.host.replace(/^www\./, "");
    const parts = url.pathname.split("/").filter((part) => part.length > 0 && part.length < 18);
    if (!parts.length) return host;
    return `${host}/${parts.slice(0, 2).join("/")}`;
  } catch { return value; }
}

function getLinkKind(value: string): LinkKind {
  try {
    const url = new URL(normaliseLink(value));
    const host = url.host.replace(/^www\./, "").toLowerCase();
    if (host === "figma.com" || host.endsWith(".figma.com")) return url.pathname.toLowerCase().startsWith("/proto/") ? "Prototype" : "Figma";
    if (host.endsWith(".figma.site") || host.endsWith(".framer.website") || host.endsWith(".webflow.io") || host.endsWith(".vercel.app") || host.endsWith(".netlify.app") || host.endsWith(".github.io")) return "Prototype";
  } catch {}
  return "Site";
}

function getFaviconUrl(value: string) {
  const host = getHost(value);
  return host ? `https://www.google.com/s2/favicons?domain=${encodeURIComponent(host)}&sz=64` : "";
}

function readAdminToken() {
  if (typeof window === "undefined") return "";
  const fragment = new URLSearchParams(window.location.hash.replace(/^#/, ""));
  const fromUrl = fragment.get("admin") ?? "";
  if (fromUrl) {
    sessionStorage.setItem("product-badge-admin", fromUrl);
    history.replaceState(null, "", `${location.pathname}${location.search}`);
  }
  return fromUrl || sessionStorage.getItem("product-badge-admin") || "";
}

async function copyText(value: string, label: string) {
  try { await navigator.clipboard.writeText(value); toast.success(`${label} copied`); }
  catch { toast.error(`Could not copy ${label.toLowerCase()}`); }
}

function Field({ label, value, onChange, placeholder, type = "text", required, multiline }: { label: string; value: string; onChange: (value: string) => void; placeholder: string; type?: string; required?: boolean; multiline?: boolean }) {
  const styles = "w-full rounded-xl border border-white/10 bg-black/25 px-3.5 py-3 text-[0.95rem] text-white outline-none transition placeholder:text-zinc-600 focus:border-orange-500/70 focus:ring-4 focus:ring-orange-500/10";
  return (
    <label className="grid gap-2 text-sm font-medium text-zinc-300">
      {label}
      {multiline ? (
        <textarea className={`${styles} min-h-24 resize-y`} value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} required={required} />
      ) : (
        <input className={styles} value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} type={type} required={required} />
      )}
    </label>
  );
}

function TagField({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  const [entry, setEntry] = useState("");
  const tags = tagsFromIndustry(value);
  function add(raw: string) {
    const next = raw.split(",").map((tag) => tag.trim()).filter(Boolean);
    if (!next.length) return;
    onChange([...new Set([...tags, ...next])].slice(0, 8).join(", "));
    setEntry("");
  }
  function keyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter" || event.key === ",") { event.preventDefault(); add(entry); }
    if (event.key === "Backspace" && !entry && tags.length) onChange(tags.slice(0, -1).join(", "));
  }
  return (
    <label className="grid gap-2 text-sm font-medium text-zinc-300">Industry tags
      <div className="flex min-h-12 flex-wrap items-center gap-2 rounded-xl border border-white/10 bg-black/25 px-3 py-2 focus-within:border-orange-500/70 focus-within:ring-4 focus-within:ring-orange-500/10">
        {tags.map((tag) => <span key={tag} className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.06] px-2.5 py-1 text-xs font-semibold text-zinc-200">{tag}<button type="button" aria-label={`Remove ${tag}`} onClick={() => onChange(tags.filter((item) => item !== tag).join(", "))} className="text-zinc-500 hover:text-white"><X className="size-3" /></button></span>)}
        <input value={entry} onChange={(event) => setEntry(event.target.value)} onKeyDown={keyDown} onBlur={() => add(entry)} placeholder={tags.length ? "Add another…" : "AI, B2B, Branding…"} className="min-w-32 flex-1 border-0 bg-transparent p-1 text-sm text-white outline-none placeholder:text-zinc-600" />
      </div>
      <span className="text-xs font-normal text-zinc-600">Press Enter or comma after each tag. Up to 8 tags.</span>
    </label>
  );
}

function ColorField({ value, onChange }: { value: ProductColor; onChange: (value: ProductColor) => void }) {
  return <fieldset className="grid gap-2"><legend className="mb-2 text-sm font-medium text-zinc-300">Card color</legend><div className="flex flex-wrap gap-2">{Object.entries(COLOR_THEMES).map(([key, theme]) => <button key={key} type="button" aria-label={theme.name} aria-pressed={value === key} onClick={() => onChange(key as ProductColor)} className={`grid size-9 place-items-center rounded-xl border transition ${value === key ? "scale-110 border-white/60 bg-white/10" : "border-white/10 bg-black/20 hover:border-white/30"}`}><span className="size-4 rounded-full" style={{ background: theme.accent }} /></button>)}</div></fieldset>;
}

function LogoUploadField({ value, token, onChange }: { value: string; token: string; onChange: (value: string) => void }) {
  const [uploading, setUploading] = useState(false);
  async function upload(file: File) {
    if (!file.type.startsWith("image/")) { toast.error("Choose an image file"); return; }
    if (file.size > 3 * 1024 * 1024) { toast.error("Logo must be smaller than 3 MB"); return; }
    setUploading(true);
    try {
      const form = new FormData(); form.set("logo", file);
      const response = await fetch("/api/logos", { method: "POST", headers: { "x-admin-token": token }, body: form });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error || "Upload failed");
      onChange(payload.logoUrl); toast.success("Logo uploaded");
    } catch (error) { toast.error(error instanceof Error ? error.message : "Upload failed"); }
    finally { setUploading(false); }
  }
  return (
    <div className="grid gap-2 text-sm font-medium text-zinc-300">
      Logo image <span className="text-xs font-normal text-zinc-600">PNG, JPG, WebP, or GIF · max 3 MB</span>
      <div className="flex min-h-20 items-center gap-3 rounded-xl border border-dashed border-white/10 bg-black/20 p-3">
        <span className="grid size-14 shrink-0 place-items-center overflow-hidden rounded-xl border border-white/10 bg-white/[0.04] text-zinc-600">{value ? <img src={value} alt="Logo preview" className="size-full object-cover" /> : <ImagePlus className="size-5" />}</span>
        <div className="flex flex-wrap gap-2"><label className="inline-flex h-9 cursor-pointer items-center gap-2 rounded-xl bg-white/[0.07] px-3 text-sm font-semibold text-zinc-200 transition hover:bg-white/10 hover:text-white">{uploading ? <LoaderCircle className="size-4 animate-spin" /> : <ImagePlus className="size-4" />}{uploading ? "Uploading…" : value ? "Replace image" : "Choose image"}<input type="file" accept="image/png,image/jpeg,image/webp,image/gif" disabled={uploading} className="sr-only" onChange={(event) => { const file = event.target.files?.[0]; if (file) void upload(file); event.currentTarget.value = ""; }} /></label>{value && <Button type="button" variant="ghost" size="sm" onClick={() => onChange("")} className="rounded-xl text-zinc-500 hover:bg-red-500/10 hover:text-red-300"><X /> Remove</Button>}</div>
      </div>
    </div>
  );
}

function AvatarUploadField({ value, token, onChange }: { value: string; token: string; onChange: (value: string) => void }) {
  const [uploading, setUploading] = useState(false);
  async function upload(file: File) {
    if (!file.type.startsWith("image/")) { toast.error("Choose an image file"); return; }
    if (file.size > 3 * 1024 * 1024) { toast.error("Avatar must be smaller than 3 MB"); return; }
    setUploading(true);
    try {
      const form = new FormData(); form.set("logo", file);
      const response = await fetch("/api/logos", { method: "POST", headers: { "x-admin-token": token }, body: form });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error || "Upload failed");
      onChange(payload.logoUrl); toast.success("Avatar uploaded");
    } catch (error) { toast.error(error instanceof Error ? error.message : "Upload failed"); }
    finally { setUploading(false); }
  }
  return (
    <div className="grid gap-2 text-sm font-medium text-zinc-300">
      Profile photo <span className="text-xs font-normal text-zinc-600">Square image recommended · max 3 MB</span>
      <div className="flex min-h-20 items-center gap-3 rounded-xl border border-dashed border-white/10 bg-black/20 p-3">
        <span className="grid size-14 shrink-0 place-items-center overflow-hidden rounded-full border border-white/10 bg-white/[0.04] text-zinc-600">{value ? <img src={value} alt="Avatar preview" className="size-full object-cover" /> : <UserRound className="size-5" />}</span>
        <div className="flex flex-wrap gap-2"><label className="inline-flex h-9 cursor-pointer items-center gap-2 rounded-xl bg-white/[0.07] px-3 text-sm font-semibold text-zinc-200 transition hover:bg-white/10 hover:text-white">{uploading ? <LoaderCircle className="size-4 animate-spin" /> : <ImagePlus className="size-4" />}{uploading ? "Uploading…" : value ? "Replace photo" : "Choose photo"}<input type="file" accept="image/png,image/jpeg,image/webp,image/gif" disabled={uploading} className="sr-only" onChange={(event) => { const file = event.target.files?.[0]; if (file) void upload(file); event.currentTarget.value = ""; }} /></label>{value && <Button type="button" variant="ghost" size="sm" onClick={() => onChange("")} className="rounded-xl text-zinc-500 hover:bg-red-500/10 hover:text-red-300"><X /> Remove</Button>}</div>
      </div>
    </div>
  );
}

function OwnerProfile({ profile, isAdmin, token, onSaved }: { profile: BoardProfile; isAdmin: boolean; token: string; onSaved: (profile: BoardProfile) => void }) {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState(profile);
  const [saving, setSaving] = useState(false);

  async function save(event: FormEvent) {
    event.preventDefault();
    setSaving(true);
    try {
      const linkedinUrl = normaliseLink(draft.linkedinUrl);
      const response = await fetch("/api/profile", { method: "PUT", headers: { "Content-Type": "application/json", "x-admin-token": token }, body: JSON.stringify({ ...draft, linkedinUrl }) });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error || "Could not save profile");
      onSaved(payload.profile); setOpen(false); toast.success("Owner profile updated");
    } catch (error) { toast.error(error instanceof Error ? error.message : "Could not save profile"); }
    finally { setSaving(false); }
  }

  const profileLink = profile.linkedinUrl ? (
    <a href={profile.linkedinUrl} target="_blank" rel="noreferrer" className="group flex h-12 items-center gap-2.5 rounded-2xl border border-white/[0.08] bg-white/[0.035] py-1.5 pl-1.5 pr-3 transition hover:border-orange-500/30 hover:bg-orange-500/[0.06]">
      <span className="grid size-9 shrink-0 place-items-center overflow-hidden rounded-full border border-white/10 bg-zinc-800 text-zinc-500">{profile.avatarUrl ? <img src={profile.avatarUrl} alt="Owner avatar" className="size-full object-cover" /> : <UserRound className="size-4" />}</span>
      <span className="whitespace-nowrap text-sm font-semibold text-zinc-300 transition group-hover:text-white">Vitaliy Diduh</span>
      <span className="text-sm font-black tracking-[-0.08em] text-[#0a66c2]">in</span>
    </a>
  ) : (
    <span className="flex h-12 items-center gap-2.5 rounded-2xl border border-dashed border-white/10 bg-white/[0.02] py-1.5 pl-1.5 pr-3 text-sm font-semibold text-zinc-500"><span className="grid size-9 place-items-center rounded-full bg-white/[0.04]"><UserRound className="size-4" /></span>Add LinkedIn</span>
  );

  if (!isAdmin) return profile.linkedinUrl ? profileLink : null;
  return (
    <Dialog open={open} onOpenChange={(nextOpen) => { if (nextOpen) setDraft(profile); setOpen(nextOpen); }}>
      <div className="flex items-center gap-1">
        {profileLink}
        <DialogTrigger asChild><Button variant="ghost" size="icon-sm" aria-label="Edit owner profile" title="Edit owner profile" className="rounded-xl text-zinc-500 hover:bg-white/5 hover:text-white"><Pencil /></Button></DialogTrigger>
      </div>
      <DialogContent className="border-white/10 bg-[#202020] text-white sm:max-w-lg">
        <DialogHeader><DialogTitle>Edit owner profile</DialogTitle><DialogDescription className="text-zinc-400">Shown beside Recent Projects for everyone who visits the board.</DialogDescription></DialogHeader>
        <form onSubmit={save} className="grid gap-4">
          <Field label="LinkedIn URL" value={draft.linkedinUrl} onChange={(linkedinUrl) => setDraft({ ...draft, linkedinUrl })} placeholder="https://www.linkedin.com/in/your-name" type="url" />
          <AvatarUploadField value={draft.avatarUrl} token={token} onChange={(avatarUrl) => setDraft({ ...draft, avatarUrl })} />
          <DialogFooter><Button type="button" variant="ghost" onClick={() => setOpen(false)} className="rounded-xl text-zinc-400 hover:bg-white/5 hover:text-white">Cancel</Button><Button type="submit" disabled={saving} className="rounded-xl bg-orange-500 text-zinc-950 hover:bg-orange-400">{saving ? <LoaderCircle className="animate-spin" /> : <Save />}Save profile</Button></DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function PortfolioBadge() {
  return (
    <a href={PORTFOLIO_URL} target="_blank" rel="noreferrer" className="group flex h-12 items-center gap-2.5 rounded-2xl border border-white/[0.08] bg-white/[0.035] py-1.5 pl-1.5 pr-3 transition hover:border-orange-500/30 hover:bg-orange-500/[0.06]">
      <span className="grid size-9 shrink-0 place-items-center overflow-hidden rounded-full border border-white/10 bg-zinc-800"><img src={PORTFOLIO_FAVICON_URL} alt="" className="size-full object-cover" /></span>
      <span className="whitespace-nowrap text-sm font-semibold text-zinc-300 transition group-hover:text-white">My portfolio</span>
    </a>
  );
}

function ProductForm({ initial, saving, token, onSave, onCancel, submitLabel }: { initial: ProductDraft; saving: boolean; token: string; onSave: (draft: ProductDraft) => Promise<void>; onCancel: () => void; submitLabel: string }) {
  const [draft, setDraft] = useState(initial);
  async function submit(event: FormEvent) { event.preventDefault(); await onSave({ ...draft, link: normaliseLink(draft.link) }); }
  return (
    <form onSubmit={submit} className="grid gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <TagField value={draft.industry} onChange={(industry) => setDraft({ ...draft, industry })} />
        <Field label="Product name" value={draft.name} onChange={(name) => setDraft({ ...draft, name })} placeholder="Northstar" required />
      </div>
      <Field label="Product idea" value={draft.idea} onChange={(idea) => setDraft({ ...draft, idea })} placeholder="A short description of what this product does" required multiline />
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Link" value={draft.link} onChange={(link) => setDraft({ ...draft, link })} placeholder="https://example.com" type="url" required />
        <Field label="Password" value={draft.password} onChange={(password) => setDraft({ ...draft, password })} placeholder="Access password" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <ColorField value={draft.color} onChange={(color) => setDraft({ ...draft, color })} />
        <LogoUploadField value={draft.logoUrl} token={token} onChange={(logoUrl) => setDraft({ ...draft, logoUrl })} />
      </div>
      <label className="flex items-center justify-between gap-4 rounded-xl border border-orange-500/15 bg-orange-500/[0.055] p-3.5">
        <span><span className="flex items-center gap-2 text-sm font-semibold text-zinc-200"><Sparkles className="size-4 text-orange-400" />Featured project</span><span className="mt-1 block text-xs text-zinc-500">Keep this card above regular projects.</span></span>
        <Switch checked={Boolean(draft.featured)} onCheckedChange={(featured) => setDraft({ ...draft, featured })} aria-label="Featured project" className="data-[state=checked]:bg-orange-500" />
      </label>
      <div className="flex flex-wrap gap-2 pt-1">
        <Button type="submit" disabled={saving} className="h-10 rounded-xl bg-orange-500 px-4 text-zinc-950 hover:bg-orange-400">{saving ? <LoaderCircle className="animate-spin" /> : <Save />}{submitLabel}</Button>
        <Button type="button" variant="ghost" onClick={onCancel} className="h-10 rounded-xl text-zinc-400 hover:bg-white/5 hover:text-white"><X /> Cancel</Button>
      </div>
    </form>
  );
}

function ProductCard({ product, viewMode, isAdmin, token, onChanged, draggingId, overId, onDragStart, onDragOver, onDrop, onDragEnd, onPointerMove, onPointerDrop }: { product: Product; viewMode: ViewMode; isAdmin: boolean; token: string; onChanged: () => Promise<void>; draggingId: number | null; overId: number | null; onDragStart: (id: number) => void; onDragOver: (id: number) => void; onDrop: (id: number) => void; onDragEnd: () => void; onPointerMove: (x: number, y: number) => void; onPointerDrop: () => void }) {
  const [visible, setVisible] = useState(false);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [copied, setCopied] = useState<"link" | "password" | null>(null);
  const [faviconFailed, setFaviconFailed] = useState(false);
  const [rowSpan, setRowSpan] = useState(1);
  const cardRef = useRef<HTMLElement>(null);
  const theme = COLOR_THEMES[product.color] ?? COLOR_THEMES.orange;
  const tags = tagsFromIndustry(product.industry);
  const linkKind = getLinkKind(product.link);
  const fullLink = normaliseLink(product.link);
  const displayLink = getDisplayLink(product.link);
  const faviconUrl = getFaviconUrl(product.link);
  const cardStyle = { "--card-accent": theme.accent, "--card-soft": theme.soft, "--card-border": theme.border, ...(viewMode === "cards" ? { gridRowEnd: `span ${rowSpan}` } : {}) } as CSSProperties;

  useEffect(() => setFaviconFailed(false), [product.link]);

  useLayoutEffect(() => {
    const card = cardRef.current;
    if (!card) return;
    const update = () => setRowSpan(viewMode === "cards" ? Math.max(1, Math.ceil((card.getBoundingClientRect().height + 14) / 4)) : 1);
    update();
    const observer = new ResizeObserver(update); observer.observe(card);
    return () => observer.disconnect();
  }, [editing, visible, product, viewMode]);

  async function copyField(value: string, kind: "link" | "password") {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(kind);
      toast.success(kind === "link" ? "Link copied" : "Password copied");
      window.setTimeout(() => setCopied((current) => current === kind ? null : current), 1400);
    } catch { toast.error(`Could not copy ${kind}`); }
  }

  function openProduct(event: MouseEvent<HTMLAnchorElement>) {
    if (!product.password) return;
    event.preventDefault();
    const nextWindow = window.open("", "_blank");
    if (nextWindow) nextWindow.opener = null;
    void navigator.clipboard.writeText(product.password).then(() => {
      setCopied("password");
      toast.success("Password copied — paste it on the sign-in page");
      window.setTimeout(() => setCopied((current) => current === "password" ? null : current), 1400);
    }).catch(() => toast.error("Could not copy password")).finally(() => {
      if (nextWindow) nextWindow.location.replace(fullLink);
      else window.open(fullLink, "_blank", "noopener,noreferrer");
    });
  }

  async function update(draft: ProductDraft) {
    setSaving(true);
    try {
      const response = await fetch(`/api/products/${product.id}`, { method: "PATCH", headers: { "Content-Type": "application/json", "x-admin-token": token }, body: JSON.stringify(draft) });
      if (!response.ok) throw new Error((await response.json()).error || "Update failed");
      await onChanged(); setEditing(false); toast.success("Product updated");
    } catch (error) { toast.error(error instanceof Error ? error.message : "Update failed"); }
    finally { setSaving(false); }
  }

  async function remove() {
    setSaving(true);
    try {
      const response = await fetch(`/api/products/${product.id}`, { method: "DELETE", headers: { "x-admin-token": token } });
      if (!response.ok) throw new Error((await response.json()).error || "Delete failed");
      await onChanged(); toast.success("Product deleted");
    } catch (error) { toast.error(error instanceof Error ? error.message : "Delete failed"); }
    finally { setSaving(false); }
  }

  const tagBadges = <div className={`mt-2 flex gap-1 ${viewMode === "compact" ? "flex-nowrap overflow-hidden" : "flex-wrap"}`}>{tags.map((tag) => <span key={tag} className="shrink-0 rounded-md border border-[var(--card-border)] bg-[var(--card-soft)] px-1.5 py-px text-[0.6rem] font-semibold uppercase tracking-[0.07em] text-[var(--card-accent)]">{tag}</span>)}</div>;
  const adminTools = isAdmin && <div className="flex shrink-0 items-center gap-1">
    <Button variant="ghost" size="icon-sm" draggable onDragStart={(event) => { event.dataTransfer.effectAllowed = "move"; event.dataTransfer.setData("text/plain", String(product.id)); onDragStart(product.id); }} onDragEnd={onDragEnd} onPointerDown={(event) => { if (event.pointerType === "mouse") return; event.preventDefault(); event.currentTarget.setPointerCapture(event.pointerId); onDragStart(product.id); }} onPointerMove={(event) => { if (event.pointerType !== "mouse" && draggingId === product.id) onPointerMove(event.clientX, event.clientY); }} onPointerUp={(event) => { if (event.pointerType === "mouse") return; if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId); onPointerDrop(); }} aria-label={`Move ${product.name}`} title="Drag to reorder" className="touch-none cursor-grab rounded-lg text-zinc-500 hover:bg-orange-500/10 hover:text-orange-300 active:cursor-grabbing"><GripVertical /></Button>
    <Button variant="ghost" size="icon-sm" onClick={() => setEditing(true)} aria-label={`Edit ${product.name}`} className="rounded-lg text-zinc-500 hover:bg-white/5 hover:text-white"><Pencil /></Button>
    <AlertDialog><AlertDialogTrigger asChild><Button variant="ghost" size="icon-sm" aria-label={`Delete ${product.name}`} className="rounded-lg text-zinc-500 hover:bg-red-500/10 hover:text-red-300"><Trash2 /></Button></AlertDialogTrigger><AlertDialogContent className="border-white/10 bg-[#202020] text-white"><AlertDialogHeader><AlertDialogTitle>Delete {product.name}?</AlertDialogTitle><AlertDialogDescription className="text-zinc-400">This removes the card for every viewer and cannot be undone.</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel className="border-white/10 bg-transparent text-zinc-300 hover:bg-white/5 hover:text-white">Cancel</AlertDialogCancel><AlertDialogAction onClick={remove} className="bg-red-500 text-white hover:bg-red-400">Delete product</AlertDialogAction></AlertDialogFooter></AlertDialogContent></AlertDialog>
  </div>;
  const linkKindClass = linkKind === "Figma" ? "border-violet-400/25 bg-violet-400/10 text-violet-300" : linkKind === "Prototype" ? "border-cyan-400/25 bg-cyan-400/10 text-cyan-300" : "border-emerald-400/25 bg-emerald-400/10 text-emerald-300";
  const favicon = <span className="grid size-8 shrink-0 place-items-center overflow-hidden rounded-lg border border-white/[0.07] bg-white/5 text-zinc-400">{faviconUrl && !faviconFailed ? <img src={faviconUrl} alt="" className="size-4 rounded-sm" onError={() => setFaviconFailed(true)} /> : <Link2 className="size-4" />}</span>;
  const linkText = <TooltipProvider delayDuration={180}><Tooltip><TooltipTrigger asChild><button type="button" onClick={() => void copyField(product.link, "link")} className="min-w-0 flex-1 cursor-copy truncate text-left text-xs font-medium text-zinc-300 transition hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500/60 sm:text-sm">{displayLink}</button></TooltipTrigger><TooltipContent side="top" sideOffset={8} className="max-w-sm break-all bg-zinc-100 text-zinc-900">{fullLink}<span className="mt-1 block text-[0.68rem] text-zinc-500">Click to copy</span></TooltipContent></Tooltip></TooltipProvider>;
  const kindBadge = <span className={`shrink-0 rounded-md border px-1.5 py-0.5 text-[0.6rem] font-semibold uppercase tracking-[0.07em] ${linkKindClass}`}>{linkKind}</span>;
  const openButton = <TooltipProvider delayDuration={180}><Tooltip><TooltipTrigger asChild><Button asChild size="sm" className="h-9 shrink-0 rounded-xl bg-orange-500 px-3 text-zinc-950 hover:bg-orange-400"><a href={fullLink} target="_blank" rel="noreferrer" onClick={openProduct}><ExternalLink /> Open</a></Button></TooltipTrigger><TooltipContent side="top" sideOffset={8} className="max-w-sm break-all bg-zinc-100 text-zinc-900">{product.password ? "Copies the password, then opens " : "Open "}{fullLink}</TooltipContent></Tooltip></TooltipProvider>;
  const passwordControls = product.password && <div className="flex w-full min-w-0 items-center gap-1.5 rounded-xl border border-white/[0.07] bg-black/20 px-2 py-1.5">
    <KeyRound className="size-3.5 shrink-0 text-zinc-500" />
    <span className="min-w-16 truncate font-mono text-xs tracking-wider text-zinc-300">{visible ? product.password : "••••••••"}</span>
    <Button variant="ghost" size="icon-sm" onClick={() => setVisible(!visible)} aria-label={visible ? "Hide password" : "Show password"} className="size-7 rounded-lg text-zinc-500 hover:bg-white/5 hover:text-white">{visible ? <EyeOff /> : <Eye />}</Button>
    <Button variant="ghost" size="sm" onClick={() => void copyField(product.password, "password")} className="h-7 rounded-lg px-2 text-xs text-zinc-300 hover:bg-[var(--card-soft)] hover:text-[var(--card-accent)]">{copied === "password" ? <><Check /> Copied ✓</> : <><Clipboard /> Copy</>}</Button>
  </div>;

  return (
    <article
      ref={cardRef}
      data-product-id={product.id}
      style={cardStyle}
      onDragOver={(event) => { if (!isAdmin) return; event.preventDefault(); onDragOver(product.id); }}
      onDrop={(event) => { if (!isAdmin) return; event.preventDefault(); onDrop(product.id); }}
      className={`group relative w-full overflow-hidden border bg-[#202020] shadow-[0_18px_55px_rgba(0,0,0,.22)] transition duration-200 ${viewMode === "cards" ? "rounded-[1.4rem]" : "rounded-2xl"} ${draggingId === product.id ? "scale-[0.98] border-orange-500/30 opacity-45" : overId === product.id ? "border-orange-400 ring-2 ring-orange-500/35" : "border-white/[0.09] hover:-translate-y-0.5 hover:border-orange-500/25"}`}
    >
      <div className="absolute inset-y-0 left-0 w-1 bg-[var(--card-accent)] opacity-90" />
      <div className={viewMode === "cards" || editing ? "p-4 sm:p-[1.125rem]" : "p-3 sm:p-3.5"}>
        {editing ? (
          <ProductForm initial={{ industry: product.industry, name: product.name, idea: product.idea, link: product.link, password: product.password, color: product.color ?? "orange", logoUrl: product.logoUrl ?? "", featured: Boolean(product.featured) }} saving={saving} token={token} onSave={update} onCancel={() => setEditing(false)} submitLabel="Save changes" />
        ) : (
          viewMode === "compact" ? (
            <div className="grid grid-cols-1 items-start gap-3 md:grid-cols-[minmax(0,1fr)_minmax(17rem,22rem)] md:items-center">
              <div className="flex min-w-0 items-start gap-3">
                <span className="grid size-10 shrink-0 place-items-center overflow-hidden rounded-xl border border-[var(--card-border)] bg-[var(--card-soft)] text-[var(--card-accent)]">{product.logoUrl ? <img src={product.logoUrl} alt="" className="size-full object-cover" /> : <Layers3 className="size-4" />}</span>
                <div className="min-w-0 flex-1 overflow-hidden">
                  <div className="flex min-w-0 items-center gap-2">
                    <h2 className="min-w-0 flex-1 truncate text-base font-semibold text-zinc-50">{product.name}</h2>
                    {Boolean(product.featured) && <span className="inline-flex shrink-0 items-center gap-1 rounded-md border border-orange-500/30 bg-orange-500/15 px-1.5 py-px text-[0.6rem] font-semibold uppercase tracking-[0.07em] text-orange-300"><Sparkles className="size-2.5" />Featured</span>}
                  </div>
                  <p className="mt-0.5 line-clamp-2 text-sm leading-5 text-zinc-400 md:line-clamp-1">{product.idea}</p>
                  {tagBadges}
                </div>
              </div>
              <div className="flex min-w-0 w-full flex-col gap-2">
                {passwordControls}
                <div className="flex min-w-0 w-full items-center gap-2">
                  <div className="flex min-w-0 flex-1 items-center gap-1.5 overflow-hidden rounded-xl border border-white/[0.07] bg-black/20 px-2 py-1.5">{favicon}{linkText}{kindBadge}<Button variant="ghost" size="sm" onClick={() => void copyField(product.link, "link")} className="hidden h-7 shrink-0 rounded-lg px-2 text-xs text-zinc-300 hover:bg-[var(--card-soft)] hover:text-[var(--card-accent)] sm:inline-flex">{copied === "link" ? <><Check /> Copied ✓</> : <><Clipboard /> Copy</>}</Button></div>
                  {openButton}
                </div>
                {adminTools}
              </div>
            </div>
          ) : <>
            <div className="mb-3.5 flex items-start justify-between gap-3">
              <div className="flex min-w-0 items-center gap-3">
                <span className="grid size-9 shrink-0 place-items-center overflow-hidden rounded-xl border border-[var(--card-border)] bg-[var(--card-soft)] text-[var(--card-accent)]">{product.logoUrl ? <img src={product.logoUrl} alt="" className="size-full object-cover" /> : <Layers3 className="size-4" />}</span>
                <div className="min-w-0"><div className="mb-1 flex flex-wrap gap-1.5">{Boolean(product.featured) && <span className="inline-flex items-center gap-1 rounded-md border border-orange-500/30 bg-orange-500/15 px-1.5 py-px text-[0.6rem] font-semibold uppercase tracking-[0.07em] text-orange-300"><Sparkles className="size-2.5" />Featured</span>}</div><h2 className="min-w-0 truncate text-lg font-semibold tracking-[-0.025em] text-zinc-50">{product.name}</h2></div>
              </div>
              {adminTools}
            </div>
            <div className="mb-2.5"><p className="mb-1 text-xs font-semibold uppercase tracking-[0.12em] text-zinc-500">Product idea</p><p className="text-sm leading-5 text-zinc-300 [overflow-wrap:anywhere] md:[overflow-wrap:normal]">{product.idea}</p>{tagBadges}</div>
            <div className="grid gap-2.5">
              {product.password && <div className="flex min-w-0 items-center gap-2.5 rounded-xl border border-white/[0.07] bg-black/20 p-2.5">
                <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-white/5 text-zinc-400"><KeyRound className="size-4" /></span>
                <div className="min-w-0 flex-1"><p className="text-[0.68rem] font-semibold uppercase tracking-[0.12em] text-zinc-600">Password</p><p className="truncate font-mono text-sm font-medium tracking-wider text-zinc-300">{visible ? product.password : "••••••••"}</p></div>
                <Button variant="ghost" size="icon-sm" onClick={() => setVisible(!visible)} aria-label={visible ? "Hide password" : "Show password"} className="rounded-lg text-zinc-400 hover:bg-white/5 hover:text-white">{visible ? <EyeOff /> : <Eye />}</Button><Button variant="ghost" size="sm" onClick={() => void copyField(product.password, "password")} className="rounded-xl text-zinc-300 hover:bg-[var(--card-soft)] hover:text-[var(--card-accent)]">{copied === "password" ? <><Check /> Copied ✓</> : <><Clipboard /> Copy</>}</Button>
              </div>}
              <div className="flex min-w-0 items-center gap-2.5 rounded-xl border border-white/[0.07] bg-black/20 p-2.5">
                {favicon}
                {linkText}
                {kindBadge}
                <Button variant="ghost" size="sm" onClick={() => void copyField(product.link, "link")} className="hidden shrink-0 rounded-xl text-zinc-300 hover:bg-[var(--card-soft)] hover:text-[var(--card-accent)] sm:inline-flex">{copied === "link" ? <><Check /> Copied ✓</> : <><Clipboard /> Copy</>}</Button>
                {openButton}
              </div>
            </div>
          </>
        )}
      </div>
    </article>
  );
}

export default function ProductBoard() {
  const [products, setProducts] = useState<Product[]>([]);
  const [profile, setProfile] = useState<BoardProfile>(EMPTY_PROFILE);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [token, setToken] = useState("");
  const [adding, setAdding] = useState(false);
  const [saving, setSaving] = useState(false);
  const [activeCategory, setActiveCategory] = useState("All");
  const [viewMode, setViewMode] = useState<ViewMode>("cards");
  const [preferencesReady, setPreferencesReady] = useState(false);
  const [draggingId, setDraggingId] = useState<number | null>(null);
  const [overId, setOverId] = useState<number | null>(null);
  const scrollRestored = useRef(false);
  const isAdmin = Boolean(token);
  useEffect(() => setToken(readAdminToken()), []);
  const loadProducts = useCallback(async () => {
    try { const response = await fetch("/api/products", { cache: "no-store" }); const payload = await response.json(); if (!response.ok) throw new Error(payload.error || "Could not load products"); setProducts(payload.products); setError(""); }
    catch (loadError) { setError(loadError instanceof Error ? loadError.message : "Could not load products"); }
    finally { setLoading(false); }
  }, []);
  const loadProfile = useCallback(async () => {
    try { const response = await fetch("/api/profile", { cache: "no-store" }); const payload = await response.json(); if (response.ok) setProfile(payload.profile ?? EMPTY_PROFILE); }
    catch { /* The board remains usable if profile data is temporarily unavailable. */ }
  }, []);
  useEffect(() => { void loadProducts(); }, [loadProducts]);
  useEffect(() => { void loadProfile(); }, [loadProfile]);
  useEffect(() => {
    const savedMode = sessionStorage.getItem("product-badge-view-mode");
    const savedCategory = sessionStorage.getItem("product-badge-category");
    if (savedMode === "compact" || savedMode === "cards") setViewMode(savedMode);
    if (savedCategory) setActiveCategory(savedCategory);
    setPreferencesReady(true);
  }, []);
  useEffect(() => { if (preferencesReady) sessionStorage.setItem("product-badge-view-mode", viewMode); }, [preferencesReady, viewMode]);
  useEffect(() => { if (preferencesReady) sessionStorage.setItem("product-badge-category", activeCategory); }, [activeCategory, preferencesReady]);
  useEffect(() => {
    if (!preferencesReady) return;
    let frame = 0;
    const saveScroll = () => { if (!scrollRestored.current) return; cancelAnimationFrame(frame); frame = requestAnimationFrame(() => sessionStorage.setItem("product-badge-scroll", String(window.scrollY))); };
    window.addEventListener("scroll", saveScroll, { passive: true });
    return () => { window.removeEventListener("scroll", saveScroll); cancelAnimationFrame(frame); };
  }, [preferencesReady]);
  useEffect(() => {
    if (!preferencesReady || loading || scrollRestored.current) return;
    const saved = Number(sessionStorage.getItem("product-badge-scroll") ?? 0);
    requestAnimationFrame(() => requestAnimationFrame(() => { window.scrollTo({ top: Number.isFinite(saved) ? saved : 0 }); scrollRestored.current = true; }));
  }, [activeCategory, loading, preferencesReady, viewMode]);
  useEffect(() => {
    if (!token) return;
    void fetch("/api/admin/check", { headers: { "x-admin-token": token } }).then((response) => { if (response.ok) return; sessionStorage.removeItem("product-badge-admin"); setToken(""); toast.error("Admin link is invalid"); });
  }, [token]);

  useEffect(() => {
    type Tool = { name: string; title: string; description: string; inputSchema: object; annotations: { readOnlyHint: boolean; untrustedContentHint: boolean }; execute: (input: Record<string, unknown>) => Promise<unknown> };
    type ModelContext = { registerTool: (tool: Tool, options?: { signal?: AbortSignal }) => void | Promise<void> };
    const context = (document as Document & { modelContext?: ModelContext }).modelContext;
    if (!context?.registerTool) return;
    const lifecycle = new AbortController();
    const register = (tool: Tool) => { try { void Promise.resolve(context.registerTool(tool, { signal: lifecycle.signal })).catch(() => undefined); } catch {} };

    register({
      name: "list_product_badges", title: "List product badges", description: "List the visible product access cards with their industries, ideas, links, and passwords.",
      inputSchema: { type: "object", properties: {}, additionalProperties: false }, annotations: { readOnlyHint: true, untrustedContentHint: true },
      async execute() { const response = await fetch("/api/products", { cache: "no-store" }); if (!response.ok) throw new Error("Could not load products"); return response.json(); },
    });
    register({
      name: "get_owner_profile", title: "Get owner profile", description: "Read the public owner avatar and LinkedIn link shown beside Recent Projects.",
      inputSchema: { type: "object", properties: {}, additionalProperties: false }, annotations: { readOnlyHint: true, untrustedContentHint: true },
      async execute() { const response = await fetch("/api/profile", { cache: "no-store" }); if (!response.ok) throw new Error("Could not load owner profile"); return response.json(); },
    });

    if (token) {
      const productFields = { industry: { type: "string", description: "Comma-separated industry tags, for example AI, B2B, Branding" }, name: { type: "string" }, idea: { type: "string" }, link: { type: "string" }, password: { type: "string" }, color: { type: "string", enum: Object.keys(COLOR_THEMES) }, logoUrl: { type: "string", description: "Optional public image URL for the product logo" }, featured: { type: "boolean", description: "Keep this project above regular projects" } };
      register({
        name: "add_product_badge", title: "Add product badge", description: "Add a product card to the shared board. Owner access is required.",
        inputSchema: { type: "object", properties: productFields, required: ["industry", "name", "idea", "link"], additionalProperties: false }, annotations: { readOnlyHint: false, untrustedContentHint: false },
        async execute(input) { const draft = { industry: String(input.industry ?? ""), name: String(input.name ?? ""), idea: String(input.idea ?? ""), link: normaliseLink(String(input.link ?? "")), password: String(input.password ?? ""), color: String(input.color ?? "orange"), logoUrl: String(input.logoUrl ?? ""), featured: Boolean(input.featured) }; const response = await fetch("/api/products", { method: "POST", headers: { "Content-Type": "application/json", "x-admin-token": token }, body: JSON.stringify(draft) }); if (!response.ok) throw new Error((await response.json()).error || "Create failed"); await loadProducts(); return { created: true, name: draft.name }; },
      });
      register({
        name: "update_product_badge", title: "Update product badge", description: "Update one shared product card by its numeric ID. Owner access is required.",
        inputSchema: { type: "object", properties: { id: { type: "integer" }, ...productFields }, required: ["id", "industry", "name", "idea", "link"], additionalProperties: false }, annotations: { readOnlyHint: false, untrustedContentHint: false },
        async execute(input) { const id = Number(input.id); const draft = { industry: String(input.industry ?? ""), name: String(input.name ?? ""), idea: String(input.idea ?? ""), link: normaliseLink(String(input.link ?? "")), password: String(input.password ?? ""), color: String(input.color ?? "orange"), logoUrl: String(input.logoUrl ?? ""), featured: Boolean(input.featured) }; const response = await fetch(`/api/products/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json", "x-admin-token": token }, body: JSON.stringify(draft) }); if (!response.ok) throw new Error((await response.json()).error || "Update failed"); await loadProducts(); return { updated: true, id }; },
      });
      register({
        name: "delete_product_badge", title: "Delete product badge", description: "Permanently delete one product card by its numeric ID. Owner access is required.",
        inputSchema: { type: "object", properties: { id: { type: "integer" } }, required: ["id"], additionalProperties: false }, annotations: { readOnlyHint: false, untrustedContentHint: false },
        async execute(input) { const id = Number(input.id); const response = await fetch(`/api/products/${id}`, { method: "DELETE", headers: { "x-admin-token": token } }); if (!response.ok) throw new Error((await response.json()).error || "Delete failed"); await loadProducts(); return { deleted: true, id }; },
      });
      register({
        name: "reorder_product_badges", title: "Reorder product badges", description: "Save the complete display order of product cards using their numeric IDs. Owner access is required.",
        inputSchema: { type: "object", properties: { productIds: { type: "array", items: { type: "integer" }, minItems: 1 } }, required: ["productIds"], additionalProperties: false }, annotations: { readOnlyHint: false, untrustedContentHint: false },
        async execute(input) { const productIds = Array.isArray(input.productIds) ? input.productIds.map(Number) : []; const response = await fetch("/api/products/reorder", { method: "POST", headers: { "Content-Type": "application/json", "x-admin-token": token }, body: JSON.stringify({ productIds }) }); if (!response.ok) throw new Error((await response.json()).error || "Reorder failed"); await loadProducts(); return { reordered: true, productIds }; },
      });
      register({
        name: "update_owner_profile", title: "Update owner profile", description: "Update the public LinkedIn link and avatar URL shown in the board header. Owner access is required.",
        inputSchema: { type: "object", properties: { linkedinUrl: { type: "string" }, avatarUrl: { type: "string" } }, required: ["linkedinUrl", "avatarUrl"], additionalProperties: false }, annotations: { readOnlyHint: false, untrustedContentHint: false },
        async execute(input) { const response = await fetch("/api/profile", { method: "PUT", headers: { "Content-Type": "application/json", "x-admin-token": token }, body: JSON.stringify({ linkedinUrl: normaliseLink(String(input.linkedinUrl ?? "")), avatarUrl: String(input.avatarUrl ?? "") }) }); if (!response.ok) throw new Error((await response.json()).error || "Could not update owner profile"); await loadProfile(); return response.json(); },
      });
    }
    return () => lifecycle.abort();
  }, [token, loadProducts, loadProfile]);

  async function create(draft: ProductDraft) {
    setSaving(true);
    try { const response = await fetch("/api/products", { method: "POST", headers: { "Content-Type": "application/json", "x-admin-token": token }, body: JSON.stringify(draft) }); if (!response.ok) throw new Error((await response.json()).error || "Create failed"); await loadProducts(); setAdding(false); toast.success("Product added"); }
    catch (createError) { toast.error(createError instanceof Error ? createError.message : "Create failed"); }
    finally { setSaving(false); }
  }

  async function persistOrder(next: Product[]) {
    const ordered = [...next].sort((a, b) => Number(Boolean(b.featured)) - Number(Boolean(a.featured)));
    setProducts(ordered);
    try {
      const response = await fetch("/api/products/reorder", { method: "POST", headers: { "Content-Type": "application/json", "x-admin-token": token }, body: JSON.stringify({ productIds: ordered.map((product) => product.id) }) });
      if (!response.ok) throw new Error((await response.json()).error || "Could not save order");
      toast.success("Order saved");
    } catch (reorderError) {
      toast.error(reorderError instanceof Error ? reorderError.message : "Could not save order");
      await loadProducts();
    }
  }

  function finishDrop(targetId: number | null) {
    const sourceId = draggingId;
    setDraggingId(null); setOverId(null);
    if (!sourceId || !targetId || sourceId === targetId) return;
    const from = products.findIndex((product) => product.id === sourceId);
    const to = products.findIndex((product) => product.id === targetId);
    if (from < 0 || to < 0) return;
    const next = [...products];
    const [moved] = next.splice(from, 1);
    next.splice(to, 0, moved);
    void persistOrder(next);
  }

  function trackPointer(x: number, y: number) {
    const card = document.elementFromPoint(x, y)?.closest<HTMLElement>("[data-product-id]");
    const id = Number(card?.dataset.productId);
    if (Number.isSafeInteger(id) && id > 0) setOverId(id);
  }

  const categories = useMemo(() => {
    const seen = new Set<string>();
    return ["All", ...products.flatMap((product) => tagsFromIndustry(product.industry)).filter((tag) => { const key = tag.toLocaleLowerCase(); if (seen.has(key)) return false; seen.add(key); return true; })];
  }, [products]);
  const selectedCategory = categories.some((category) => category.toLocaleLowerCase() === activeCategory.toLocaleLowerCase()) ? activeCategory : "All";
  const visibleProducts = useMemo(() => selectedCategory === "All" ? products : products.filter((product) => tagsFromIndustry(product.industry).some((tag) => tag.toLocaleLowerCase() === selectedCategory.toLocaleLowerCase())), [products, selectedCategory]);
  const productCount = useMemo(() => `${products.length} ${products.length === 1 ? "product" : "products"}`, [products.length]);
  return (
    <main className="min-h-screen bg-[#111111] text-white selection:bg-orange-500/30">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_15%_0%,rgba(249,115,22,.12),transparent_30%),radial-gradient(circle_at_100%_35%,rgba(255,255,255,.04),transparent_28%)]" />
      <div className="relative mx-auto w-full max-w-[1180px] px-4 py-5 sm:px-7 sm:py-7 lg:px-8">
        <header className="mb-6 sm:mb-7">
          <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-orange-400"><span className="h-px w-7 bg-orange-500" />Product access board</div>
          <div className="relative flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div className="min-w-0 pr-24 lg:pr-0"><h1 className="max-w-2xl text-3xl font-semibold tracking-[-0.045em] text-zinc-50 sm:text-4xl">Recent Projects.</h1><p className="mt-2 flex flex-wrap items-center gap-2 text-sm text-zinc-500"><Globe2 className="size-4" /> {loading ? "Loading products…" : productCount}{isAdmin && <span className="ml-1 inline-flex items-center gap-1.5 rounded-full border border-orange-500/20 bg-orange-500/10 px-2.5 py-1 text-xs font-medium text-orange-300"><LockKeyhole className="size-3" /> Owner mode</span>}</p></div>
          <div className="flex flex-wrap items-center gap-2 self-start">
            <div className="flex flex-wrap items-center gap-2">
              <OwnerProfile profile={profile} isAdmin={isAdmin} token={token} onSaved={setProfile} />
              <PortfolioBadge />
              {!loading && <div className="absolute right-0 top-0 flex h-12 shrink-0 items-center rounded-2xl border border-white/[0.08] bg-white/[0.03] p-1 lg:static" role="group" aria-label="Project view">
                <button type="button" aria-label="Cards view" aria-pressed={viewMode === "cards"} onClick={() => setViewMode("cards")} className={`inline-flex h-10 items-center gap-1.5 rounded-xl px-2.5 text-xs font-semibold transition ${viewMode === "cards" ? "bg-orange-500 text-zinc-950" : "text-zinc-500 hover:bg-white/5 hover:text-zinc-200"}`}><LayoutGrid className="size-3.5" /><span className="hidden sm:inline">Cards</span></button>
                <button type="button" aria-label="Compact view" aria-pressed={viewMode === "compact"} onClick={() => setViewMode("compact")} className={`inline-flex h-10 items-center gap-1.5 rounded-xl px-2.5 text-xs font-semibold transition ${viewMode === "compact" ? "bg-orange-500 text-zinc-950" : "text-zinc-500 hover:bg-white/5 hover:text-zinc-200"}`}><Rows3 className="size-3.5" /><span className="hidden sm:inline">Compact</span></button>
              </div>}
            </div>
            {isAdmin && <Button onClick={() => setAdding(true)} className="h-11 rounded-xl bg-orange-500 px-4 text-zinc-950 shadow-[0_12px_30px_rgba(249,115,22,.18)] hover:bg-orange-400"><Plus /> Add product</Button>}
          </div>
          </div>
        </header>
        {!loading && <div className="mb-5 sm:mb-6">
          <nav aria-label="Project categories" className="flex gap-1.5 overflow-x-auto pb-1">
            {categories.map((category) => {
              const active = selectedCategory.toLocaleLowerCase() === category.toLocaleLowerCase();
              return <button key={category} type="button" aria-pressed={active} onClick={() => setActiveCategory(category)} className={`shrink-0 rounded-full border px-2.5 py-1.5 text-xs font-semibold transition sm:px-3 ${active ? "border-orange-500 bg-orange-500 text-zinc-950" : "border-white/[0.09] bg-white/[0.025] text-zinc-500 hover:border-orange-500/30 hover:bg-orange-500/[0.06] hover:text-zinc-200"}`}>{category}</button>;
            })}
          </nav>
        </div>}
        {error && <div className="mb-6 rounded-2xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-200">{error}</div>}
        {adding && <article className="relative mb-3.5 overflow-hidden rounded-[1.4rem] border border-orange-500/25 bg-[#202020] p-5 shadow-[0_18px_55px_rgba(0,0,0,.22)] sm:p-6"><div className="mb-5 flex items-center gap-3"><span className="grid size-10 place-items-center rounded-xl bg-orange-500/10 text-orange-400"><PackagePlus className="size-5" /></span><div><p className="text-xs font-semibold uppercase tracking-[0.14em] text-orange-400">New card</p><h2 className="text-lg font-semibold">Add a product</h2></div></div><ProductForm initial={EMPTY_DRAFT} saving={saving} token={token} onSave={create} onCancel={() => setAdding(false)} submitLabel="Add product" /></article>}
        <section aria-label="Products" aria-busy={loading} className={viewMode === "cards" ? "grid auto-rows-[4px] grid-cols-1 items-start gap-x-3.5 gap-y-0 md:grid-cols-2" : "grid grid-cols-1 items-start gap-2.5"}>
          {loading && [0, 1, 2, 3].map((item) => <ProjectCardSkeleton key={item} viewMode={viewMode} />)}
          {!loading && visibleProducts.map((product) => <ProductCard key={product.id} product={product} viewMode={viewMode} isAdmin={isAdmin} token={token} onChanged={loadProducts} draggingId={draggingId} overId={overId} onDragStart={(id) => { setDraggingId(id); setOverId(id); }} onDragOver={setOverId} onDrop={finishDrop} onDragEnd={() => { setDraggingId(null); setOverId(null); }} onPointerMove={trackPointer} onPointerDrop={() => finishDrop(overId)} />)}
        </section>
        {!loading && !error && products.length > 0 && visibleProducts.length === 0 && <section className="grid min-h-48 place-items-center rounded-[1.6rem] border border-dashed border-white/10 bg-white/[0.02] px-6 text-center"><div><h2 className="text-lg font-semibold">No {selectedCategory} projects yet</h2><button type="button" onClick={() => setActiveCategory("All")} className="mt-2 text-sm font-semibold text-orange-400 hover:text-orange-300">Show all projects</button></div></section>}
        {!loading && !error && products.length === 0 && !adding && <section className="grid min-h-72 place-items-center rounded-[1.6rem] border border-dashed border-white/10 bg-white/[0.02] px-6 text-center"><div><span className="mx-auto mb-4 grid size-12 place-items-center rounded-2xl bg-orange-500/10 text-orange-400"><Sparkles className="size-5" /></span><h2 className="text-xl font-semibold">No products yet</h2><p className="mt-2 text-sm text-zinc-500">{isAdmin ? "Add the first product card to this board." : "The product board is being prepared."}</p>{isAdmin && <Button onClick={() => setAdding(true)} className="mt-5 rounded-xl bg-orange-500 text-zinc-950 hover:bg-orange-400"><Plus /> Add product</Button>}</div></section>}
        <footer className="mt-8 flex items-center justify-between border-t border-white/[0.06] py-5 text-xs text-zinc-600"><span>Product Badge Board</span><span className="inline-flex items-center gap-1.5"><Check className="size-3.5 text-orange-500" /> Synced across devices</span></footer>
      </div>
    </main>
  );
}
