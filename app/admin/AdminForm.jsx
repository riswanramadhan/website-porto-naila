"use client";
/* global navigator, console */

import { useActionState, useEffect, useMemo, useRef, useState } from "react";
import { useFormStatus } from "react-dom";
import { updatePortfolio } from "./actions";
import { logoutAdmin } from "./login/actions";
import { ChevronDown, ChevronRight, ChevronUp, LogOut, PencilLine, Trash2 } from "lucide-react";
import CropModal from "./CropModal";

const initialState = { status: "idle", message: "" };
const sectionOrder = [
  "heroStats",
  "experiences",
  "projects",
  "communityProjects",
  "editing",
  "news",
  "achievements",
];

const sectionConfig = {
  heroStats: {
    title: "Hero Stats",
    description: "Kelola empat angka pencapaian yang tampil di hero section.",
    addLabel: "Tambah angka hero",
    emptyLabel: "Belum ada angka hero.",
  },
  experiences: {
    title: "Pengalaman",
    description: "Kelola riwayat peran, organisasi, dan poin pencapaian.",
    addLabel: "Tambah pengalaman",
    emptyLabel: "Belum ada pengalaman.",
  },
  projects: {
    title: "Proyek",
    description: "Kelola ringkasan proyek, tautan, dan gambar pendukung.",
    addLabel: "Tambah proyek",
    emptyLabel: "Belum ada proyek.",
  },
  communityProjects: {
    title: "Community Project",
    description: "Kelola section Growmates yang tampil setelah proyek.",
    addLabel: "Tambah community project",
    emptyLabel: "Belum ada community project.",
  },
  editing: {
    title: "Editing",
    description: "Kelola mockup iPhone dan galeri editing yang tampil setelah pengalaman.",
    addLabel: "Tambah editing",
    emptyLabel: "Belum ada item editing.",
  },
  news: {
    title: "Liputan",
    description: "Perbarui kartu liputan media dan gambar pratinjau.",
    addLabel: "Tambah liputan",
    emptyLabel: "Belum ada liputan.",
  },
  achievements: {
    title: "Pencapaian",
    description: "Kelola halaman pencapaian, galeri dokumentasi, dan sertifikat.",
    addLabel: "Tambah pencapaian",
    emptyLabel: "Belum ada pencapaian.",
  },
};

const navIcons = {
  heroStats: "M4 18h16v2H4v-2Zm1-3.5 4.5-4.5 3 3L19 6.5V11h2V3h-8v2h4.5l-5 5-3-3L3.6 12.9 5 14.5Z",
  experiences: "M20 7H4C2.9 7 2 7.9 2 9v10c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V9c0-1.1-.9-2-2-2zm-9 9H5v-2h6v2zm4-4H5v-2h10v2zm2-4H5V6h12v2z",
  projects: "M3 3h8v8H3zm10 0h8v8h-8zM3 13h8v8H3zm10 0h8v8h-8z",
  communityProjects: "M4 5h16v10H4V5Zm2 2v6h12V7H6Zm3 11h6v2H9v-2Zm2-3h2v3h-2v-3Z",
  editing: "M7 2h10a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2Zm2 2v2h6V4H9Zm-2 4v10h10V8H7Zm4 11h2v1h-2v-1Z",
  news: "M4 4h16v2H4V4zm0 4h10v2H4V8zm0 4h16v2H4v-2zm0 4h10v2H4v-2z",
  achievements: "M12 2l3 6.4L22 9.3l-5 5 1.2 7-6.2-3.5L5.8 21.3 7 14.3 2 9.3l7-.9z",
};

const clone = (value) => JSON.parse(JSON.stringify(value ?? []));
const linesToArray = (value) =>
  String(value ?? "")
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
const arrayToLines = (value) => (Array.isArray(value) ? value.join("\n") : "");
const isUrlValue = (value) => /^https?:\/\//i.test(String(value ?? ""));

const createId = () => {
  if (typeof globalThis !== "undefined" && globalThis.crypto?.randomUUID) {
    return `item-${globalThis.crypto.randomUUID()}`;
  }

  return `item-${Date.now()}-${Math.random().toString(16).slice(2)}`;
};

const createEmptyExperience = (orderIndex = 1) => ({
  id: createId(),
  role: "",
  organization: "",
  logo: { src: "", alt: "" },
  isActive: true,
  metrics: [],
  bullets: [],
  orderIndex,
});

const createEmptyHeroStat = (orderIndex = 1) => ({
  id: createId(),
  value: 0,
  suffix: "",
  label: "",
  labelId: "",
  isActive: true,
  orderIndex,
});

const createEmptyProject = (orderIndex = 1) => ({
  id: createId(),
  title: "",
  href: "",
  isActive: true,
  image: { src: "", alt: "", focus: { x: 50, y: 50 }, cardSrc: "", detailSrc: "" },
  summary: "",
  orderIndex,
});

const createEmptyCommunityProject = (orderIndex = 1) => ({
  id: createId(),
  title: "Featured Community Project",
  titleId: "Proyek Komunitas Pilihan",
  description: "",
  descriptionId: "",
  buttonLabel: "Website",
  buttonLabelId: "Website",
  href: "",
  image: { src: "/laptop-growmates.webp", alt: "Growmates website preview on a laptop" },
  isActive: true,
  orderIndex,
});

const createEmptyEditing = (orderIndex = 1) => ({
  id: createId(),
  type: orderIndex <= 2 ? "phone" : "gallery",
  title: "",
  description: "",
  href: "",
  instagramName: "",
  isActive: true,
  image: { src: "", alt: "", focus: { x: 50, y: 50 }, cardSrc: "", detailSrc: "" },
  orderIndex,
});

const createEmptyNews = (orderIndex = 1) => ({
  id: createId(),
  source: "",
  title: "",
  summary: "",
  href: "",
  isActive: true,
  image: { src: "", alt: "", focus: { x: 50, y: 50 }, cardSrc: "", detailSrc: "" },
  orderIndex,
});

const createEmptyAchievement = (orderIndex = 1) => ({
  id: createId(),
  slug: "",
  title: "",
  summary: "",
  isActive: true,
  image: { src: "", alt: "", focus: { x: 50, y: 50 }, cardSrc: "", detailSrc: "" },
  lead: "",
  meta: [],
  documentationBody: "",
  documentation: [
    { src: "", alt: "", caption: "" },
    { src: "", alt: "", caption: "" },
  ],
  certificateBody: "",
  certificate: [{ src: "", alt: "", caption: "" }],
  orderIndex,
});

const createDraftPortfolio = (portfolio) => ({
  hero: clone(portfolio.hero),
  heroStats: clone(portfolio.heroStats),
  experiences: clone(portfolio.experiences),
  projects: clone(portfolio.projects),
  communityProjects: clone(portfolio.communityProjects),
  editing: clone(portfolio.editing),
  news: clone(portfolio.news),
  achievements: clone(portfolio.achievements),
});

const getStatusBadgeClass = (status) => (status === "Active" ? "is-active" : "is-inactive");

const getRowMeta = (sectionKey, item) => {
  const status = item?.isActive === false ? "Inactive" : "Active";
  if (sectionKey === "heroStats") {
    return {
      title: item.label || "Angka hero tanpa label",
      subtitle: `${item.value ?? 0}${item.suffix ?? ""}`,
      status,
    };
  }
  if (sectionKey === "experiences") {
    return {
      title: item.role || "Peran tanpa judul",
      subtitle: item.organization || "Organisasi belum diisi",
      status,
    };
  }
  if (sectionKey === "projects") {
    return {
      title: item.title || "Proyek tanpa judul",
      subtitle: item.summary || "Ringkasan belum diisi",
      status,
    };
  }
  if (sectionKey === "communityProjects") {
    return {
      title: item.title || "Community project tanpa judul",
      subtitle: item.href || "Tautan belum diisi",
      status,
    };
  }
  if (sectionKey === "editing") {
    return {
      title: item.title || "Item editing tanpa judul",
      subtitle:
        item.type === "phone"
          ? item.instagramName || "Mockup iPhone"
          : item.description || "Gambar galeri",
      status,
    };
  }
  if (sectionKey === "news") {
    return {
      title: item.title || "Liputan tanpa judul",
      subtitle: item.source || "Sumber belum diisi",
      status,
    };
  }
  return {
    title: item.title || "Pencapaian tanpa judul",
    subtitle: item.slug || "Slug belum diisi",
    status,
  };
};

function SubmitButton({ disabled }) {
  const { pending } = useFormStatus();

  return (
    <button className="button button-primary" type="submit" disabled={disabled || pending}>
      {pending ? "Menyimpan..." : "Simpan perubahan"}
    </button>
  );
}

function Field({ label, help, children }) {
  return (
    <label className="admin-field">
      <span className="admin-field-label">{label}</span>
      {children}
      {help ? <span className="admin-field-help">{help}</span> : null}
    </label>
  );
}

