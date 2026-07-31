import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ApiError,
  cancelReservation,
  createReservation,
  listReservations,
  rescheduleReservation,
} from "../../lib/adminApi.js";

const STATUS_LABELS = {
  PENDING: "Beklemede",
  APPROVED: "Onaylandı",
  REJECTED: "Reddedildi",
  CANCELLED: "İptal Edildi",
};

const SOURCE_LABELS = {
  CLIENT_REQUEST: "Danışan Talebi",
  MANUAL: "Manuel",
};

const emptyForm = { slotStart: "", slotEnd: "", clientName: "", clientEmail: "", notes: "" };

function formatSlot(slotStart, slotEnd) {
  const start = new Date(slotStart);
  const end = new Date(slotEnd);
  const dateFmt = new Intl.DateTimeFormat("tr-TR", { dateStyle: "full", timeZone: "Europe/Istanbul" });
  const timeFmt = new Intl.DateTimeFormat("tr-TR", { timeStyle: "short", timeZone: "Europe/Istanbul" });
  return `${dateFmt.format(start)} · ${timeFmt.format(start)}–${timeFmt.format(end)}`;
}

export default function Reservations() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [form, setForm] = useState(emptyForm);
  const [creating, setCreating] = useState(false);
  const [reschedulingId, setReschedulingId] = useState(null);
  const [rescheduleForm, setRescheduleForm] = useState({ slotStart: "", slotEnd: "" });
  const [busyId, setBusyId] = useState(null);
  const navigate = useNavigate();

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await listReservations();
      data.sort((a, b) => new Date(a.slotStart) - new Date(b.slotStart));
      setBookings(data);
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        navigate("/admin/login", { replace: true });
        return;
      }
      setError("Rezervasyonlar yüklenirken bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    load();
  }, [load]);

  async function handleCreate(e) {
    e.preventDefault();
    setError("");
    setCreating(true);
    try {
      await createReservation({
        slotStart: new Date(form.slotStart).toISOString(),
        slotEnd: new Date(form.slotEnd).toISOString(),
        clientName: form.clientName || undefined,
        clientEmail: form.clientEmail || undefined,
        notes: form.notes || undefined,
      });
      setForm(emptyForm);
      await load();
    } catch (err) {
      if (err instanceof ApiError && err.status === 409) {
        setError("Bu zaman dilimi zaten dolu.");
      } else {
        setError("Rezervasyon oluşturulamadı.");
      }
    } finally {
      setCreating(false);
    }
  }

  async function handleCancel(id) {
    if (!window.confirm("Bu rezervasyonu iptal etmek istediğinize emin misiniz?")) return;
    setBusyId(id);
    setError("");
    try {
      await cancelReservation(id);
      await load();
    } catch {
      setError("İptal işlemi başarısız oldu.");
    } finally {
      setBusyId(null);
    }
  }

  function startReschedule(b) {
    setReschedulingId(b.id);
    setRescheduleForm({
      slotStart: toLocalInputValue(b.slotStart),
      slotEnd: toLocalInputValue(b.slotEnd),
    });
  }

  async function handleReschedule(id) {
    setBusyId(id);
    setError("");
    try {
      await rescheduleReservation(id, {
        slotStart: new Date(rescheduleForm.slotStart).toISOString(),
        slotEnd: new Date(rescheduleForm.slotEnd).toISOString(),
      });
      setReschedulingId(null);
      await load();
    } catch (err) {
      if (err instanceof ApiError && err.status === 409) {
        setError("Yeni zaman dilimi zaten dolu.");
      } else {
        setError("Yeniden planlama başarısız oldu.");
      }
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div>
      <h1 className="font-serif text-2xl font-medium text-ink mb-6">Rezervasyonlar</h1>

      <form
        onSubmit={handleCreate}
        className="bg-white rounded-2xl p-6 border border-charcoal/10 mb-8 grid grid-cols-1 sm:grid-cols-2 gap-4"
      >
        <h2 className="font-serif text-lg text-ink m-0 sm:col-span-2">Yeni Rezervasyon</h2>
        <div>
          <label className="block text-sm font-medium text-charcoal mb-2">Başlangıç</label>
          <input
            type="datetime-local"
            required
            value={form.slotStart}
            onChange={(e) => setForm({ ...form, slotStart: e.target.value })}
            className="input-field"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-charcoal mb-2">Bitiş</label>
          <input
            type="datetime-local"
            required
            value={form.slotEnd}
            onChange={(e) => setForm({ ...form, slotEnd: e.target.value })}
            className="input-field"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-charcoal mb-2">İsim (isteğe bağlı)</label>
          <input
            type="text"
            value={form.clientName}
            onChange={(e) => setForm({ ...form, clientName: e.target.value })}
            className="input-field"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-charcoal mb-2">E-posta (isteğe bağlı)</label>
          <input
            type="email"
            value={form.clientEmail}
            onChange={(e) => setForm({ ...form, clientEmail: e.target.value })}
            className="input-field"
          />
        </div>
        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-charcoal mb-2">Not (isteğe bağlı)</label>
          <textarea
            rows={2}
            value={form.notes}
            onChange={(e) => setForm({ ...form, notes: e.target.value })}
            className="input-field resize-y"
          />
        </div>
        <button
          type="submit"
          disabled={creating}
          className="sm:col-span-2 bg-terracotta text-white py-3 rounded-full text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-60"
        >
          {creating ? "Oluşturuluyor..." : "Rezervasyon Oluştur"}
        </button>
      </form>

      {error && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-3 mb-4">
          {error}
        </p>
      )}

      {loading ? (
        <p className="text-muted">Yükleniyor...</p>
      ) : bookings.length === 0 ? (
        <p className="text-muted">Henüz rezervasyon bulunmuyor.</p>
      ) : (
        <div className="flex flex-col gap-4">
          {bookings.map((b) => (
            <div key={b.id} className="bg-white rounded-2xl p-6 border border-charcoal/10">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-serif text-lg text-ink m-0">{b.clientName || "İsimsiz"}</p>
                  {b.clientEmail && <p className="text-sm text-muted m-0">{b.clientEmail}</p>}
                </div>
                <div className="flex gap-2">
                  <span className="text-xs font-medium uppercase tracking-wide text-sage bg-sand px-3 py-1 rounded-full">
                    {STATUS_LABELS[b.status] || b.status}
                  </span>
                  <span className="text-xs font-medium uppercase tracking-wide text-muted border border-charcoal/15 px-3 py-1 rounded-full">
                    {SOURCE_LABELS[b.source] || b.source}
                  </span>
                </div>
              </div>

              <p className="text-[15px] text-body mt-3 mb-1">{formatSlot(b.slotStart, b.slotEnd)}</p>
              {b.notes && <p className="text-sm text-body mt-2 mb-0">{b.notes}</p>}

              {["PENDING", "APPROVED"].includes(b.status) && (
                <div className="mt-4">
                  {reschedulingId === b.id ? (
                    <div className="flex flex-wrap items-end gap-3">
                      <div>
                        <label className="block text-xs font-medium text-charcoal mb-1">Yeni başlangıç</label>
                        <input
                          type="datetime-local"
                          value={rescheduleForm.slotStart}
                          onChange={(e) =>
                            setRescheduleForm({ ...rescheduleForm, slotStart: e.target.value })
                          }
                          className="input-field py-2"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-charcoal mb-1">Yeni bitiş</label>
                        <input
                          type="datetime-local"
                          value={rescheduleForm.slotEnd}
                          onChange={(e) =>
                            setRescheduleForm({ ...rescheduleForm, slotEnd: e.target.value })
                          }
                          className="input-field py-2"
                        />
                      </div>
                      <button
                        onClick={() => handleReschedule(b.id)}
                        disabled={busyId === b.id}
                        className="px-5 py-2.5 rounded-full text-sm font-medium bg-sage text-white hover:opacity-90 transition-opacity disabled:opacity-60"
                      >
                        Kaydet
                      </button>
                      <button onClick={() => setReschedulingId(null)} className="text-sm text-muted">
                        Vazgeç
                      </button>
                    </div>
                  ) : (
                    <div className="flex flex-wrap gap-3">
                      <button
                        onClick={() => startReschedule(b)}
                        disabled={busyId === b.id}
                        className="px-5 py-2.5 rounded-full text-sm font-medium border border-charcoal/15 text-charcoal hover:bg-sand transition-colors disabled:opacity-60"
                      >
                        Yeniden Planla
                      </button>
                      <button
                        onClick={() => handleCancel(b.id)}
                        disabled={busyId === b.id}
                        className="px-5 py-2.5 rounded-full text-sm font-medium border border-red-200 text-red-600 hover:bg-red-50 transition-colors disabled:opacity-60"
                      >
                        İptal Et
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// `datetime-local` inputs need "YYYY-MM-DDTHH:mm" in the browser's local time.
function toLocalInputValue(isoString) {
  const d = new Date(isoString);
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}
