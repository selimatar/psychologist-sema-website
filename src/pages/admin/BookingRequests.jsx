import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ApiError,
  approveBookingRequest,
  listBookingRequests,
  rejectBookingRequest,
} from "../../lib/adminApi.js";

const STATUS_TABS = [
  { value: "PENDING", label: "Beklemede" },
  { value: "APPROVED", label: "Onaylandı" },
  { value: "REJECTED", label: "Reddedildi" },
  { value: "CANCELLED", label: "İptal Edildi" },
  { value: "", label: "Tümü" },
];

const PAGE_SIZE = 10;

const TOPIC_LABELS = {
  anxiety: "Kaygı",
  stress: "Stres yönetimi",
  transitions: "Yaşam geçişleri",
  grief: "Yas",
  depression: "Depresyon",
  trauma: "Travma",
  unsure: "Henüz emin değil",
};

function formatSlot(slotStart, slotEnd) {
  const start = new Date(slotStart);
  const end = new Date(slotEnd);
  const dateFmt = new Intl.DateTimeFormat("tr-TR", { dateStyle: "full", timeZone: "Europe/Istanbul" });
  const timeFmt = new Intl.DateTimeFormat("tr-TR", { timeStyle: "short", timeZone: "Europe/Istanbul" });
  return `${dateFmt.format(start)} · ${timeFmt.format(start)}–${timeFmt.format(end)}`;
}

export default function BookingRequests() {
  const [status, setStatus] = useState("PENDING");
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busyId, setBusyId] = useState(null);
  const [rejectingId, setRejectingId] = useState(null);
  const [rejectReason, setRejectReason] = useState("");
  const [page, setPage] = useState(1);
  const navigate = useNavigate();

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await listBookingRequests(status || undefined);
      setBookings(data);
      setPage(1);
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        navigate("/admin/login", { replace: true });
        return;
      }
      setError("Talepler yüklenirken bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  }, [status, navigate]);

  useEffect(() => {
    load();
  }, [load]);

  async function handleApprove(id) {
    setBusyId(id);
    setError("");
    try {
      await approveBookingRequest(id);
      await load();
    } catch (err) {
      if (err instanceof ApiError && err.status === 409) {
        setError("Bu talep artık beklemede değil. Liste güncellendi.");
        await load();
      } else {
        setError("Onaylama işlemi başarısız oldu.");
      }
    } finally {
      setBusyId(null);
    }
  }

  async function handleReject(id) {
    setBusyId(id);
    setError("");
    try {
      await rejectBookingRequest(id, rejectReason.trim() || undefined);
      setRejectingId(null);
      setRejectReason("");
      await load();
    } catch (err) {
      if (err instanceof ApiError && err.status === 409) {
        setError("Bu talep artık beklemede değil. Liste güncellendi.");
        await load();
      } else {
        setError("Reddetme işlemi başarısız oldu.");
      }
    } finally {
      setBusyId(null);
    }
  }

  const pageCount = Math.max(1, Math.ceil(bookings.length / PAGE_SIZE));
  const currentPage = Math.min(page, pageCount);
  const pageBookings = bookings.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  return (
    <div>
      <h1 className="font-serif text-2xl font-medium text-ink mb-6">Randevu Talepleri</h1>

      <div className="flex flex-wrap gap-2 mb-6">
        {STATUS_TABS.map((tab) => (
          <button
            key={tab.value || "all"}
            onClick={() => setStatus(tab.value)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              status === tab.value ? "bg-terracotta text-white" : "bg-white text-charcoal border border-charcoal/10"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {error && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-3 mb-4">
          {error}
        </p>
      )}

      {loading ? (
        <p className="text-muted">Yükleniyor...</p>
      ) : bookings.length === 0 ? (
        <p className="text-muted">Bu durumda talep bulunmuyor.</p>
      ) : (
        <div className="flex flex-col gap-2">
          {pageBookings.map((b) => (
            <div key={b.id} className="bg-white rounded-xl px-4 py-3 border border-charcoal/10">
              <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
                <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0 min-w-0">
                  <p className="font-serif text-base text-ink m-0 truncate">{b.clientName || "İsimsiz"}</p>
                  <p className="text-xs text-muted m-0 truncate">{b.clientEmail}</p>
                </div>
                <span className="shrink-0 text-[11px] font-medium uppercase tracking-wide text-sage bg-sand px-2.5 py-0.5 rounded-full">
                  {STATUS_TABS.find((t) => t.value === b.status)?.label || b.status}
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 mt-1">
                <p className="text-sm text-body m-0">{formatSlot(b.slotStart, b.slotEnd)}</p>
                {b.topic && (
                  <p className="text-xs text-muted m-0">Konu: {TOPIC_LABELS[b.topic] || b.topic}</p>
                )}
              </div>
              {b.notes && <p className="text-xs text-body mt-1 mb-0">{b.notes}</p>}
              {b.rejectionReason && (
                <p className="text-xs text-red-600 mt-1 mb-0">Red nedeni: {b.rejectionReason}</p>
              )}

              {b.status === "PENDING" && (
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => handleApprove(b.id)}
                    disabled={busyId === b.id}
                    className="px-3.5 py-1.5 rounded-full text-xs font-medium bg-sage text-white hover:opacity-90 transition-opacity disabled:opacity-60"
                  >
                    Onayla
                  </button>
                  {rejectingId === b.id ? (
                    <>
                      <input
                        type="text"
                        placeholder="Red nedeni (isteğe bağlı)"
                        value={rejectReason}
                        onChange={(e) => setRejectReason(e.target.value)}
                        className="input-field flex-1 min-w-[160px] py-1 text-xs"
                      />
                      <button
                        onClick={() => handleReject(b.id)}
                        disabled={busyId === b.id}
                        className="px-3.5 py-1.5 rounded-full text-xs font-medium bg-red-600 text-white hover:opacity-90 transition-opacity disabled:opacity-60"
                      >
                        Reddi Onayla
                      </button>
                      <button
                        onClick={() => {
                          setRejectingId(null);
                          setRejectReason("");
                        }}
                        className="text-xs text-muted"
                      >
                        Vazgeç
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => setRejectingId(b.id)}
                      disabled={busyId === b.id}
                      className="px-3.5 py-1.5 rounded-full text-xs font-medium border border-charcoal/15 text-charcoal hover:bg-sand transition-colors disabled:opacity-60"
                    >
                      Reddet
                    </button>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {!loading && bookings.length > PAGE_SIZE && (
        <div className="flex items-center justify-center gap-4 mt-6">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 rounded-full text-sm font-medium border border-charcoal/15 text-charcoal hover:bg-sand transition-colors disabled:opacity-40"
          >
            Önceki
          </button>
          <span className="text-sm text-muted">
            Sayfa {currentPage} / {pageCount}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(pageCount, p + 1))}
            disabled={currentPage === pageCount}
            className="px-4 py-2 rounded-full text-sm font-medium border border-charcoal/15 text-charcoal hover:bg-sand transition-colors disabled:opacity-40"
          >
            Sonraki
          </button>
        </div>
      )}
    </div>
  );
}