function ImageField({
  label,
  help,
  value,
  altValue,
  onChange,
  onClear,
  onAltChange,
  onUpload,
  focusValue,
  onFocusChange,
  disabled,
  statusText,
  previewLabel,
  previewClassName = "",
  cropOptions = [],
  cropPreviews = [],
  onCropRequest,
}) {
  const handleClear = () => onClear?.();
  const previewRef = useRef(null);
  const draggingRef = useRef(false);
  const isDraggable = Boolean(focusValue && onFocusChange && isUrlValue(value));
  const hasCropSource = isUrlValue(value);
  const cropActions = Array.isArray(cropOptions) ? cropOptions : [];
  const cropPreviewItems = Array.isArray(cropPreviews) ? cropPreviews : [];
  const previewStyle = focusValue
    ? {
        "--media-focus-x": `${focusValue.x ?? 50}%`,
        "--media-focus-y": `${focusValue.y ?? 50}%`,
      }
    : undefined;
  const focusIndicatorStyle = focusValue
    ? {
        left: `${focusValue.x ?? 50}%`,
        top: `${focusValue.y ?? 50}%`,
      }
    : undefined;

  const clampPercent = (value) => Math.min(100, Math.max(0, value));
  const updateFocusFromEvent = (event) => {
    if (!previewRef.current || !onFocusChange) return;
    const rect = previewRef.current.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    const x = clampPercent(((event.clientX - rect.left) / rect.width) * 100);
    const y = clampPercent(((event.clientY - rect.top) / rect.height) * 100);
    onFocusChange({ x, y });
  };
  const handlePointerDown = (event) => {
    if (!isDraggable) return;
    draggingRef.current = true;
    event.preventDefault();
    event.currentTarget.setPointerCapture?.(event.pointerId);
    updateFocusFromEvent(event);
  };
  const handlePointerMove = (event) => {
    if (!draggingRef.current || !isDraggable) return;
    event.preventDefault();
    updateFocusFromEvent(event);
  };
  const handlePointerUp = (event) => {
    if (!draggingRef.current) return;
    draggingRef.current = false;
    event.currentTarget.releasePointerCapture?.(event.pointerId);
  };
  const handlePointerLeave = () => {
    draggingRef.current = false;
  };
  const handleFocusReset = () => {
    onFocusChange?.({ x: 50, y: 50 });
  };

  return (
    <div className="admin-image-field">
      <Field label={label} help={help}>
        <div className="admin-image-grid">
          <div
            ref={previewRef}
            className={`admin-image-preview ${previewClassName} ${isDraggable ? "is-draggable" : ""}`.trim()}
            aria-label={previewLabel}
            style={previewStyle}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
            onPointerLeave={handlePointerLeave}
          >
            {isUrlValue(value) ? (
              <img src={value} alt={altValue || label} draggable={false} />
            ) : (
              <span>Belum ada gambar</span>
            )}
            {isDraggable ? (
              <>
                <span className="admin-focus-indicator" style={focusIndicatorStyle} aria-hidden="true" />
                <span className="admin-image-hint" aria-hidden="true">
                  Geser gambar untuk mengatur fokus crop
                </span>
              </>
            ) : null}
          </div>
          <div className="admin-image-controls">
            <input
              type="text"
              value={value}
              readOnly
              aria-readonly="true"
              placeholder="Tautan gambar muncul setelah unggah"
              disabled={disabled}
            />
            <div className="admin-image-inline-actions">
              <button
                className="button button-secondary"
                type="button"
                onClick={handleClear}
                disabled={disabled || !value}
              >
                Hapus gambar
              </button>
              <button
                className="button button-secondary"
                type="button"
                onClick={() => copyToClipboard(value)}
                disabled={disabled || !value}
              >
                Salin tautan
              </button>
            </div>
            <input
              type="text"
              value={altValue}
              onChange={(event) => onAltChange?.(event.target.value)}
              placeholder="Deskripsi gambar"
              disabled={disabled}
            />
            <div className="admin-upload-row">
              <label className="button button-secondary admin-upload-button">
                <input type="file" accept="image/*" onChange={onUpload} disabled={disabled} />
                Unggah/ganti gambar
              </label>
            </div>
            <UploadStatus text={statusText} />
            {cropActions.length ? (
              <div className="admin-crop-actions">
                {cropActions.map((option) => (
                  <button
                    key={option.label}
                    className="button button-secondary"
                    type="button"
                    onClick={() => onCropRequest?.(option)}
                    disabled={disabled || !hasCropSource}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            ) : null}
            {cropPreviewItems.length
              ? cropPreviewItems.map((preview) => (
                  <CropPreview
                    key={preview.label}
                    label={preview.label}
                    value={preview.value}
                    statusText={preview.statusText}
                    onClear={preview.onClear}
                    disabled={disabled}
                  />
                ))
              : null}
            {focusValue && onFocusChange ? (
              <button
                className="button button-secondary"
                type="button"
                onClick={handleFocusReset}
                disabled={disabled}
              >
                Reset fokus
              </button>
            ) : null}
          </div>
        </div>
      </Field>
    </div>
  );
}

function ItemToolbar({ onRemove, sectionLabel, disabled, isActive, onStatusChange }) {
  return (
    <div className="admin-item-toolbar" style={{ justifyContent: "flex-start", gap: 12 }}>
      <label className="admin-switch">
        <input
          type="checkbox"
          checked={isActive}
          onChange={(event) => onStatusChange(event.target.checked)}
          disabled={disabled}
          aria-label={isActive ? "Active" : "Inactive"}
        />
        <span className="admin-switch-track" aria-hidden="true" />
        <span className="admin-switch-label">{isActive ? "Tayang" : "Disembunyikan"}</span>
      </label>

      <button
        className="button button-secondary admin-remove-button"
        type="button"
        onClick={onRemove}
        style={{ marginLeft: 0 }}
      >
        Hapus {sectionLabel}
      </button>
    </div>
  );
}

function UploadStatus({ text }) {
  if (!text) return null;
  return <p className="admin-upload-status">{text}</p>;
}

function CropPreview({ label, value, statusText, onClear, disabled }) {
  if (!value) return null;
  return (
    <div className="admin-crop-preview">
      <div className="admin-crop-preview-header">
        <span>{label}</span>
        {onClear ? (
          <button type="button" className="button button-secondary" onClick={onClear} disabled={disabled}>
            Hapus crop
          </button>
        ) : null}
      </div>
      <div className="admin-crop-preview-media">
        <img src={value} alt={label} />
      </div>
      <input type="text" value={value} readOnly aria-readonly="true" />
      <UploadStatus text={statusText} />
    </div>
  );
}

function ListQuickAdd({ value, onChange, placeholder, disabled }) {
  const [draft, setDraft] = useState("");
  const items = Array.isArray(value) ? value : [];

  const handleAdd = () => {
    const nextValue = draft.trim();
    if (!nextValue) return;
    onChange([...items, nextValue]);
    setDraft("");
  };

  const handleRemove = (removeIndex) => {
    onChange(items.filter((_, index) => index !== removeIndex));
  };

  return (
    <div className="admin-list-quick">
      <div className="admin-list-quick-input">
        <input
          type="text"
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              handleAdd();
            }
          }}
          placeholder={placeholder}
          disabled={disabled}
        />
        <button className="button button-secondary" type="button" onClick={handleAdd} disabled={disabled}>
          Tambah
        </button>
      </div>
      <div className="admin-list-quick-count">{items.length} poin ditambahkan</div>
      {items.length ? (
        <div className="admin-chip-list" aria-label="Quick add items">
          {items.map((item, index) => (
            <span className="admin-chip" key={`${item}-${index}`}>
              <span>{item}</span>
              <button type="button" onClick={() => handleRemove(index)} aria-label={`Hapus ${item}`}>
                x
              </button>
            </span>
          ))}
        </div>
      ) : null}
    </div>
  );
}

const copyToClipboard = async (value) => {
  if (!value || typeof navigator === "undefined" || !navigator.clipboard) return;
  try {
    await navigator.clipboard.writeText(value);
  } catch (error) {
    console.error(error);
  }
};

