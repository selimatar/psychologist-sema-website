import { useCallback, useEffect, useMemo, useState } from "react";
import { DayPicker } from "react-day-picker";
import { tr } from "date-fns/locale";
import "react-day-picker/style.css";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000";
const RANGE_DAYS = 60;

function formatTime(iso) {
  return new Intl.DateTimeFormat("tr-TR", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Europe/Istanbul",
  }).format(new Date(iso));
}

// Local calendar-day key (not UTC) so it matches the <DayPicker> date the
// user actually clicked, regardless of the browser's timezone.
function dateKey(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

// Full control over each day cell's look, keyed off DayPicker's own
// modifiers — avoids guessing at how classNames merge onto nested elements.
// `disabled` here only means "outside the fetched range" (past, or beyond
// RANGE_DAYS out) — a day that's simply closed is still clickable, it just
// isn't styled as having openings (see `available` custom modifier).
function SlotDayButton({ day, modifiers, className, children, ...rest }) {
  let stateClasses = "text-charcoal hover:bg-sand";
  if (modifiers.disabled) {
    stateClasses = "text-charcoal/20 cursor-not-allowed";
  } else if (modifiers.selected) {
    stateClasses = "bg-terracotta text-white font-semibold";
  } else if (modifiers.available) {
    stateClasses = "text-terracotta font-semibold hover:bg-sand";
  }

  return (
    <button
      {...rest}
      className={`w-9 h-9 rounded-full text-sm flex items-center justify-center transition-colors ${stateClasses}`}
    >
      {children}
    </button>
  );
}

const navButtonClass =
  "h-8 w-8 flex items-center justify-center rounded-full text-charcoal hover:bg-sand transition-colors disabled:opacity-30 disabled:pointer-events-none";

const dayPickerClassNames = {
  month_caption: "flex justify-center items-center h-9 font-serif text-ink text-[15px]",
  // `.rdp-months` (left as the library default) is `position: relative`, so
  // this nav bar overlays its top edge; justify-between places the two
  // buttons at opposite ends without needing per-button absolute math.
  nav: "absolute inset-x-0 top-0 h-9 flex items-center justify-between px-1 z-10 pointer-events-none [&>button]:pointer-events-auto",
  button_previous: navButtonClass,
  button_next: navButtonClass,
  weekday: "text-muted text-xs font-medium w-9 h-9",
};

// Fetches live availability once. Every date within the fetched range is
// selectable (closed days included) so the calendar's shape never jumps
// around; a fixed set of reference hours (the union of every time-of-day
// seen anywhere in the data) is shown for whichever date is selected, with
// times not actually open on that date rendered disabled rather than
// omitted. `reloadToken` lets the parent force a refetch (e.g. after a 409).
export default function SlotPicker({ selected, onSelect, reloadToken }) {
  const [slotsByDate, setSlotsByDate] = useState({});
  const [rangeStart, setRangeStart] = useState(null);
  const [rangeEnd, setRangeEnd] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedDate, setSelectedDate] = useState(undefined);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const from = new Date();
      from.setHours(0, 0, 0, 0);
      const to = new Date(from);
      to.setDate(to.getDate() + RANGE_DAYS);

      const res = await fetch(
        `${API_BASE_URL}/api/availability?from=${from.toISOString()}&to=${to.toISOString()}`
      );
      if (!res.ok) throw new Error("request failed");
      const data = await res.json();

      const map = {};
      for (const day of data.days) {
        if (day.slots.length > 0) map[day.date] = day.slots;
      }
      setSlotsByDate(map);
      setRangeStart(from);
      setRangeEnd(to);
    } catch {
      setError("Uygun saatler yüklenirken bir sorun oluştu.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load, reloadToken]);

  const availableDateKeys = useMemo(() => new Set(Object.keys(slotsByDate)), [slotsByDate]);
  const hasAnyAvailability = availableDateKeys.size > 0;

  // Union of every time-of-day (Istanbul, "HH:mm") seen anywhere in the
  // fetched range — the fixed grid of hours shown for any selected date.
  const referenceTimes = useMemo(() => {
    const set = new Set();
    for (const slots of Object.values(slotsByDate)) {
      for (const slot of slots) set.add(formatTime(slot.start));
    }
    return [...set].sort();
  }, [slotsByDate]);

  const realSlotsForSelectedDate = selectedDate ? slotsByDate[dateKey(selectedDate)] || [] : [];
  const realSlotsByTime = useMemo(() => {
    const map = {};
    for (const slot of realSlotsForSelectedDate) map[formatTime(slot.start)] = slot;
    return map;
  }, [realSlotsForSelectedDate]);

  if (loading) return <p className="text-sm text-muted m-0">Uygun saatler yükleniyor...</p>;
  if (error) return <p className="text-sm text-red-600 m-0">{error}</p>;
  if (!hasAnyAvailability) {
    return (
      <p className="text-sm text-muted m-0">
        Şu anda uygun saat bulunmuyor. Lütfen daha sonra tekrar deneyin.
      </p>
    );
  }

  return (
    <div>
      <div className="flex justify-center">
        <DayPicker
          mode="single"
          locale={tr}
          selected={selectedDate}
          onSelect={setSelectedDate}
          disabled={(date) => date < rangeStart || date >= rangeEnd}
          modifiers={{
            available: (date) => availableDateKeys.has(dateKey(date)),
          }}
          showOutsideDays={false}
          classNames={dayPickerClassNames}
          components={{ DayButton: SlotDayButton }}
        />
      </div>

      {selectedDate && (
        <div className="mt-2 border-t border-charcoal/10 pt-4">
          <p className="text-sm font-medium text-charcoal mb-2">
            {new Intl.DateTimeFormat("tr-TR", {
              weekday: "long",
              day: "numeric",
              month: "long",
            }).format(selectedDate)}
            {realSlotsForSelectedDate.length === 0 && (
              <span className="text-muted font-normal"> — bu gün kapalı</span>
            )}
          </p>
          <div className="flex flex-wrap gap-2">
            {referenceTimes.map((time) => {
              const slot = realSlotsByTime[time];
              const isSelected = slot && selected?.start === slot.start;
              return (
                <button
                  type="button"
                  key={time}
                  disabled={!slot}
                  onClick={slot ? () => onSelect(slot) : undefined}
                  className={`px-3.5 py-2 rounded-lg text-sm font-medium border transition-colors ${
                    !slot
                      ? "bg-transparent text-charcoal/25 border-charcoal/10 cursor-not-allowed"
                      : isSelected
                        ? "bg-terracotta text-white border-terracotta"
                        : "bg-cream text-charcoal border-charcoal/15 hover:border-terracotta"
                  }`}
                >
                  {time}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
