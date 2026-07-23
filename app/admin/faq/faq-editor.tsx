"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Plus, Trash2, ChevronUp, ChevronDown, Eye, EyeOff, Save, X } from "lucide-react";
import { createFAQ, updateFAQ, deleteFAQ } from "@/lib/faqs";
import type { FAQ } from "@/lib/faqs";
import { ConfirmModal } from "@/components/ui/confirm-modal";

interface FAQEditorProps {
  initialFAQs: FAQ[];
}

const EMPTY_FORM = { question: "", answer: "", category: "", sort_order: 0, is_published: true };

export function FAQEditor({ initialFAQs }: FAQEditorProps) {
  const router = useRouter();
  const [faqs, setFaqs] = useState<FAQ[]>(initialFAQs);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Omit<FAQ, "id" | "created_at">>(EMPTY_FORM);
  const [showAddForm, setShowAddForm] = useState(false);
  const [addForm, setAddForm] = useState<Omit<FAQ, "id" | "created_at">>(EMPTY_FORM);
  const [saving, setSaving] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null);

  const notify = (msg: string, ok = true) => {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 3000);
  };

  /* ── Add new FAQ ── */
  const handleAdd = async () => {
    if (!addForm.question.trim() || !addForm.answer.trim()) {
      notify("Question and answer are required.", false);
      return;
    }
    setSaving("new");
    const nextOrder = faqs.length > 0 ? Math.max(...faqs.map((f) => f.sort_order)) + 1 : 1;
    const payload = { ...addForm, sort_order: nextOrder };
    const { error } = await createFAQ(payload);
    if (error) {
      notify(error, false);
    } else {
      notify("FAQ added.");
      setShowAddForm(false);
      setAddForm(EMPTY_FORM);
      router.refresh();
      // Optimistic: reload list
      const fake: FAQ = { ...payload, id: crypto.randomUUID(), created_at: new Date().toISOString() };
      setFaqs((prev) => [...prev, fake]);
    }
    setSaving(null);
  };

  /* ── Start editing ── */
  const startEdit = (faq: FAQ) => {
    setEditingId(faq.id);
    setEditForm({
      question: faq.question,
      answer: faq.answer,
      category: faq.category ?? "",
      sort_order: faq.sort_order,
      is_published: faq.is_published,
    });
  };

  /* ── Save edit ── */
  const handleSave = async (id: string) => {
    if (!editForm.question.trim() || !editForm.answer.trim()) {
      notify("Question and answer are required.", false);
      return;
    }
    setSaving(id);
    const { error } = await updateFAQ(id, editForm);
    if (error) {
      notify(error, false);
    } else {
      notify("FAQ updated.");
      setFaqs((prev) =>
        prev.map((f) => (f.id === id ? { ...f, ...editForm } : f))
      );
      setEditingId(null);
      router.refresh();
    }
    setSaving(null);
  };

  /* ── Toggle published ── */
  const togglePublish = async (faq: FAQ) => {
    setSaving(faq.id);
    const { error } = await updateFAQ(faq.id, { is_published: !faq.is_published });
    if (!error) {
      setFaqs((prev) =>
        prev.map((f) => (f.id === faq.id ? { ...f, is_published: !f.is_published } : f))
      );
      router.refresh();
    }
    setSaving(null);
  };

  /* ── Delete ── */
  const handleDelete = async (id: string) => {
    setDeleting(id);
    const { error } = await deleteFAQ(id);
    if (error) {
      notify(error, false);
    } else {
      notify("FAQ deleted.");
      setFaqs((prev) => prev.filter((f) => f.id !== id));
      router.refresh();
    }
    setDeleting(null);
  };

  /* ── Move order ── */
  const moveOrder = async (faq: FAQ, dir: "up" | "down") => {
    const sorted = [...faqs].sort((a, b) => a.sort_order - b.sort_order);
    const idx = sorted.findIndex((f) => f.id === faq.id);
    const swapIdx = dir === "up" ? idx - 1 : idx + 1;
    if (swapIdx < 0 || swapIdx >= sorted.length) return;

    const other = sorted[swapIdx];
    setSaving(faq.id);
    await Promise.all([
      updateFAQ(faq.id, { sort_order: other.sort_order }),
      updateFAQ(other.id, { sort_order: faq.sort_order }),
    ]);
    setFaqs((prev) =>
      prev.map((f) => {
        if (f.id === faq.id) return { ...f, sort_order: other.sort_order };
        if (f.id === other.id) return { ...f, sort_order: faq.sort_order };
        return f;
      })
    );
    setSaving(null);
    router.refresh();
  };

  const sorted = [...faqs].sort((a, b) => a.sort_order - b.sort_order);

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Toast */}
      {toast && (
        <div
          className={`px-5 py-3 rounded-xl text-sm font-semibold border ${
            toast.ok
              ? "bg-green-50 border-green-200 text-green-800"
              : "bg-red-50 border-red-200 text-red-800"
          }`}
        >
          {toast.msg}
        </div>
      )}

      {/* Add FAQ button / form */}
      {!showAddForm ? (
        <button
          onClick={() => { setShowAddForm(true); setAddForm({ ...EMPTY_FORM, sort_order: faqs.length + 1 }); }}
          className="flex items-center gap-2 bg-[#1A1A1A] hover:bg-[#6E1D25] text-white font-bold text-xs uppercase tracking-widest px-6 py-3 rounded-xl transition-colors shadow-sm"
        >
          <Plus className="h-4 w-4" />
          Add New FAQ
        </button>
      ) : (
        <div className="bg-white border-2 border-[#6E1D25]/30 rounded-2xl p-6 space-y-4 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-bold text-[#1A1A1A]" style={{ fontFamily: "'Playfair Display', serif" }}>
              New FAQ
            </h3>
            <button onClick={() => setShowAddForm(false)} className="text-[#7A7570] hover:text-[#1A1A1A]">
              <X className="h-4 w-4" />
            </button>
          </div>
          <FAQFormFields form={addForm} onChange={setAddForm} />
          <div className="flex gap-3 pt-2">
            <button
              onClick={handleAdd}
              disabled={saving === "new"}
              className="flex items-center gap-2 bg-[#1A1A1A] hover:bg-[#6E1D25] text-white font-bold text-xs uppercase tracking-widest px-6 py-3 rounded-xl transition-colors disabled:opacity-60"
            >
              {saving === "new" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
              Add FAQ
            </button>
            <button
              onClick={() => setShowAddForm(false)}
              className="px-5 py-3 border border-[#E6DFD5] text-[#7A7570] hover:text-[#1A1A1A] text-xs font-bold uppercase tracking-wider rounded-xl transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* FAQ list */}
      <div className="space-y-3">
        {sorted.map((faq, idx) => (
          <div
            key={faq.id}
            className={`bg-white border rounded-2xl overflow-hidden shadow-sm transition-all ${
              !faq.is_published ? "opacity-60 border-[#E6DFD5]" : "border-[#E6DFD5]"
            }`}
          >
            {editingId === faq.id ? (
              /* ── Edit mode ── */
              <div className="p-6 space-y-4">
                <FAQFormFields form={editForm} onChange={setEditForm} />
                <div className="flex gap-3 pt-2">
                  <button
                    onClick={() => handleSave(faq.id)}
                    disabled={saving === faq.id}
                    className="flex items-center gap-2 bg-[#1A1A1A] hover:bg-[#6E1D25] text-white font-bold text-xs uppercase tracking-widest px-6 py-3 rounded-xl transition-colors disabled:opacity-60"
                  >
                    {saving === faq.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                    Save
                  </button>
                  <button
                    onClick={() => setEditingId(null)}
                    className="px-5 py-3 border border-[#E6DFD5] text-[#7A7570] hover:text-[#1A1A1A] text-xs font-bold uppercase tracking-wider rounded-xl transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              /* ── View mode ── */
              <div className="p-5 flex items-start gap-4">
                {/* Order controls */}
                <div className="flex flex-col gap-0.5 shrink-0 mt-0.5">
                  <button
                    onClick={() => moveOrder(faq, "up")}
                    disabled={idx === 0 || saving === faq.id}
                    className="p-1 rounded text-[#7A7570] hover:text-[#1A1A1A] hover:bg-[#F7F3EC] disabled:opacity-30 transition-colors"
                    title="Move up"
                  >
                    <ChevronUp className="h-4 w-4" />
                  </button>
                  <span className="text-[10px] font-bold text-[#7A7570] text-center">{String(idx + 1).padStart(2, "0")}</span>
                  <button
                    onClick={() => moveOrder(faq, "down")}
                    disabled={idx === sorted.length - 1 || saving === faq.id}
                    className="p-1 rounded text-[#7A7570] hover:text-[#1A1A1A] hover:bg-[#F7F3EC] disabled:opacity-30 transition-colors"
                    title="Move down"
                  >
                    <ChevronDown className="h-4 w-4" />
                  </button>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-semibold text-sm text-[#1A1A1A] truncate" style={{ fontFamily: "'Inter', sans-serif" }}>
                      {faq.question}
                    </p>
                    {faq.category && (
                      <span className="text-[10px] font-bold uppercase tracking-wider bg-[#F7F3EC] border border-[#E6DFD5] text-[#7A7570] px-2 py-0.5 rounded-full shrink-0">
                        {faq.category}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-[#7A7570] line-clamp-2 leading-relaxed" style={{ fontFamily: "'Inter', sans-serif" }}>
                    {faq.answer}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => togglePublish(faq)}
                    disabled={saving === faq.id}
                    title={faq.is_published ? "Unpublish" : "Publish"}
                    className={`p-2 rounded-lg transition-colors ${
                      faq.is_published
                        ? "text-green-600 hover:bg-green-50"
                        : "text-[#7A7570] hover:bg-[#F7F3EC]"
                    }`}
                  >
                    {saving === faq.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : faq.is_published ? (
                      <Eye className="h-4 w-4" />
                    ) : (
                      <EyeOff className="h-4 w-4" />
                    )}
                  </button>
                  <button
                    onClick={() => startEdit(faq)}
                    className="p-2 rounded-lg text-[#7A7570] hover:text-[#1A1A1A] hover:bg-[#F7F3EC] transition-colors text-xs font-bold uppercase tracking-wider px-3"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => setConfirmDeleteId(faq.id)}
                    disabled={deleting === faq.id}
                    className="p-2 rounded-lg text-[#7A7570] hover:text-red-600 hover:bg-red-50 transition-colors"
                  >
                    {deleting === faq.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Trash2 className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}

        {sorted.length === 0 && (
          <div className="text-center py-12 text-[#7A7570] text-sm border border-dashed border-[#E6DFD5] rounded-2xl">
            No FAQs yet. Add your first one above.
          </div>
        )}
      </div>

      {/* Confirm delete modal */}
      <ConfirmModal
        open={confirmDeleteId !== null}
        title="Delete FAQ"
        message="Delete this FAQ? This cannot be undone."
        confirmLabel="Delete"
        variant="danger"
        onConfirm={() => {
          if (confirmDeleteId) handleDelete(confirmDeleteId);
          setConfirmDeleteId(null);
        }}
        onCancel={() => setConfirmDeleteId(null)}
      />
    </div>
  );
}

/* ── Shared form fields ── */
function FAQFormFields({
  form,
  onChange,
}: {
  form: Omit<FAQ, "id" | "created_at">;
  onChange: (f: Omit<FAQ, "id" | "created_at">) => void;
}) {
  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-bold text-[#7A7570] uppercase tracking-wider">Question *</label>
        <input
          type="text"
          value={form.question}
          onChange={(e) => onChange({ ...form, question: e.target.value })}
          placeholder="e.g. What is Laphing?"
          className="bg-[#FAFAF8] border border-[#E6DFD5] rounded-xl px-4 py-3 text-[#1A1A1A] text-sm focus:outline-none focus:border-[#6E1D25] transition-colors"
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-bold text-[#7A7570] uppercase tracking-wider">Answer *</label>
        <textarea
          rows={4}
          value={form.answer}
          onChange={(e) => onChange({ ...form, answer: e.target.value })}
          placeholder="Write the answer here..."
          className="bg-[#FAFAF8] border border-[#E6DFD5] rounded-xl px-4 py-3 text-[#1A1A1A] text-sm focus:outline-none focus:border-[#6E1D25] transition-colors resize-y"
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-[#7A7570] uppercase tracking-wider">Category (optional)</label>
          <input
            type="text"
            value={form.category ?? ""}
            onChange={(e) => onChange({ ...form, category: e.target.value })}
            placeholder="e.g. Delivery, Payment..."
            className="bg-[#FAFAF8] border border-[#E6DFD5] rounded-xl px-4 py-3 text-[#1A1A1A] text-sm focus:outline-none focus:border-[#6E1D25] transition-colors"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-[#7A7570] uppercase tracking-wider">Sort Order</label>
          <input
            type="number"
            min={1}
            value={form.sort_order}
            onChange={(e) => onChange({ ...form, sort_order: Number(e.target.value) })}
            className="bg-[#FAFAF8] border border-[#E6DFD5] rounded-xl px-4 py-3 text-[#1A1A1A] text-sm focus:outline-none focus:border-[#6E1D25] transition-colors"
          />
        </div>
      </div>
      <label className="flex items-center gap-2.5 cursor-pointer">
        <input
          type="checkbox"
          checked={form.is_published}
          onChange={(e) => onChange({ ...form, is_published: e.target.checked })}
          className="rounded border-[#E6DFD5] text-[#6E1D25] focus:ring-[#6E1D25]"
        />
        <span className="text-xs font-bold text-[#1A1A1A] uppercase tracking-wider">Published (visible on site)</span>
      </label>
    </div>
  );
}