export default function AdminForm({
  initialPortfolio,
  initialProfile,
  initialMessages,
  supabaseReady,
  supabaseMode,
}) {
  const [state, formAction] = useActionState(updatePortfolio, initialState);
  const [draft, setDraft] = useState(() => createDraftPortfolio(initialPortfolio));
  const [profile, setProfile] = useState(initialProfile);
  const [uploadStatus, setUploadStatus] = useState({});
  const [activeSection, setActiveSection] = useState(sectionOrder[0]);
  const [utilityPanel, setUtilityPanel] = useState(null);
  const [isDark, setIsDark] = useState(false);
  const [sidebarCollapsed] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [manageOpen, setManageOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [toastMessage, setToastMessage] = useState("");
  const [toastStatus, setToastStatus] = useState("success");
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [focusIndex, setFocusIndex] = useState(null);
  const [cropConfig, setCropConfig] = useState(null);
  const editorRef = useRef(null);
  const profileImage = profile?.image?.src;
  const profileImageAlt = profile?.image?.alt || "Naila Azahra profile";
  const statusLabel =
    supabaseMode === "service" ? "Siap disimpan" : supabaseReady ? "Hanya lihat" : "Belum siap";
  const statusClass =
    supabaseMode === "service" ? "is-ready" : supabaseReady ? "is-limited" : "is-missing";
  const canPublish = supabaseMode === "service";

  useEffect(() => {
    setIsReady(true);
    if (typeof document !== "undefined") {
      setIsDark(document.documentElement.dataset.theme === "dark");
    }
  }, []);

  useEffect(() => {
    if (state.message) {
      setToastMessage(state.message);
      setToastStatus(state.status === "success" ? "success" : "error");
    }
  }, [state.message, state.status]);

  useEffect(() => {
    if (!toastMessage) return;
    const timer = globalThis.setTimeout(() => setToastMessage(""), 4000);
    return () => globalThis.clearTimeout(timer);
  }, [toastMessage]);

  useEffect(() => {
    setPage(1);
  }, [activeSection, searchQuery, statusFilter]);

  useEffect(() => {
    if (focusIndex === null || !editorRef.current) return;
    editorRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [focusIndex]);

  const rows = useMemo(() => {
    return draft[activeSection].map((item, index) => {
      const meta = getRowMeta(activeSection, item);
      return {
        id: item.id ?? `${activeSection}-${index}`,
        orderIndex: item.orderIndex ?? index + 1,
        index,
        isActive: item?.isActive !== false,
        ...meta,
      };
    });
  }, [draft, activeSection]);

  const filteredRows = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return rows.filter((row) => {
      const matchesQuery = !query
        ? true
        : `${row.title} ${row.subtitle}`.toLowerCase().includes(query);
      const matchesStatus = statusFilter === "all" ? true : row.status === statusFilter;
      return matchesQuery && matchesStatus;
    });
  }, [rows, searchQuery, statusFilter]);

  const sortedRows = filteredRows;

  const pageSize = 5;
  const totalPages = Math.max(1, Math.ceil(sortedRows.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const paginatedRows = sortedRows.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const reindexSection = (sectionKey, items) =>
    items.map((item, index) => ({
      ...item,
      orderIndex: index + 1,
    }));

  const moveItem = (sectionKey, fromIndex, toIndex) => {
    setDraft((currentDraft) => {
      const items = [...currentDraft[sectionKey]];
      if (fromIndex < 0 || fromIndex >= items.length) return currentDraft;
      if (toIndex < 0 || toIndex >= items.length) return currentDraft;
      const [moved] = items.splice(fromIndex, 1);
      items.splice(toIndex, 0, moved);
      return {
        ...currentDraft,
        [sectionKey]: reindexSection(sectionKey, items),
      };
    });
  };

  const handleEditRow = (row) => {
    setFocusIndex(row.index);
  };

  const updateSectionItem = (sectionKey, itemIndex, updater) => {
    setDraft((currentDraft) => ({
      ...currentDraft,
      [sectionKey]: currentDraft[sectionKey].map((item, currentIndex) =>
        currentIndex === itemIndex ? updater(item) : item
      ),
    }));
  };

  const openCropper = (config) => {
    if (!config?.imageSrc) return;
    setCropConfig(config);
  };

  const addItem = (sectionKey) => {
    setDraft((currentDraft) => {
      const nextItems = currentDraft[sectionKey];
      const nextOrderIndex = nextItems.length + 1;

      const factory = {
        heroStats: createEmptyHeroStat,
        experiences: createEmptyExperience,
        projects: createEmptyProject,
        communityProjects: createEmptyCommunityProject,
        editing: createEmptyEditing,
        news: createEmptyNews,
        achievements: createEmptyAchievement,
      }[sectionKey];

      return {
        ...currentDraft,
        [sectionKey]: [...nextItems, factory(nextOrderIndex)],
      };
    });
  };

  const removeItem = (sectionKey, itemIndex) => {
    setDraft((currentDraft) => ({
      ...currentDraft,
      [sectionKey]: currentDraft[sectionKey].filter((_, currentIndex) => currentIndex !== itemIndex),
    }));
  };

  const uploadImage = async ({ file, sectionKey, itemIndex, target, prefix, purpose }) => {
    if (!file) return;

    const statusKey = `${sectionKey}-${itemIndex}-${target}`;
    setUploadStatus((current) => ({ ...current, [statusKey]: "Mengunggah gambar..." }));

    const formData = new globalThis.FormData();
    formData.append("file", file);
    formData.append("folder", `admin/${sectionKey}`);
    formData.append("prefix", prefix);
    const inferredPurpose =
      purpose ||
      (typeof target === "number" || String(target).startsWith("certificate")
        ? "documentation"
        : sectionKey === "editing"
          ? draft.editing[itemIndex]?.type === "phone"
            ? "phone"
            : "gallery"
          : target === "image-detail"
            ? "documentation"
            : "card");
    formData.append("purpose", inferredPurpose);

    try {
      const response = await globalThis.fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const result = await response.json();

      if (!response.ok || !result.ok) {
        throw new Error("Gagal mengunggah gambar. Silakan coba lagi.");
      }

      updateSectionItem(sectionKey, itemIndex, (item) => {
        if (target === "image") {
          return {
            ...item,
            image: {
              ...(item.image ?? {}),
              src: result.url,
              cardSrc: "",
              detailSrc: "",
            },
          };
        }

        if (target === "image-card") {
          return {
            ...item,
            image: {
              ...(item.image ?? {}),
              cardSrc: result.url,
            },
          };
        }

        if (target === "image-detail") {
          return {
            ...item,
            image: {
              ...(item.image ?? {}),
              detailSrc: result.url,
            },
          };
        }

        if (target === "logo") {
          return {
            ...item,
            logo: {
              ...(item.logo ?? {}),
              src: result.url,
            },
          };
        }

        if (typeof target === "string" && target.startsWith("certificate")) {
          const certificateIndex = Number(target.split("-")[1] ?? 0);
          const certificate = Array.isArray(item.certificate)
            ? [...item.certificate]
            : item.certificate
              ? [item.certificate]
              : [];
          const nextCertificate = certificate.length
            ? certificate.map((entry, entryIndex) =>
                entryIndex === certificateIndex ? { ...(entry ?? {}), src: result.url } : entry
              )
            : [{ src: result.url, alt: "", caption: "" }];
          return {
            ...item,
            certificate: nextCertificate,
          };
        }

        if (typeof target === "number") {
          const documentation = [...(item.documentation ?? [])];
          documentation[target] = {
            ...(documentation[target] ?? {}),
            src: result.url,
          };
          return {
            ...item,
            documentation,
          };
        }

        return item;
      });

      setUploadStatus((current) => ({
        ...current,
        [statusKey]: "Gambar berhasil diunggah.",
      }));
    } catch (error) {
      setUploadStatus((current) => ({
        ...current,
        [statusKey]: error instanceof Error ? error.message : "Gagal mengunggah foto profil.",
      }));
    }
  };

  const uploadProfileImage = async (file) => {
    if (!file) return;
    const statusKey = "profile-image";
    setUploadStatus((current) => ({ ...current, [statusKey]: "Mengunggah foto profil..." }));
    const formData = new globalThis.FormData();
    formData.append("file", file);
    formData.append("folder", "navbar-profile");
    formData.append("prefix", "profile-photo");
    formData.append("bucket", "profile");
    formData.append("purpose", "profile");

    try {
      const response = await globalThis.fetch("/api/upload", { method: "POST", body: formData });
      const result = await response.json();
      if (!response.ok || !result.ok) throw new Error("Gagal mengunggah foto profil. Silakan coba lagi.");

      setProfile((current) => ({
        ...current,
        image: { ...(current.image ?? {}), src: result.url },
      }));
      setUploadStatus((current) => ({
        ...current,
        [statusKey]: "Foto profil berhasil diunggah.",
      }));
    } catch (error) {
      setUploadStatus((current) => ({
        ...current,
        [statusKey]: error instanceof Error ? error.message : "Gagal mengunggah gambar.",
      }));
    }
  };

  const handleCropSave = async (croppedBlob) => {
    if (!cropConfig || !croppedBlob) return;
    const fileName = `crop-${cropConfig.variant}-${Date.now()}.webp`;
    const file = new globalThis.File([croppedBlob], fileName, {
      type: croppedBlob.type || "image/webp",
    });

    await uploadImage({
      file,
      sectionKey: cropConfig.sectionKey,
      itemIndex: cropConfig.itemIndex,
      target: cropConfig.target,
      prefix: cropConfig.prefix,
    });

    setCropConfig(null);
  };

  const hiddenPayload = {
    hero: JSON.stringify(draft.hero),
    heroStats: JSON.stringify(draft.heroStats),
    experiences: JSON.stringify(draft.experiences),
    projects: JSON.stringify(draft.projects),
    communityProjects: JSON.stringify(draft.communityProjects),
    editing: JSON.stringify(draft.editing),
    news: JSON.stringify(draft.news),
    achievements: JSON.stringify(draft.achievements),
    siteProfile: JSON.stringify(profile),
  };

  const downloadDraftData = () => {
    const payload = {
      ...draft,
      siteProfile: profile,
      exportedAt: new Date().toISOString(),
    };
    const blob = new globalThis.Blob([JSON.stringify(payload, null, 2)], {
      type: "application/json",
    });
    const url = globalThis.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `portfolio-content-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    globalThis.URL.revokeObjectURL(url);
  };

  const visibleSections = sectionOrder.filter((sectionKey) => sectionKey === activeSection);

  return (
    <form className="admin-dashboard" action={formAction}>
      <input type="hidden" name="hero" value={hiddenPayload.hero} />
      {sectionOrder.map((sectionKey) => (
        <input key={sectionKey} type="hidden" name={sectionKey} value={hiddenPayload[sectionKey]} />
      ))}
      <input type="hidden" name="siteProfile" value={hiddenPayload.siteProfile} />
      <div
        className={`admin-layout ${sidebarCollapsed ? "is-collapsed" : ""} ${sidebarOpen ? "is-open" : ""}`}
      >
        <aside className="admin-sidebar" aria-label="Navigasi sidebar">
          <div className="admin-sidebar-header">
            <div className="admin-logo">
              <span className={`admin-logo-mark ${profileImage ? "has-image" : ""}`.trim()}>
                {profileImage ? <img src={profileImage} alt={profileImageAlt} /> : "NA"}
              </span>
              <div>
                <strong>Panel Admin</strong>
                <small>Manajemen Portofolio</small>
              </div>
            </div>
            <button
              className="admin-icon-button admin-close-button"
              type="button"
              onClick={() => setSidebarOpen(false)}
              aria-label="Tutup sidebar"
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M6 6l12 12M18 6l-12 12" />
              </svg>
            </button>
          </div>

          <div className="admin-sidebar-content" aria-label="Konten sidebar">
            <div className="admin-nav-section">
              <p className="admin-nav-label">Dasbor</p>
              <button
                type="button"
                className={`admin-nav-item ${!utilityPanel && activeSection === "experiences" ? "is-active" : ""}`}
                onClick={() => {
                  setUtilityPanel(null);
                  setActiveSection("experiences");
                }}
              >
                <span className="admin-nav-icon">
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M4 4h6v6H4V4Zm10 0h6v4h-6V4ZM4 14h6v6H4v-6Zm10-2h6v8h-6v-8Z" />
                  </svg>
                </span>
                <span className="admin-nav-text">Ringkasan</span>
              </button>
            </div>

            <div className="admin-nav-section">
              <button
                type="button"
                className="admin-nav-group-toggle"
                onClick={() => setManageOpen((current) => !current)}
                aria-expanded={manageOpen}
              >
                <span className="admin-nav-text">Konten</span>
                {manageOpen ? (
                  <ChevronDown className="admin-nav-group-icon" aria-hidden="true" />
                ) : (
                  <ChevronRight className="admin-nav-group-icon" aria-hidden="true" />
                )}
              </button>
              {manageOpen || sidebarCollapsed ? (
                <div className="admin-nav-group">
                  {sectionOrder.map((sectionKey) => (
                    <button
                      key={sectionKey}
                      type="button"
                      className={`admin-nav-item ${activeSection === sectionKey ? "is-active" : ""}`}
                      onClick={() => {
                        setUtilityPanel(null);
                        setActiveSection(sectionKey);
                      }}
                    >
                      <span className="admin-nav-icon">
                        <svg viewBox="0 0 24 24" aria-hidden="true">
                          <path d={navIcons[sectionKey]} />
                        </svg>
                      </span>
                      <span className="admin-nav-text">{sectionConfig[sectionKey].title}</span>
                      <span className="admin-nav-count">{draft[sectionKey].length}</span>
                    </button>
                  ))}
                </div>
              ) : null}
            </div>

            <div className="admin-nav-section">
              <p className="admin-nav-label">Alat</p>
              <button
                type="button"
                className={`admin-nav-item ${utilityPanel === "profile" ? "is-active" : ""}`}
                onClick={() => setUtilityPanel("profile")}
              >
                <span className="admin-nav-icon">
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M12 12a4 4 0 1 0-4-4 4 4 0 0 0 4 4Zm0 2c-4 0-7 2-7 4.5V20h14v-1.5C19 16 16 14 12 14Z" />
                  </svg>
                </span>
                <span className="admin-nav-text">Foto Navbar</span>
              </button>
              <button
                type="button"
                className={`admin-nav-item ${utilityPanel === "messages" ? "is-active" : ""}`}
                onClick={() => setUtilityPanel("messages")}
              >
                <span className="admin-nav-icon">
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M3 5h18v14H3V5Zm2 2v1l7 5 7-5V7H5Zm14 10v-6.55l-7 5-7-5V17h14Z" />
                  </svg>
                </span>
                <span className="admin-nav-text">Pesan Masuk</span>
                <span className="admin-nav-count">{initialMessages.length}</span>
              </button>
            </div>
          </div>

          <div className="admin-sidebar-footer">
            <div className="admin-user-card">
              <div className={`admin-avatar ${profileImage ? "has-image" : ""}`.trim()}>
                {profileImage ? <img src={profileImage} alt={profileImageAlt} /> : "NA"}
              </div>
              <div>
                <strong>Naila Azahra</strong>
                <small>Pemilik website</small>
              </div>
            </div>
          </div>
        </aside>

        <div className="admin-main">
          <header className="admin-topbar" role="banner">
            <div className="admin-breadcrumb" aria-label="Breadcrumb">
              <button
                className="admin-icon-button admin-menu-button"
                type="button"
                onClick={() => setSidebarOpen(true)}
                aria-label="Buka sidebar"
              >
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              <span>Dasbor</span>
              <span>/</span>
              <strong>
                {utilityPanel === "profile"
                    ? "Foto Navbar"
                  : utilityPanel === "messages"
                    ? "Pesan Masuk"
                    : sectionConfig[activeSection].title}
              </strong>
            </div>
            <div className="admin-topbar-actions">
              <label className="admin-search" aria-label="Cari">
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M11 4a7 7 0 1 0 4.47 12.38l3.08 3.08 1.42-1.42-3.08-3.08A7 7 0 0 0 11 4Zm0 2a5 5 0 1 1 0 10 5 5 0 0 1 0-10Z" />
                </svg>
                <input
                  type="search"
                  placeholder="Cari konten..."
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                />
              </label>
              <div className="admin-topbar-icons">
                <button
                  className="admin-icon-button"
                  type="button"
                  onClick={() => {
                    const root = document.documentElement;
                    const next = root.dataset.theme === "dark" ? "light" : "dark";
                    root.dataset.theme = next;
                    setIsDark(next === "dark");
                  }}
                  aria-label={isDark ? "Aktifkan mode terang" : "Aktifkan mode gelap"}
                >
                  <svg viewBox="0 0 24 24" aria-hidden="true" style={{ color: isDark ? '#fff' : undefined }}>
                    <path fill="currentColor" d="M12 3a9 9 0 1 0 9 9c0-.45-.04-.89-.1-1.32A6.5 6.5 0 0 1 12.32 3.1C12.21 3.04 12.1 3 12 3Z" />
                  </svg>
                </button>
                <div className="admin-user-menu">
                  <button
                    className="admin-user-button"
                    type="button"
                    onClick={() => setUserMenuOpen((current) => !current)}
                    aria-haspopup="true"
                    aria-expanded={userMenuOpen}
                  >
                    <span className={`admin-avatar ${profileImage ? "has-image" : ""}`.trim()}>
                      {profileImage ? <img src={profileImage} alt={profileImageAlt} /> : "NA"}
                    </span>
                    <span className="admin-user-name">Naila</span>
                  </button>
                  {userMenuOpen ? (
                    <div className="admin-dropdown" role="menu">
                      <button type="submit" formAction={logoutAdmin} className="admin-dropdown-logout">
                        <LogOut size={16} aria-hidden="true" />
                        <span>Keluar</span>
                      </button>
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          </header>

          {utilityPanel === "profile" ? (
            <div className="admin-content" role="main">
              <section className="admin-editor-panel admin-profile-panel">
                <div className="admin-panel-heading">
                  <div>
                    <p className="eyebrow">Navbar</p>
                    <h2>Foto Navbar</h2>
                    <p className="form-note">
                      Unggah foto yang tampil pada identitas di navbar publik.
                    </p>
                  </div>
                </div>
                <ImageField
                  label="Foto profil"
                  help="Unggah foto yang akan tampil pada navbar."
                  value={profile.image?.src ?? ""}
                  altValue={profile.image?.alt ?? ""}
                  onClear={() =>
                    setProfile((current) => ({ ...current, image: { ...(current.image ?? {}), src: "" } }))
                  }
                  onAltChange={(value) =>
                    setProfile((current) => ({ ...current, image: { ...(current.image ?? {}), alt: value } }))
                  }
                  onUpload={(event) =>
                    uploadProfileImage(event.target.files?.[0]).finally(() => {
                      event.target.value = "";
                    })
                  }
                  disabled={!supabaseReady}
                  previewLabel="Pratinjau foto navbar"
                  previewClassName="is-square"
                  statusText={uploadStatus["profile-image"]}
                />
              </section>
              <div className="admin-savebar">
                <div>
                  <strong>{canPublish ? "Siap disimpan" : "Penyimpanan belum tersedia"}</strong>
                  <p className="form-note">Simpan untuk memperbarui foto profil pada halaman publik.</p>
                </div>
                <SubmitButton disabled={!canPublish} />
              </div>
            </div>
          ) : null}

          {utilityPanel === "messages" ? (
            <div className="admin-content" role="main">
              <section className="admin-editor-panel admin-inbox">
                <div className="admin-panel-heading">
                  <div>
                    <p className="eyebrow">Kontak</p>
                    <h2>Pesan Masuk</h2>
                      <p className="form-note">Pesan terbaru yang dikirim melalui formulir kontak.</p>
                  </div>
                </div>
                {initialMessages.length ? (
                  <div className="admin-message-list">
                    {initialMessages.map((item) => (
                      <article className="admin-contact-message" key={item.id}>
                        <div className="admin-contact-head">
                          <strong>{item.name}</strong>
                          <time>{new Date(item.created_at).toLocaleString("id-ID")}</time>
                        </div>
                        <a href={`mailto:${item.email}`}>{item.email}</a>
                        <p>{item.message}</p>
                      </article>
                    ))}
                  </div>
                ) : (
                  <div className="admin-empty-state"><p>Belum ada pesan masuk.</p></div>
                )}
              </section>
            </div>
          ) : null}

          <div className={`admin-content ${utilityPanel ? "is-hidden" : ""}`.trim()} role="main">
            <div className="admin-page-header">
              <div>
                <p className="eyebrow">{sectionConfig[activeSection].title}</p>
                <h1>Kelola konten {sectionConfig[activeSection].title}</h1>
                <p className="form-note">
                  Status penyimpanan: <span className={`admin-status ${statusClass}`}>{statusLabel}</span>
                </p>
              </div>
              <div className="admin-page-actions">
                <button
                  className="button button-primary"
                  type="button"
                  onClick={() => addItem(activeSection)}
                >
                  Tambah baru
                </button>
                <button className="button button-secondary" type="button" onClick={downloadDraftData}>
                  Ekspor JSON
                </button>
              </div>
            </div>

            <section className="admin-metrics" aria-label="Ringkasan konten">
              {(isReady ? [
                { label: "Hero Stats", value: draft.heroStats.length },
                { label: "Pengalaman", value: draft.experiences.length },
                { label: "Proyek", value: draft.projects.length },
                { label: "Community", value: draft.communityProjects.length },
                { label: "Editing", value: draft.editing.length },
                { label: "Liputan", value: draft.news.length },
                { label: "Pencapaian", value: draft.achievements.length },
              ] : Array.from({ length: 7 })).map((metric, index) => (
                <article className={`admin-metric-card ${isReady ? "is-ready" : "is-skeleton"}`} key={index}>
                  {isReady ? (
                    <>
                      <div className="admin-metric-icon">
                        <svg viewBox="0 0 24 24" aria-hidden="true">
                          <path d="M4 13h6v7H4zM14 4h6v16h-6zM4 4h6v7H4z" />
                        </svg>
                      </div>
                      <strong>{metric.value}</strong>
                      <span>{metric.label}</span>
                    </>
                  ) : null}
                </article>
              ))}
            </section>

            <section className="admin-encouragement" aria-live="polite">
              <strong>Panduan singkat</strong>
              <p>
                Gunakan tabel untuk mencari, mengurutkan, mengedit, atau menyembunyikan konten.
                Simpan perubahan setelah semua item siap ditampilkan.
              </p>
            </section>

            <section className="admin-table-card" aria-label="Daftar konten">
              <div className="admin-table-filters">
                <label className="admin-search" aria-label="Cari dalam daftar">
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M11 4a7 7 0 1 0 4.47 12.38l3.08 3.08 1.42-1.42-3.08-3.08A7 7 0 0 0 11 4Zm0 2a5 5 0 1 1 0 10 5 5 0 0 1 0-10Z" />
                  </svg>
                  <input
                    type="search"
                    placeholder="Cari di tabel..."
                    value={searchQuery}
                    onChange={(event) => setSearchQuery(event.target.value)}
                  />
                </label>
                <select
                  className="admin-select"
                  value={statusFilter}
                  onChange={(event) => setStatusFilter(event.target.value)}
                  aria-label="Filter status"
                >
                  <option value="all">Semua status</option>
                  <option value="Active">Tayang</option>
                  <option value="Inactive">Disembunyikan</option>
                </select>
                
              </div>

              <div className="admin-table-wrapper" role="table">
                <table className="admin-table">
                  <thead>
                    <tr>
                       <th>Judul</th>
                       <th>Detail</th>
                       <th>Status</th>
                       <th>Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {!isReady
                      ? Array.from({ length: 4 }).map((_, index) => (
                          <tr className="admin-skeleton-row" key={index}>
                            <td colSpan={4}></td>
                          </tr>
                        ))
                      : paginatedRows.map((row) => (
                          <tr
                            key={row.id}
                            className={`admin-table-row ${row.isActive ? "" : "is-inactive"}`}
                          >
                            <td>
                              <div className="admin-table-title">
                                <strong>{row.title}</strong>
                                <small>{row.subtitle}</small>
                              </div>
                            </td>
                            <td>{row.subtitle}</td>
                            <td>
                              <span className={`admin-badge-status ${getStatusBadgeClass(row.status)}`}>
                                {row.status === "Active" ? "Tayang" : "Disembunyikan"}
                              </span>
                            </td>
                            <td>
                              <div className="admin-row-actions" aria-label="Aksi item">
                                <button
                                  className="admin-row-action"
                                  type="button"
                                  onClick={() => moveItem(activeSection, row.index, row.index - 1)}
                                  disabled={row.index === 0}
                                  aria-label="Pindah ke atas"
                                >
                                  <ChevronUp size={17} />
                                </button>
                                <button
                                  className="admin-row-action"
                                  type="button"
                                  onClick={() => moveItem(activeSection, row.index, row.index + 1)}
                                  disabled={row.index === draft[activeSection].length - 1}
                                  aria-label="Pindah ke bawah"
                                >
                                  <ChevronDown size={17} />
                                </button>
                                <button className="admin-row-action" type="button" onClick={() => handleEditRow(row)} aria-label="Edit">
                                  <PencilLine size={16} />
                                </button>
                                <button className="admin-row-action is-danger" type="button" onClick={() => setDeleteTarget(row)} aria-label="Hapus">
                                  <Trash2 size={16} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                  </tbody>
                </table>
              </div>

              <div className="admin-pagination" role="navigation" aria-label="Pagination">
                <button
                  type="button"
                  className="button button-secondary"
                  onClick={() => setPage((current) => Math.max(1, current - 1))}
                  disabled={currentPage === 1}
                >
                  Sebelumnya
                </button>
                <span>
                  Halaman {currentPage} dari {totalPages}
                </span>
                <button
                  type="button"
                  className="button button-secondary"
                  onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
                  disabled={currentPage === totalPages}
                >
                  Berikutnya
                </button>
              </div>
            </section>

            <section className="admin-editor-block" ref={editorRef}>
              {visibleSections.map((sectionKey) => (
                <section className="admin-editor-panel" id={`admin-${sectionKey}`} key={sectionKey}>
                  <div className="admin-panel-heading">
                    <div>
                      <p className="eyebrow">{sectionKey}</p>
                      <h2>{sectionConfig[sectionKey].title}</h2>
                      <p className="form-note">{sectionConfig[sectionKey].description}</p>
                    </div>
                    <button
                      className="button button-secondary"
                      type="button"
                      onClick={() => addItem(sectionKey)}
                    >
                      {sectionConfig[sectionKey].addLabel}
                    </button>
                  </div>

                  {sectionKey === "heroStats" ? (
                    <article className="admin-item-card">
                      <div className="admin-subheading-row">
                        <div>
                          <h3>Button CV</h3>
                          <p className="form-note">
                            Atur link yang dibuka saat pengunjung menekan tombol View Resume.
                          </p>
                        </div>
                        {isUrlValue(draft.hero.resumeUrl) ? (
                          <a
                            className="button button-secondary"
                            href={draft.hero.resumeUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            Coba link
                          </a>
                        ) : null}
                      </div>
                      <Field
                        label="Link tombol CV"
                        help="Gunakan link lengkap, misalnya link Google Drive yang diawali https://."
                      >
                        <input
                          type="url"
                          value={draft.hero.resumeUrl ?? ""}
                          onChange={(event) =>
                            setDraft((currentDraft) => ({
                              ...currentDraft,
                              hero: {
                                ...currentDraft.hero,
                                resumeUrl: event.target.value,
                              },
                            }))
                          }
                          placeholder="https://drive.google.com/..."
                          required
                          disabled={!supabaseReady}
                        />
                      </Field>
                    </article>
                  ) : null}

                  {draft[sectionKey].length ? (
                    <div className="admin-item-list">
                      {draft[sectionKey].map((item, index) => {
                        const imageStatusKey = `${sectionKey}-${index}-image`;

                        if (sectionKey === "heroStats") {
                          return (
                            <article className="admin-item-card" key={item.id ?? index}>
                              <ItemToolbar
                                disabled={!supabaseReady}
                                sectionLabel="angka hero"
                                isActive={item.isActive !== false}
                                onStatusChange={(value) =>
                                  updateSectionItem(sectionKey, index, (currentItem) => ({
                                    ...currentItem,
                                    isActive: value,
                                  }))
                                }
                                onRemove={() => removeItem(sectionKey, index)}
                              />
                              <div className="admin-grid-2">
                                <Field label="Angka">
                                  <input
                                    type="number"
                                    value={item.value ?? 0}
                                    onChange={(event) =>
                                      updateSectionItem(sectionKey, index, (currentItem) => ({
                                        ...currentItem,
                                        value: Number(event.target.value),
                                      }))
                                    }
                                    disabled={!supabaseReady}
                                  />
                                </Field>
                                <Field label="Suffix">
                                  <input
                                    type="text"
                                    value={item.suffix ?? ""}
                                    onChange={(event) =>
                                      updateSectionItem(sectionKey, index, (currentItem) => ({
                                        ...currentItem,
                                        suffix: event.target.value,
                                      }))
                                    }
                                    placeholder="+, %, atau kosong"
                                    disabled={!supabaseReady}
                                  />
                                </Field>
                              </div>
                              <Field label="Label kartu (English)">
                                <textarea
                                  rows={3}
                                  value={item.label ?? ""}
                                  onChange={(event) =>
                                    updateSectionItem(sectionKey, index, (currentItem) => ({
                                      ...currentItem,
                                      label: event.target.value,
                                    }))
                                  }
                                  disabled={!supabaseReady}
                                />
                              </Field>
                              <Field label="Label kartu (Indonesia)">
                                <textarea
                                  rows={3}
                                  value={item.labelId ?? ""}
                                  onChange={(event) =>
                                    updateSectionItem(sectionKey, index, (currentItem) => ({
                                      ...currentItem,
                                      labelId: event.target.value,
                                    }))
                                  }
                                  disabled={!supabaseReady}
                                />
                              </Field>
                            </article>
                          );
                        }

                        if (sectionKey === "experiences") {
                      return (
                        <article className="admin-item-card" key={item.id ?? index}>
                          <ItemToolbar
                            disabled={!supabaseReady}
                            sectionLabel="pengalaman"
                            isActive={item.isActive !== false}
                            onStatusChange={(value) =>
                              updateSectionItem(sectionKey, index, (currentItem) => ({
                                ...currentItem,
                                isActive: value,
                              }))
                            }
                            onRemove={() => removeItem(sectionKey, index)}
                          />
                          <Field label="Jabatan">
                            <input
                              type="text"
                              value={item.role ?? ""}
                              onChange={(event) =>
                                updateSectionItem(sectionKey, index, (currentItem) => ({
                                  ...currentItem,
                                  role: event.target.value,
                                }))
                              }
                              disabled={!supabaseReady}
                            />
                          </Field>

                          <ImageField
                            label="Logo"
                            help="Unggah logo atau ikon untuk pengalaman ini."
                            value={item.logo?.src ?? ""}
                            altValue={item.logo?.alt ?? ""}
                            onChange={(nextValue) =>
                              updateSectionItem(sectionKey, index, (currentItem) => ({
                                ...currentItem,
                                logo: {
                                  ...(currentItem.logo ?? {}),
                                  src: nextValue,
                                },
                              }))
                            }
                            onClear={() =>
                              updateSectionItem(sectionKey, index, (currentItem) => ({
                                ...currentItem,
                                logo: {
                                  ...(currentItem.logo ?? {}),
                                  src: "",
                                },
                              }))
                            }
                            onAltChange={(nextValue) =>
                              updateSectionItem(sectionKey, index, (currentItem) => ({
                                ...currentItem,
                                logo: {
                                  ...(currentItem.logo ?? {}),
                                  alt: nextValue,
                                },
                              }))
                            }
                            onUpload={(event) =>
                              uploadImage({
                                file: event.target.files?.[0],
                                sectionKey,
                                itemIndex: index,
                                target: "logo",
                                prefix: "logo",
                              }).finally(() => {
                                event.target.value = "";
                              })
                            }
                            disabled={!supabaseReady}
                            previewLabel="Experience logo preview"
                            statusText={uploadStatus[`${sectionKey}-${index}-logo`]}
                          />

                          <Field label="Organisasi">
                            <input
                              type="text"
                              value={item.organization ?? ""}
                              onChange={(event) =>
                                updateSectionItem(sectionKey, index, (currentItem) => ({
                                  ...currentItem,
                                  organization: event.target.value,
                                }))
                              }
                              disabled={!supabaseReady}
                            />
                          </Field>
                          <Field label="Angka pencapaian" help="Tambahkan satu per satu.">
                            <ListQuickAdd
                              value={item.metrics}
                              onChange={(nextValue) =>
                                updateSectionItem(sectionKey, index, (currentItem) => ({
                                  ...currentItem,
                                  metrics: nextValue,
                                }))
                              }
                              placeholder="Contoh: 30 kandidat diseleksi"
                              disabled={!supabaseReady}
                            />
                          </Field>
                          <Field label="Poin kegiatan" help="Tambahkan satu per satu.">
                            <ListQuickAdd
                              value={item.bullets}
                              onChange={(nextValue) =>
                                updateSectionItem(sectionKey, index, (currentItem) => ({
                                  ...currentItem,
                                  bullets: nextValue,
                                }))
                              }
                              placeholder="Contoh: Memimpin program onboarding"
                              disabled={!supabaseReady}
                            />
                          </Field>
                        </article>
                      );
                    }

                    if (sectionKey === "communityProjects") {
                      const image = item.image ?? {};
                      return (
                        <article className="admin-item-card" key={item.id ?? index}>
                          <ItemToolbar
                            disabled={!supabaseReady}
                            sectionLabel="community project"
                            isActive={item.isActive !== false}
                            onStatusChange={(value) =>
                              updateSectionItem(sectionKey, index, (currentItem) => ({
                                ...currentItem,
                                isActive: value,
                              }))
                            }
                            onRemove={() => removeItem(sectionKey, index)}
                          />
                          <div className="admin-grid-2">
                            <Field label="Judul (English)">
                              <input
                                type="text"
                                value={item.title ?? ""}
                                onChange={(event) =>
                                  updateSectionItem(sectionKey, index, (currentItem) => ({
                                    ...currentItem,
                                    title: event.target.value,
                                  }))
                                }
                                disabled={!supabaseReady}
                              />
                            </Field>
                            <Field label="Judul (Indonesia)">
                              <input
                                type="text"
                                value={item.titleId ?? ""}
                                onChange={(event) =>
                                  updateSectionItem(sectionKey, index, (currentItem) => ({
                                    ...currentItem,
                                    titleId: event.target.value,
                                  }))
                                }
                                disabled={!supabaseReady}
                              />
                            </Field>
                          </div>
                          <div className="admin-grid-2">
                            <Field label="Teks tombol (English)">
                              <input
                                type="text"
                                value={item.buttonLabel ?? ""}
                                onChange={(event) =>
                                  updateSectionItem(sectionKey, index, (currentItem) => ({
                                    ...currentItem,
                                    buttonLabel: event.target.value,
                                  }))
                                }
                                disabled={!supabaseReady}
                              />
                            </Field>
                            <Field label="Teks tombol (Indonesia)">
                              <input
                                type="text"
                                value={item.buttonLabelId ?? ""}
                                onChange={(event) =>
                                  updateSectionItem(sectionKey, index, (currentItem) => ({
                                    ...currentItem,
                                    buttonLabelId: event.target.value,
                                  }))
                                }
                                disabled={!supabaseReady}
                              />
                            </Field>
                          </div>
                          <Field label="Deskripsi (English)">
                            <textarea
                              rows={4}
                              value={item.description ?? ""}
                              onChange={(event) =>
                                updateSectionItem(sectionKey, index, (currentItem) => ({
                                  ...currentItem,
                                  description: event.target.value,
                                }))
                              }
                              disabled={!supabaseReady}
                            />
                          </Field>
                          <Field label="Deskripsi (Indonesia)">
                            <textarea
                              rows={4}
                              value={item.descriptionId ?? ""}
                              onChange={(event) =>
                                updateSectionItem(sectionKey, index, (currentItem) => ({
                                  ...currentItem,
                                  descriptionId: event.target.value,
                                }))
                              }
                              disabled={!supabaseReady}
                            />
                          </Field>
                          <Field label="Tautan website">
                            <input
                              type="url"
                              value={item.href ?? ""}
                              onChange={(event) =>
                                updateSectionItem(sectionKey, index, (currentItem) => ({
                                  ...currentItem,
                                  href: event.target.value,
                                }))
                              }
                              placeholder="https://..."
                              disabled={!supabaseReady}
                            />
                          </Field>
                          <div className="admin-grid-2">
                            <Field label="Gambar laptop">
                              <input
                                type="text"
                                value={image.src ?? ""}
                                onChange={(event) =>
                                  updateSectionItem(sectionKey, index, (currentItem) => ({
                                    ...currentItem,
                                    image: {
                                      ...(currentItem.image ?? {}),
                                      src: event.target.value,
                                    },
                                  }))
                                }
                                disabled={!supabaseReady}
                              />
                            </Field>
                            <Field label="Deskripsi gambar">
                              <input
                                type="text"
                                value={image.alt ?? ""}
                                onChange={(event) =>
                                  updateSectionItem(sectionKey, index, (currentItem) => ({
                                    ...currentItem,
                                    image: {
                                      ...(currentItem.image ?? {}),
                                      alt: event.target.value,
                                    },
                                  }))
                                }
                                disabled={!supabaseReady}
                              />
                            </Field>
                          </div>
                        </article>
                      );
                    }

                    if (sectionKey === "projects") {
                      const image = item.image ?? {};
                      const focus = {
                        x: Number.isFinite(image.focus?.x) ? image.focus.x : 50,
                        y: Number.isFinite(image.focus?.y) ? image.focus.y : 50,
                      };
                      return (
                        <article className="admin-item-card" key={item.id ?? index}>
                          <ItemToolbar
                            disabled={!supabaseReady}
                            sectionLabel="proyek"
                            isActive={item.isActive !== false}
                            onStatusChange={(value) =>
                              updateSectionItem(sectionKey, index, (currentItem) => ({
                                ...currentItem,
                                isActive: value,
                              }))
                            }
                            onRemove={() => removeItem(sectionKey, index)}
                          />
                          <Field label="Judul">
                            <input
                              type="text"
                              value={item.title ?? ""}
                              onChange={(event) =>
                                updateSectionItem(sectionKey, index, (currentItem) => ({
                                  ...currentItem,
                                  title: event.target.value,
                                }))
                              }
                              disabled={!supabaseReady}
                            />
                          </Field>
                          <Field
                            label="Tautan website"
                            help="Opsional. Tombol website tampil di sisi belakang kartu jika diisi."
                          >
                            <input
                              type="url"
                              value={item.href ?? ""}
                              onChange={(event) =>
                                updateSectionItem(sectionKey, index, (currentItem) => ({
                                  ...currentItem,
                                  href: event.target.value,
                                }))
                              }
                              placeholder="https://..."
                              disabled={!supabaseReady}
                            />
                          </Field>
                          <ImageField
                            label="Gambar proyek"
                            help="Unggah gambar utama proyek dari perangkat."
                            value={image.src ?? ""}
                            altValue={image.alt ?? ""}
                            onChange={(nextValue) =>
                              updateSectionItem(sectionKey, index, (currentItem) => ({
                                ...currentItem,
                                image: {
                                  ...(currentItem.image ?? {}),
                                  src: nextValue,
                                },
                              }))
                            }
                            onClear={() =>
                              updateSectionItem(sectionKey, index, (currentItem) => ({
                                ...currentItem,
                                image: {
                                  ...(currentItem.image ?? {}),
                                  src: "",
                                  cardSrc: "",
                                  detailSrc: "",
                                },
                              }))
                            }
                            onAltChange={(nextValue) =>
                              updateSectionItem(sectionKey, index, (currentItem) => ({
                                ...currentItem,
                                image: {
                                  ...(currentItem.image ?? {}),
                                  alt: nextValue,
                                },
                              }))
                            }
                            onUpload={(event) =>
                              uploadImage({
                                file: event.target.files?.[0],
                                sectionKey,
                                itemIndex: index,
                                target: "image",
                                prefix: "cover",
                              }).finally(() => {
                                event.target.value = "";
                              })
                            }
                            focusValue={focus}
                            onFocusChange={(nextFocus) =>
                              updateSectionItem(sectionKey, index, (currentItem) => ({
                                ...currentItem,
                                image: {
                                  ...(currentItem.image ?? {}),
                                  focus: nextFocus,
                                },
                              }))
                            }
                            cropOptions={[
                              {
                                label: "Crop untuk card (16:10)",
                                variant: "card",
                                aspect: 16 / 10,
                                target: "image-card",
                                prefix: "card",
                              },
                            ]}
                            cropPreviews={[
                              {
                                label: "Hasil crop card",
                                value: image.cardSrc ?? "",
                                statusText: uploadStatus[`${sectionKey}-${index}-image-card`],
                                onClear: () =>
                                  updateSectionItem(sectionKey, index, (currentItem) => ({
                                    ...currentItem,
                                    image: {
                                      ...(currentItem.image ?? {}),
                                      cardSrc: "",
                                    },
                                  })),
                              },
                            ]}
                            onCropRequest={(option) =>
                              openCropper({
                                ...option,
                                sectionKey,
                                itemIndex: index,
                                imageSrc: image.src,
                              })
                            }
                            disabled={!supabaseReady}
                            previewLabel="Pratinjau gambar proyek"
                            statusText={uploadStatus[imageStatusKey]}
                          />
                          <Field
                            label="Ringkasan proyek"
                            help="Tuliskan deskripsi singkat yang akan tampil di kartu project."
                          >
                            <textarea
                              rows={5}
                              value={item.summary ?? ""}
                              onChange={(event) =>
                                updateSectionItem(sectionKey, index, (currentItem) => ({
                                  ...currentItem,
                                  summary: event.target.value,
                                }))
                              }
                              disabled={!supabaseReady}
                            />
                          </Field>
                        </article>
                      );
                    }

                    if (sectionKey === "editing") {
                      const image = item.image ?? {};
                      const focus = {
                        x: Number.isFinite(image.focus?.x) ? image.focus.x : 50,
                        y: Number.isFinite(image.focus?.y) ? image.focus.y : 50,
                      };

                      return (
                        <article className="admin-item-card" key={item.id ?? index}>
                          <ItemToolbar
                            disabled={!supabaseReady}
                            sectionLabel="editing"
                            isActive={item.isActive !== false}
                            onStatusChange={(value) =>
                              updateSectionItem(sectionKey, index, (currentItem) => ({
                                ...currentItem,
                                isActive: value,
                              }))
                            }
                            onRemove={() => removeItem(sectionKey, index)}
                          />

                          <div className="admin-grid-2">
                            <Field
                              label="Tipe tampilan"
                              help="Mockup iPhone tampil pada dua pratinjau kiri. Galeri tampil di kontainer kanan."
                            >
                              <select
                                value={item.type ?? "gallery"}
                                onChange={(event) =>
                                  updateSectionItem(sectionKey, index, (currentItem) => ({
                                    ...currentItem,
                                    type: event.target.value,
                                  }))
                                }
                                disabled={!supabaseReady}
                              >
                                <option value="phone">Mockup iPhone</option>
                                <option value="gallery">Galeri scroll</option>
                              </select>
                            </Field>
                            <Field
                              label="Tautan Instagram"
                              help="Untuk item Phone, tautan ini dipakai oleh tombol Instagram di bawah mockup."
                            >
                              <input
                                type="url"
                                value={item.href ?? ""}
                                onChange={(event) =>
                                  updateSectionItem(sectionKey, index, (currentItem) => ({
                                    ...currentItem,
                                    href: event.target.value,
                                  }))
                                }
                                placeholder="https://..."
                                disabled={!supabaseReady}
                              />
                            </Field>
                            <Field
                              label="Nama Instagram"
                              help="Teks tombol di bawah mockup iPhone, contoh: @nailaazahrra."
                            >
                              <input
                                type="text"
                                value={item.instagramName ?? ""}
                                onChange={(event) =>
                                  updateSectionItem(sectionKey, index, (currentItem) => ({
                                    ...currentItem,
                                    instagramName: event.target.value,
                                  }))
                                }
                                placeholder="@username"
                                disabled={!supabaseReady}
                              />
                            </Field>
                          </div>

                          <Field label="Judul">
                            <input
                              type="text"
                              value={item.title ?? ""}
                              onChange={(event) =>
                                updateSectionItem(sectionKey, index, (currentItem) => ({
                                  ...currentItem,
                                  title: event.target.value,
                                }))
                              }
                              disabled={!supabaseReady}
                            />
                          </Field>

                          <Field label="Deskripsi">
                            <textarea
                              rows={3}
                              value={item.description ?? ""}
                              onChange={(event) =>
                                updateSectionItem(sectionKey, index, (currentItem) => ({
                                  ...currentItem,
                                  description: event.target.value,
                                }))
                              }
                              disabled={!supabaseReady}
                            />
                          </Field>

                          <ImageField
                            label="Gambar editing"
                            help="Unggah gambar untuk mockup iPhone atau galeri scroll."
                            value={image.src ?? ""}
                            altValue={image.alt ?? ""}
                            onChange={(nextValue) =>
                              updateSectionItem(sectionKey, index, (currentItem) => ({
                                ...currentItem,
                                image: {
                                  ...(currentItem.image ?? {}),
                                  src: nextValue,
                                },
                              }))
                            }
                            onClear={() =>
                              updateSectionItem(sectionKey, index, (currentItem) => ({
                                ...currentItem,
                                image: {
                                  ...(currentItem.image ?? {}),
                                  src: "",
                                  cardSrc: "",
                                  detailSrc: "",
                                },
                              }))
                            }
                            onAltChange={(nextValue) =>
                              updateSectionItem(sectionKey, index, (currentItem) => ({
                                ...currentItem,
                                image: {
                                  ...(currentItem.image ?? {}),
                                  alt: nextValue,
                                },
                              }))
                            }
                            onUpload={(event) =>
                              uploadImage({
                                file: event.target.files?.[0],
                                sectionKey,
                                itemIndex: index,
                                target: "image",
                                prefix: item.type === "phone" ? "phone" : "gallery",
                              }).finally(() => {
                                event.target.value = "";
                              })
                            }
                            focusValue={focus}
                            onFocusChange={(nextFocus) =>
                              updateSectionItem(sectionKey, index, (currentItem) => ({
                                ...currentItem,
                                image: {
                                  ...(currentItem.image ?? {}),
                                  focus: nextFocus,
                                },
                              }))
                            }
                            disabled={!supabaseReady}
                            previewLabel="Pratinjau gambar editing"
                            previewClassName={item.type === "phone" ? "is-phone" : "is-golden"}
                            statusText={uploadStatus[imageStatusKey]}
                          />
                        </article>
                      );
                    }

                    if (sectionKey === "news") {
                      const image = item.image ?? {};
                      const focus = {
                        x: Number.isFinite(image.focus?.x) ? image.focus.x : 50,
                        y: Number.isFinite(image.focus?.y) ? image.focus.y : 50,
                      };
                      return (
                        <article className="admin-item-card" key={item.id ?? index}>
                          <ItemToolbar
                            disabled={!supabaseReady}
                            sectionLabel="liputan"
                            isActive={item.isActive !== false}
                            onStatusChange={(value) =>
                              updateSectionItem(sectionKey, index, (currentItem) => ({
                                ...currentItem,
                                isActive: value,
                              }))
                            }
                            onRemove={() => removeItem(sectionKey, index)}
                          />
                          <div className="admin-grid-2">
                            <Field label="Sumber">
                              <input
                                type="text"
                                value={item.source ?? ""}
                                onChange={(event) =>
                                  updateSectionItem(sectionKey, index, (currentItem) => ({
                                    ...currentItem,
                                    source: event.target.value,
                                  }))
                                }
                                disabled={!supabaseReady}
                              />
                            </Field>
                            <Field label="Tautan artikel">
                              <input
                                type="url"
                                value={item.href ?? ""}
                                onChange={(event) =>
                                  updateSectionItem(sectionKey, index, (currentItem) => ({
                                    ...currentItem,
                                    href: event.target.value,
                                  }))
                                }
                                disabled={!supabaseReady}
                              />
                            </Field>
                          </div>
                          <Field label="Judul">
                            <textarea
                              rows={3}
                              value={item.title ?? ""}
                              onChange={(event) =>
                                updateSectionItem(sectionKey, index, (currentItem) => ({
                                  ...currentItem,
                                  title: event.target.value,
                                }))
                              }
                              disabled={!supabaseReady}
                            />
                          </Field>
                          <Field label="Ringkasan">
                            <textarea
                              rows={3}
                              value={item.summary ?? ""}
                              onChange={(event) =>
                                updateSectionItem(sectionKey, index, (currentItem) => ({
                                  ...currentItem,
                                  summary: event.target.value,
                                }))
                              }
                              disabled={!supabaseReady}
                            />
                          </Field>
                          <ImageField
                            label="Gambar liputan"
                            help="Unggah gambar sampul liputan dari perangkat."
                            value={image.src ?? ""}
                            altValue={image.alt ?? ""}
                            onChange={(nextValue) =>
                              updateSectionItem(sectionKey, index, (currentItem) => ({
                                ...currentItem,
                                image: {
                                  ...(currentItem.image ?? {}),
                                  src: nextValue,
                                },
                              }))
                            }
                            onClear={() =>
                              updateSectionItem(sectionKey, index, (currentItem) => ({
                                ...currentItem,
                                image: {
                                  ...(currentItem.image ?? {}),
                                  src: "",
                                  cardSrc: "",
                                  detailSrc: "",
                                },
                              }))
                            }
                            onAltChange={(nextValue) =>
                              updateSectionItem(sectionKey, index, (currentItem) => ({
                                ...currentItem,
                                image: {
                                  ...(currentItem.image ?? {}),
                                  alt: nextValue,
                                },
                              }))
                            }
                            onUpload={(event) =>
                              uploadImage({
                                file: event.target.files?.[0],
                                sectionKey,
                                itemIndex: index,
                                target: "image",
                                prefix: "cover",
                              }).finally(() => {
                                event.target.value = "";
                              })
                            }
                            focusValue={focus}
                            onFocusChange={(nextFocus) =>
                              updateSectionItem(sectionKey, index, (currentItem) => ({
                                ...currentItem,
                                image: {
                                  ...(currentItem.image ?? {}),
                                  focus: nextFocus,
                                },
                              }))
                            }
                            cropOptions={[
                              {
                                label: "Crop untuk card (1:1)",
                                variant: "card",
                                aspect: 1,
                                target: "image-card",
                                prefix: "card",
                              },
                            ]}
                            cropPreviews={[
                              {
                                label: "Hasil crop card",
                                value: image.cardSrc ?? "",
                                statusText: uploadStatus[`${sectionKey}-${index}-image-card`],
                                onClear: () =>
                                  updateSectionItem(sectionKey, index, (currentItem) => ({
                                    ...currentItem,
                                    image: {
                                      ...(currentItem.image ?? {}),
                                      cardSrc: "",
                                    },
                                  })),
                              },
                            ]}
                            onCropRequest={(option) =>
                              openCropper({
                                ...option,
                                sectionKey,
                                itemIndex: index,
                                imageSrc: image.src,
                              })
                            }
                            disabled={!supabaseReady}
                            previewLabel="Pratinjau gambar liputan"
                            previewClassName="is-square"
                            statusText={uploadStatus[imageStatusKey]}
                          />
                        </article>
                      );
                    }

                    const image = item.image ?? {};
                    const focus = {
                      x: Number.isFinite(image.focus?.x) ? image.focus.x : 50,
                      y: Number.isFinite(image.focus?.y) ? image.focus.y : 50,
                    };
                    const documentation = Array.isArray(item.documentation) ? item.documentation : [];
                    const certificates = Array.isArray(item.certificate)
                      ? item.certificate
                      : item.certificate
                        ? [item.certificate]
                        : [];

                    return (
                      <article className="admin-item-card" key={item.id ?? index}>
                        <ItemToolbar
                          disabled={!supabaseReady}
                          sectionLabel="pencapaian"
                          isActive={item.isActive !== false}
                          onStatusChange={(value) =>
                            updateSectionItem(sectionKey, index, (currentItem) => ({
                              ...currentItem,
                              isActive: value,
                            }))
                          }
                          onRemove={() => removeItem(sectionKey, index)}
                        />
                        <Field label="Slug">
                          <input
                            type="text"
                            value={item.slug ?? ""}
                            onChange={(event) =>
                              updateSectionItem(sectionKey, index, (currentItem) => ({
                                ...currentItem,
                                slug: event.target.value,
                              }))
                            }
                            disabled={!supabaseReady}
                          />
                        </Field>
                        <Field label="Judul">
                          <input
                            type="text"
                            value={item.title ?? ""}
                            onChange={(event) =>
                              updateSectionItem(sectionKey, index, (currentItem) => ({
                                ...currentItem,
                                title: event.target.value,
                              }))
                            }
                            disabled={!supabaseReady}
                          />
                        </Field>
                        <Field label="Ringkasan">
                          <textarea
                            rows={3}
                            value={item.summary ?? ""}
                            onChange={(event) =>
                              updateSectionItem(sectionKey, index, (currentItem) => ({
                                ...currentItem,
                                summary: event.target.value,
                              }))
                            }
                            disabled={!supabaseReady}
                          />
                        </Field>
                        <Field label="Deskripsi utama">
                          <textarea
                            rows={4}
                            value={item.lead ?? ""}
                            onChange={(event) =>
                              updateSectionItem(sectionKey, index, (currentItem) => ({
                                ...currentItem,
                                lead: event.target.value,
                              }))
                            }
                            disabled={!supabaseReady}
                          />
                        </Field>
                        <Field label="Label singkat" help="Tambahkan satu per satu.">
                          <textarea
                            rows={3}
                            value={arrayToLines(item.meta)}
                            onChange={(event) =>
                              updateSectionItem(sectionKey, index, (currentItem) => ({
                                ...currentItem,
                                meta: linesToArray(event.target.value),
                              }))
                            }
                            disabled={!supabaseReady}
                          />
                          <ListQuickAdd
                            value={item.meta}
                            onChange={(nextValue) =>
                              updateSectionItem(sectionKey, index, (currentItem) => ({
                                ...currentItem,
                                meta: nextValue,
                              }))
                            }
                            placeholder="Tambah tag..."
                            disabled={!supabaseReady}
                          />
                        </Field>
                        <Field label="Deskripsi dokumentasi">
                          <textarea
                            rows={4}
                            value={item.documentationBody ?? ""}
                            onChange={(event) =>
                              updateSectionItem(sectionKey, index, (currentItem) => ({
                                ...currentItem,
                                documentationBody: event.target.value,
                              }))
                            }
                            disabled={!supabaseReady}
                          />
                        </Field>
                        <Field label="Deskripsi sertifikat">
                          <textarea
                            rows={4}
                            value={item.certificateBody ?? ""}
                            onChange={(event) =>
                              updateSectionItem(sectionKey, index, (currentItem) => ({
                                ...currentItem,
                                certificateBody: event.target.value,
                              }))
                            }
                            disabled={!supabaseReady}
                          />
                        </Field>

                        <ImageField
                          label="Gambar utama"
                          help="Unggah gambar utama pencapaian."
                          value={image.src ?? ""}
                          altValue={image.alt ?? ""}
                          onChange={(nextValue) =>
                            updateSectionItem(sectionKey, index, (currentItem) => ({
                              ...currentItem,
                              image: {
                                ...(currentItem.image ?? {}),
                                src: nextValue,
                              },
                            }))
                          }
                          onClear={() =>
                            updateSectionItem(sectionKey, index, (currentItem) => ({
                              ...currentItem,
                              image: {
                                ...(currentItem.image ?? {}),
                                src: "",
                                cardSrc: "",
                                detailSrc: "",
                              },
                            }))
                          }
                          onAltChange={(nextValue) =>
                            updateSectionItem(sectionKey, index, (currentItem) => ({
                              ...currentItem,
                              image: {
                                ...(currentItem.image ?? {}),
                                alt: nextValue,
                              },
                            }))
                          }
                          onUpload={(event) =>
                            uploadImage({
                              file: event.target.files?.[0],
                              sectionKey,
                              itemIndex: index,
                              target: "image",
                              prefix: "hero",
                            }).finally(() => {
                              event.target.value = "";
                            })
                          }
                          focusValue={focus}
                          onFocusChange={(nextFocus) =>
                            updateSectionItem(sectionKey, index, (currentItem) => ({
                              ...currentItem,
                              image: {
                                ...(currentItem.image ?? {}),
                                focus: nextFocus,
                              },
                            }))
                          }
                          cropOptions={[
                            {
                              label: "Crop untuk card (16:9)",
                              variant: "card",
                              aspect: 16 / 9,
                              target: "image-card",
                              prefix: "card",
                            },
                            {
                              label: "Crop untuk detail (4:3)",
                              variant: "detail",
                              aspect: 4 / 3,
                              target: "image-detail",
                              prefix: "detail",
                            },
                          ]}
                          cropPreviews={[
                            {
                              label: "Hasil crop card",
                              value: image.cardSrc ?? "",
                              statusText: uploadStatus[`${sectionKey}-${index}-image-card`],
                              onClear: () =>
                                updateSectionItem(sectionKey, index, (currentItem) => ({
                                  ...currentItem,
                                  image: {
                                    ...(currentItem.image ?? {}),
                                    cardSrc: "",
                                  },
                                })),
                            },
                            {
                              label: "Hasil crop detail",
                              value: image.detailSrc ?? "",
                              statusText: uploadStatus[`${sectionKey}-${index}-image-detail`],
                              onClear: () =>
                                updateSectionItem(sectionKey, index, (currentItem) => ({
                                  ...currentItem,
                                  image: {
                                    ...(currentItem.image ?? {}),
                                    detailSrc: "",
                                  },
                                })),
                            },
                          ]}
                          onCropRequest={(option) =>
                            openCropper({
                              ...option,
                              sectionKey,
                              itemIndex: index,
                              imageSrc: image.src,
                            })
                          }
                          disabled={!supabaseReady}
                          previewLabel="Achievement hero preview"
                          statusText={uploadStatus[imageStatusKey]}
                        />

                        <div className="admin-documentation-block">
                          <div className="admin-subheading-row">
                            <div>
                              <h3>Galeri dokumentasi</h3>
                              <p className="form-note">Tambahkan dan atur foto dokumentasi.</p>
                            </div>
                            <button
                              className="button button-secondary"
                              type="button"
                              onClick={() =>
                                updateSectionItem(sectionKey, index, (currentItem) => ({
                                  ...currentItem,
                                  documentation: [
                                    ...(currentItem.documentation ?? []),
                                    { src: "", alt: "" },
                                  ],
                                }))
                              }
                            >
                              Tambah foto dokumentasi
                            </button>
                          </div>

                          <div className="admin-documentation-grid">
                            {documentation.map((doc, docIndex) => (
                              <article className="admin-documentation-item" key={`${item.id ?? index}-${docIndex}`}>
                                <div className="admin-documentation-head">
                                  <strong>Foto {docIndex + 1}</strong>
                                  <button
                                    className="button button-secondary admin-remove-button"
                                    type="button"
                                    onClick={() =>
                                      updateSectionItem(sectionKey, index, (currentItem) => ({
                                        ...currentItem,
                                        documentation: currentItem.documentation.filter(
                                          (_, currentDocIndex) => currentDocIndex !== docIndex
                                        ),
                                      }))
                                    }
                                  >
                                    Hapus
                                  </button>
                                </div>
                                <div className="admin-doc-preview">
                                  {isUrlValue(doc?.src) ? (
                                    <img src={doc.src} alt={doc.alt || "Documentation"} />
                                  ) : (
                                    <span>Belum ada gambar</span>
                                  )}
                                </div>
                                <Field label="Tautan gambar">
                                  <input
                                    value={doc?.src ?? ""}
                                    readOnly
                                    aria-readonly="true"
                                    disabled={!supabaseReady}
                                  />
                                </Field>
                                <Field label="Deskripsi gambar">
                                  <input
                                    type="text"
                                    value={doc?.alt ?? ""}
                                    onChange={(event) =>
                                      updateSectionItem(sectionKey, index, (currentItem) => ({
                                        ...currentItem,
                                        documentation: currentItem.documentation.map((currentDoc, currentDocIndex) =>
                                          currentDocIndex === docIndex
                                            ? { ...(currentDoc ?? {}), alt: event.target.value }
                                            : currentDoc
                                        ),
                                      }))
                                    }
                                    disabled={!supabaseReady}
                                  />
                                </Field>
                                <Field label="Keterangan">
                                  <input
                                    type="text"
                                    value={doc?.caption ?? ""}
                                    onChange={(event) =>
                                      updateSectionItem(sectionKey, index, (currentItem) => ({
                                        ...currentItem,
                                        documentation: currentItem.documentation.map((currentDoc, currentDocIndex) =>
                                          currentDocIndex === docIndex
                                            ? { ...(currentDoc ?? {}), caption: event.target.value }
                                            : currentDoc
                                        ),
                                      }))
                                    }
                                    disabled={!supabaseReady}
                                  />
                                </Field>
                                <div className="admin-upload-row">
                                  <label className="button button-secondary admin-upload-button">
                                    <input
                                      type="file"
                                      accept="image/*"
                                      onChange={(event) =>
                                        uploadImage({
                                          file: event.target.files?.[0],
                                          sectionKey,
                                          itemIndex: index,
                                          target: docIndex,
                                          prefix: `documentation-${docIndex + 1}`,
                                        }).finally(() => {
                                          event.target.value = "";
                                        })
                                      }
                                      disabled={!supabaseReady}
                                    />
                                    Unggah foto dokumentasi
                                  </label>
                                </div>
                                <UploadStatus text={uploadStatus[`${sectionKey}-${index}-${docIndex}`]} />
                              </article>
                            ))}
                          </div>
                        </div>

                        <div className="admin-documentation-block">
                          <div className="admin-subheading-row">
                            <div>
                              <h3>Galeri sertifikat</h3>
                              <p className="form-note">Tambahkan gambar sertifikat yang ingin ditampilkan.</p>
                            </div>
                            <button
                              className="button button-secondary"
                              type="button"
                              onClick={() =>
                                updateSectionItem(sectionKey, index, (currentItem) => ({
                                  ...currentItem,
                                  certificate: [
                                    ...(Array.isArray(currentItem.certificate)
                                      ? currentItem.certificate
                                      : currentItem.certificate
                                        ? [currentItem.certificate]
                                        : []),
                                    { src: "", alt: "", caption: "" },
                                  ],
                                }))
                              }
                            >
                              Tambah sertifikat
                            </button>
                          </div>

                          <div className="admin-documentation-grid">
                            {certificates.map((certificateItem, certificateIndex) => (
                              <article
                                className="admin-documentation-item"
                                key={`${item.id ?? index}-certificate-${certificateIndex}`}
                              >
                                <div className="admin-documentation-head">
                                  <strong>Sertifikat {certificateIndex + 1}</strong>
                                  <button
                                    className="button button-secondary admin-remove-button"
                                    type="button"
                                    onClick={() =>
                                      updateSectionItem(sectionKey, index, (currentItem) => ({
                                        ...currentItem,
                                        certificate: (Array.isArray(currentItem.certificate)
                                          ? currentItem.certificate
                                          : currentItem.certificate
                                            ? [currentItem.certificate]
                                            : []
                                        ).filter((_, currentIndex) => currentIndex !== certificateIndex),
                                      }))
                                    }
                                  >
                                    Hapus
                                  </button>
                                </div>
                                <div className="admin-doc-preview">
                                  {isUrlValue(certificateItem?.src) ? (
                                    <img src={certificateItem.src} alt={certificateItem.alt || "Certificate"} />
                                  ) : (
                                    <span>Belum ada gambar</span>
                                  )}
                                </div>
                                <Field label="Tautan gambar">
                                  <input
                                    value={certificateItem?.src ?? ""}
                                    readOnly
                                    aria-readonly="true"
                                    disabled={!supabaseReady}
                                  />
                                </Field>
                                <Field label="Deskripsi gambar">
                                  <input
                                    type="text"
                                    value={certificateItem?.alt ?? ""}
                                    onChange={(event) =>
                                      updateSectionItem(sectionKey, index, (currentItem) => ({
                                        ...currentItem,
                                        certificate: (Array.isArray(currentItem.certificate)
                                          ? currentItem.certificate
                                          : currentItem.certificate
                                            ? [currentItem.certificate]
                                            : []
                                        ).map((currentCert, currentIndex) =>
                                          currentIndex === certificateIndex
                                            ? { ...(currentCert ?? {}), alt: event.target.value }
                                            : currentCert
                                        ),
                                      }))
                                    }
                                    disabled={!supabaseReady}
                                  />
                                </Field>
                                <Field label="Keterangan">
                                  <input
                                    type="text"
                                    value={certificateItem?.caption ?? ""}
                                    onChange={(event) =>
                                      updateSectionItem(sectionKey, index, (currentItem) => ({
                                        ...currentItem,
                                        certificate: (Array.isArray(currentItem.certificate)
                                          ? currentItem.certificate
                                          : currentItem.certificate
                                            ? [currentItem.certificate]
                                            : []
                                        ).map((currentCert, currentIndex) =>
                                          currentIndex === certificateIndex
                                            ? { ...(currentCert ?? {}), caption: event.target.value }
                                            : currentCert
                                        ),
                                      }))
                                    }
                                    disabled={!supabaseReady}
                                  />
                                </Field>
                                <div className="admin-upload-row">
                                  <label className="button button-secondary admin-upload-button">
                                    <input
                                      type="file"
                                      accept="image/*"
                                      onChange={(event) =>
                                        uploadImage({
                                          file: event.target.files?.[0],
                                          sectionKey,
                                          itemIndex: index,
                                          target: `certificate-${certificateIndex}`,
                                          prefix: `certificate-${certificateIndex + 1}`,
                                        }).finally(() => {
                                          event.target.value = "";
                                        })
                                      }
                                      disabled={!supabaseReady}
                                    />
                                    Unggah sertifikat
                                  </label>
                                </div>
                                <UploadStatus
                                  text={uploadStatus[`${sectionKey}-${index}-certificate-${certificateIndex}`]}
                                />
                              </article>
                            ))}
                          </div>
                        </div>
                      </article>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="admin-empty-state">
                      <p>{sectionConfig[sectionKey].emptyLabel}</p>
                      <button
                        className="button button-secondary"
                        type="button"
                        onClick={() => addItem(sectionKey)}
                      >
                        Buat item pertama
                      </button>
                    </div>
                  )}
                </section>
              ))}
            </section>

              <div className="admin-savebar">
                <div>
                  <strong>{canPublish ? "Siap disimpan" : "Penyimpanan belum tersedia"}</strong>
                  <p className="form-note">
                    {canPublish
                      ? "Simpan untuk memperbarui konten yang tampil di halaman publik."
                      : "Hubungi pengelola situs untuk mengaktifkan penyimpanan."}
                  </p>
                </div>
                <div className="admin-save-actions">
                  <SubmitButton disabled={!canPublish} />
                </div>
              </div>
          </div>
        </div>

        <footer className="admin-footer" role="contentinfo">
          <span className="admin-footer-heart">
            <span>made with</span>
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12 21s-7-4.35-7-10a4 4 0 0 1 7-2.65A4 4 0 0 1 19 11c0 5.65-7 10-7 10Z" />
            </svg>
          </span>
          <span className="admin-footer-dot" aria-hidden="true"></span>
          <span className="admin-footer-powered">Powered by Riswan Cakep</span>
        </footer>
      </div>

      {deleteTarget ? (
        <div className="admin-modal" role="dialog" aria-modal="true">
          <div className="admin-modal-content">
            <h3>Hapus item?</h3>
            <p>Item "{deleteTarget.title}" akan dihapus dari daftar {sectionConfig[activeSection].title}.</p>
            <div className="admin-modal-actions">
              <button
                className="button button-secondary"
                type="button"
                onClick={() => setDeleteTarget(null)}
              >
                Batal
              </button>
              <button
                className="button button-primary"
                type="button"
                onClick={() => {
                  removeItem(activeSection, deleteTarget.index);
                  setDeleteTarget(null);
                }}
              >
                Hapus
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {toastMessage ? (
        <div className={`admin-toast ${toastStatus === "success" ? "is-success" : "is-error"}`}>
          {toastMessage}
        </div>
      ) : null}

      {cropConfig ? (
        <CropModal
          imageSrc={cropConfig.imageSrc}
          aspect={cropConfig.aspect}
          title={cropConfig.label}
          subtitle="Geser dan zoom sampai pas, lalu simpan hasil crop."
          onSave={handleCropSave}
          onCancel={() => setCropConfig(null)}
        />
      ) : null}
    </form>
  );
}
