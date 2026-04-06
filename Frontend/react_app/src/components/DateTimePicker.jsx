// import { useState, useEffect, useCallback } from "react";

// const DAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
// const MONTHS = [
//   "January", "February", "March", "April", "May", "June",
//   "July", "August", "September", "October", "November", "December",
// ];

// const pad = (n) => String(n).padStart(2, "0");

// const generateTimes = () => {
//   const times = [];
//   for (let h = 0; h < 24; h++)
//     for (let m = 0; m < 60; m += 30)
//       times.push({ h, m, key: `${pad(h)}:${pad(m)}` });
//   return times;
// };

// const fmtTime = (h, m) => {
//   const suf = h >= 12 ? "PM" : "AM";
//   const hr = h % 12 === 0 ? 12 : h % 12;
//   return `${hr}:${pad(m)} ${suf}`;
// };

// const getNowParts = () => {
//   const n = new Date();
//   return {
//     dateStr: `${n.getFullYear()}-${pad(n.getMonth() + 1)}-${pad(n.getDate())}`,
//     h: n.getHours(),
//     m: n.getMinutes(),
//     timeKey: `${pad(n.getHours())}:${pad(n.getMinutes())}`,
//   };
// };

// // ─── Single picker (calendar + time slots) ────────────────────────────────────
// const SinglePicker = ({ selectedDate, selectedTime, minDate, minTimeOnDate, minTimeDate, onDateSelect, onTimeSelect, isStart }) => {
//   const today = new Date();
//   const [viewYear, setViewYear] = useState(selectedDate ? parseInt(selectedDate.split("-")[0]) : today.getFullYear());
//   const [viewMonth, setViewMonth] = useState(selectedDate ? parseInt(selectedDate.split("-")[1]) - 1 : today.getMonth());

//   const todayStr = `${today.getFullYear()}-${pad(today.getMonth() + 1)}-${pad(today.getDate())}`;

//   const isDateDisabled = (ds) => minDate && ds < minDate;

//   const isTimeDisabled = (h, m) => {
//     if (!selectedDate || !minTimeOnDate || !minTimeDate) return false;
//     if (selectedDate !== minTimeDate) return false;
//     const [mh, mm] = minTimeOnDate.split(":").map(Number);
//     if (h < mh) return true;
//     if (h === mh && m <= mm) return true;
//     return false;
//   };

//   const firstDay = new Date(viewYear, viewMonth, 1).getDay();
//   const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();

//   const prevMonth = () => {
//     if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); }
//     else setViewMonth(m => m - 1);
//   };
//   const nextMonth = () => {
//     if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); }
//     else setViewMonth(m => m + 1);
//   };

//   const times = generateTimes();
//   const amTimes = times.filter((t) => t.h < 12);
//   const pmTimes = times.filter((t) => t.h >= 12);

//   const now = getNowParts();
//   const showTodayBanner = isStart && selectedDate === todayStr;

//   return (
//     <div className="border border-gray-200 rounded-xl overflow-hidden bg-white">
//       {/* ── Calendar header ── */}
//       <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-b border-gray-200">
//         <button type="button" onClick={prevMonth} className="p-1 rounded hover:bg-gray-200 text-gray-500 hover:text-gray-800 transition text-lg leading-none">
//           ‹
//         </button>
//         <span className="text-sm font-medium text-gray-700">
//           {MONTHS[viewMonth]} {viewYear}
//         </span>
//         <button type="button" onClick={nextMonth} className="p-1 rounded hover:bg-gray-200 text-gray-500 hover:text-gray-800 transition text-lg leading-none">
//           ›
//         </button>
//       </div>

//       {/* ── Today banner ── */}
//       {showTodayBanner && (
//         <div className="px-4 py-2 bg-amber-50 border-b border-amber-200 flex items-center gap-2">
//           <span className="w-2 h-2 rounded-full bg-amber-500 flex-shrink-0"></span>
//           <span className="text-xs text-amber-700">
//             Times before {fmtTime(now.h, now.m)} are disabled (already passed)
//           </span>
//         </div>
//       )}

//       {/* ── Calendar grid ── */}
//       <div className="grid grid-cols-7 gap-0.5 p-3">
//         {DAYS.map((d) => (
//           <div key={d} className="text-center text-xs text-gray-400 py-1">{d}</div>
//         ))}
//         {Array.from({ length: firstDay }).map((_, i) => (
//           <div key={`empty-${i}`} />
//         ))}
//         {Array.from({ length: daysInMonth }).map((_, i) => {
//           const day = i + 1;
//           const ds = `${viewYear}-${pad(viewMonth + 1)}-${pad(day)}`;
//           const disabled = isDateDisabled(ds);
//           const selected = ds === selectedDate;
//           const isToday = ds === todayStr;

//           return (
//             <button
//               key={ds}
//               type="button"
//               disabled={disabled}
//               onClick={() => onDateSelect(ds)}
//               className={`
//                 text-center text-sm py-1.5 rounded-lg transition
//                 ${disabled ? "text-gray-300 cursor-not-allowed" : "cursor-pointer"}
//                 ${selected ? "bg-blue-600 text-white font-medium" : ""}
//                 ${!selected && !disabled ? "hover:bg-blue-50 text-gray-700" : ""}
//                 ${isToday && !selected ? "font-semibold underline" : ""}
//               `}
//             >
//               {day}
//             </button>
//           );
//         })}
//       </div>

//       {/* ── Time slots ── */}
//       {selectedDate && (
//         <div className="border-t border-gray-200 p-3">
//           {[{ label: "AM", group: amTimes }, { label: "PM", group: pmTimes }].map(({ label, group }) => (
//             <div key={label} className="mb-2 last:mb-0">
//               <p className="text-xs text-gray-400 mb-1.5 tracking-wide">{label}</p>
//               <div className="grid grid-cols-4 gap-1.5">
//                 {group.map(({ h, m, key }) => {
//                   const disabled = isTimeDisabled(h, m);
//                   const selected = key === selectedTime;
//                   return (
//                     <button
//                       key={key}
//                       type="button"
//                       disabled={disabled}
//                       onClick={() => onTimeSelect(key)}
//                       className={`
//                         text-xs py-1.5 rounded-lg border transition text-center
//                         ${disabled ? "bg-gray-50 text-gray-300 border-gray-100 cursor-not-allowed" : "cursor-pointer"}
//                         ${selected ? "bg-blue-600 text-white border-blue-600 font-medium" : ""}
//                         ${!selected && !disabled ? "bg-white border-gray-200 text-gray-600 hover:bg-blue-50 hover:border-blue-300" : ""}
//                       `}
//                     >
//                       {fmtTime(h, m)}
//                     </button>
//                   );
//                 })}
//               </div>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// // ─── Public reusable component ────────────────────────────────────────────────
// /**
//  * DateTimePicker
//  *
//  * Props:
//  *  - label        {string}   Field label
//  *  - value        {string}   ISO datetime string "YYYY-MM-DDTHH:MM" or ""
//  *  - onChange     {fn}       Called with "YYYY-MM-DDTHH:MM" or ""
//  *  - minDateTime  {string}   ISO datetime string — nothing before this is selectable
//  *  - disabled     {boolean}  Lock the whole picker
//  *  - error        {string}   Error message to show below
//  *  - required     {boolean}
//  *  - isStart      {boolean}  If true, shows "today" banner with current time info
//  */
// const DateTimePicker = ({
//   label,
//   value = "",
//   onChange,
//   minDateTime = "",
//   disabled = false,
//   error = "",
//   required = false,
//   isStart = false,
// }) => {
//   const [open, setOpen] = useState(false);

//   const selectedDate = value ? value.split("T")[0] : null;
//   const selectedTime = value ? value.split("T")[1]?.slice(0, 5) : null;

//   const minDate = minDateTime ? minDateTime.split("T")[0] : null;
//   const minTimeOnDate = minDateTime ? minDateTime.split("T")[1]?.slice(0, 5) : null;
//   const minTimeDate = minDate;

//   const handleDateSelect = (ds) => {
//     // When date changes, clear time
//     onChange(`${ds}T`);
//   };

//   const handleTimeSelect = (timeKey) => {
//     if (!selectedDate) return;
//     onChange(`${selectedDate}T${timeKey}`);
//     setOpen(false);
//   };

//   const displayValue = () => {
//     if (!selectedDate) return "";
//     if (!selectedTime) return new Date(selectedDate + "T00:00").toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
//     const [h, m] = selectedTime.split(":").map(Number);
//     return (
//       new Date(selectedDate + "T00:00").toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) +
//       ", " + fmtTime(h, m)
//     );
//   };

//   // Close on outside click
//   useEffect(() => {
//     if (!open) return;
//     const handler = (e) => {
//       if (!e.target.closest(`[data-dtpicker]`)) setOpen(false);
//     };
//     document.addEventListener("mousedown", handler);
//     return () => document.removeEventListener("mousedown", handler);
//   }, [open]);

//   return (
//     <div className="relative" data-dtpicker>
//       {label && (
//         <label className="block text-sm font-medium text-gray-700 mb-2">
//           {label} {required && <span className="text-red-500">*</span>}
//         </label>
//       )}

//       {/* ── Trigger input ── */}
//       <div
//         onClick={() => !disabled && setOpen((o) => !o)}
//         className={`
//           w-full border rounded-lg px-4 py-3 text-sm cursor-pointer flex items-center justify-between
//           transition focus-within:ring-2 focus-within:ring-blue-500
//           ${disabled ? "bg-gray-100 cursor-not-allowed text-gray-400 border-gray-200" : "bg-white hover:border-blue-400"}
//           ${error ? "border-red-500" : "border-gray-300"}
//           ${open ? "border-blue-500 ring-2 ring-blue-500" : ""}
//         `}
//       >
//         <span className={displayValue() ? "text-gray-800" : "text-gray-400"}>
//           {displayValue() || "Select date & time"}
//         </span>
//         <svg className={`w-4 h-4 text-gray-400 transition-transform ${open ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
//           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
//         </svg>
//       </div>

//       {error && <p className="mt-1 text-sm text-red-600">{error}</p>}

//       {/* ── Dropdown picker ── */}
//       {open && !disabled && (
//         <div className="absolute z-50 mt-1 w-full min-w-[300px] shadow-lg rounded-xl border border-gray-200 bg-white">
//           <SinglePicker
//             selectedDate={selectedDate}
//             selectedTime={selectedTime}
//             minDate={minDate}
//             minTimeOnDate={minTimeOnDate}
//             minTimeDate={minTimeDate}
//             onDateSelect={handleDateSelect}
//             onTimeSelect={handleTimeSelect}
//             isStart={isStart}
//           />
//         </div>
//       )}
//     </div>
//   );
// };

// export default DateTimePicker;

import { useState, useEffect } from "react";

const DAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const pad = (n) => String(n).padStart(2, "0");

const generateTimes = () => {
  const times = [];
  for (let h = 0; h < 24; h++)
    for (let m = 0; m < 60; m += 30)
      times.push({ h, m, key: `${pad(h)}:${pad(m)}` });
  return times;
};

const fmtTime = (h, m) => {
  const suf = h >= 12 ? "PM" : "AM";
  const hr = h % 12 === 0 ? 12 : h % 12;
  return `${hr}:${pad(m)} ${suf}`;
};

const getNowParts = () => {
  const n = new Date();
  return {
    dateStr: `${n.getFullYear()}-${pad(n.getMonth() + 1)}-${pad(n.getDate())}`,
    h: n.getHours(),
    m: n.getMinutes(),
  };
};

// ─── SinglePicker ────────────────────────────────────────────────────────────
const SinglePicker = ({
  selectedDate,
  selectedTime,
  minDate,
  maxDate,
  minTimeOnDate,
  minTimeDate,
  maxTimeOnDate,
  maxTimeDate,
  onDateSelect,
  onTimeSelect,
  isStart,
}) => {
  const today = new Date();
  const [viewYear, setViewYear] = useState(
    selectedDate ? parseInt(selectedDate.split("-")[0]) : today.getFullYear()
  );
  const [viewMonth, setViewMonth] = useState(
    selectedDate ? parseInt(selectedDate.split("-")[1]) - 1 : today.getMonth()
  );

  const todayStr = `${today.getFullYear()}-${pad(today.getMonth() + 1)}-${pad(today.getDate())}`;

  const isDateDisabled = (ds) => {
    if (minDate && ds < minDate) return true;
    if (maxDate && ds > maxDate) return true;
    return false;
  };

  const isTimeDisabled = (h, m) => {
    if (!selectedDate) return false;
    // Min boundary
    if (minTimeOnDate && minTimeDate && selectedDate === minTimeDate) {
      const [mh, mm] = minTimeOnDate.split(":").map(Number);
      if (h < mh) return true;
      if (h === mh && m <= mm) return true;
    }
    // Max boundary (e.g. event end time on the last day)
    if (maxTimeOnDate && maxTimeDate && selectedDate === maxTimeDate) {
      const [mh, mm] = maxTimeOnDate.split(":").map(Number);
      if (h > mh) return true;
      if (h === mh && m > mm) return true;
    }
    return false;
  };

  const firstDay = new Date(viewYear, viewMonth, 1).getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();

  const prevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear((y) => y - 1); }
    else setViewMonth((m) => m - 1);
  };
  const nextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear((y) => y + 1); }
    else setViewMonth((m) => m + 1);
  };

  const times = generateTimes();
  const amTimes = times.filter((t) => t.h < 12);
  const pmTimes = times.filter((t) => t.h >= 12);
  const now = getNowParts();
  const showTodayBanner = isStart && selectedDate === todayStr;

  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden bg-white">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-b border-gray-200">
        <button type="button" onClick={prevMonth}
          className="p-1 rounded hover:bg-gray-200 text-gray-500 hover:text-gray-800 transition text-lg leading-none">
          ‹
        </button>
        <span className="text-sm font-medium text-gray-700">
          {MONTHS[viewMonth]} {viewYear}
        </span>
        <button type="button" onClick={nextMonth}
          className="p-1 rounded hover:bg-gray-200 text-gray-500 hover:text-gray-800 transition text-lg leading-none">
          ›
        </button>
      </div>

      {/* Today banner */}
      {showTodayBanner && (
        <div className="px-4 py-2 bg-amber-50 border-b border-amber-200 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-amber-500 flex-shrink-0" />
          <span className="text-xs text-amber-700">
            Times before {fmtTime(now.h, now.m)} are disabled (already passed)
          </span>
        </div>
      )}

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-0.5 p-3">
        {DAYS.map((d) => (
          <div key={d} className="text-center text-xs text-gray-400 py-1">{d}</div>
        ))}
        {Array.from({ length: firstDay }).map((_, i) => <div key={`e-${i}`} />)}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1;
          const ds = `${viewYear}-${pad(viewMonth + 1)}-${pad(day)}`;
          const disabled = isDateDisabled(ds);
          const selected = ds === selectedDate;
          const isToday = ds === todayStr;
          return (
            <button key={ds} type="button" disabled={disabled} onClick={() => onDateSelect(ds)}
              className={`
                text-center text-sm py-1.5 rounded-lg transition
                ${disabled ? "text-gray-300 cursor-not-allowed" : "cursor-pointer"}
                ${selected ? "bg-blue-600 text-white font-medium" : ""}
                ${!selected && !disabled ? "hover:bg-blue-50 text-gray-700" : ""}
                ${isToday && !selected ? "font-semibold underline" : ""}
              `}>
              {day}
            </button>
          );
        })}
      </div>

      {/* Time slots */}
      {selectedDate && (
        <div className="border-t border-gray-200 p-3">
          {[{ label: "AM", group: amTimes }, { label: "PM", group: pmTimes }].map(({ label, group }) => (
            <div key={label} className="mb-2 last:mb-0">
              <p className="text-xs text-gray-400 mb-1.5 tracking-wide">{label}</p>
              <div className="grid grid-cols-4 gap-1.5">
                {group.map(({ h, m, key }) => {
                  const disabled = isTimeDisabled(h, m);
                  const selected = key === selectedTime;
                  return (
                    <button key={key} type="button" disabled={disabled} onClick={() => onTimeSelect(key)}
                      className={`
                        text-xs py-1.5 rounded-lg border transition text-center
                        ${disabled ? "bg-gray-50 text-gray-300 border-gray-100 cursor-not-allowed" : "cursor-pointer"}
                        ${selected ? "bg-blue-600 text-white border-blue-600 font-medium" : ""}
                        ${!selected && !disabled ? "bg-white border-gray-200 text-gray-600 hover:bg-blue-50 hover:border-blue-300" : ""}
                      `}>
                      {fmtTime(h, m)}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// ─── Public Component ─────────────────────────────────────────────────────────
/**
 * DateTimePicker — reusable across CreateEvent, EditEvent, CreateCompetitions, etc.
 *
 * Props:
 *  label         {string}   Field label text
 *  value         {string}   "YYYY-MM-DDTHH:MM" or ""
 *  onChange      {fn}       Receives "YYYY-MM-DDTHH:MM" or ""
 *  minDateTime   {string}   Nothing before this selectable (e.g. now, or event start)
 *  maxDateTime   {string}   Nothing after this selectable  (e.g. event end)
 *  disabled      {boolean}  Locks the whole picker
 *  error         {string}   Red error text below trigger
 *  required      {boolean}  Shows * on label
 *  isStart       {boolean}  Shows amber "today" banner with current time hint
 */
const DateTimePicker = ({
  label,
  value = "",
  onChange,
  minDateTime = "",
  maxDateTime = "",
  disabled = false,
  error = "",
  required = false,
  isStart = false,
}) => {
  const [open, setOpen] = useState(false);

  const selectedDate = value ? value.split("T")[0] : null;
  const selectedTime = value && !value.endsWith("T") ? value.split("T")[1]?.slice(0, 5) : null;

  const minDate = minDateTime ? minDateTime.split("T")[0] : null;
  const minTimeOnDate = minDateTime ? minDateTime.split("T")[1]?.slice(0, 5) : null;
  const minTimeDate = minDate;

  const maxDate = maxDateTime ? maxDateTime.split("T")[0] : null;
  const maxTimeOnDate = maxDateTime ? maxDateTime.split("T")[1]?.slice(0, 5) : null;
  const maxTimeDate = maxDate;

  const handleDateSelect = (ds) => {
    onChange(`${ds}T`); // time not yet chosen
  };

  const handleTimeSelect = (timeKey) => {
    if (!selectedDate) return;
    onChange(`${selectedDate}T${timeKey}`);
    setOpen(false);
  };

  const displayValue = () => {
    if (!selectedDate) return "";
    const datePart = new Date(selectedDate + "T00:00").toLocaleDateString("en-IN", {
      day: "numeric", month: "short", year: "numeric",
    });
    if (!selectedTime) return datePart;
    const [h, m] = selectedTime.split(":").map(Number);
    return `${datePart}, ${fmtTime(h, m)}`;
  };

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (!e.target.closest("[data-dtpicker]")) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  return (
    <div className="relative" data-dtpicker>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}

      {/* Trigger button */}
      <div
        onClick={() => !disabled && setOpen((o) => !o)}
        className={`
          w-full border rounded-lg px-4 py-3 text-sm flex items-center justify-between transition
          ${disabled ? "bg-gray-100 cursor-not-allowed text-gray-400 border-gray-200" : "bg-white cursor-pointer hover:border-blue-400"}
          ${error ? "border-red-500" : "border-gray-300"}
          ${open ? "border-blue-500 ring-2 ring-blue-500" : ""}
        `}
      >
        <span className={displayValue() ? "text-gray-800" : "text-gray-400"}>
          {displayValue() || "Select date & time"}
        </span>
        <svg className={`w-4 h-4 text-gray-400 transition-transform ${open ? "rotate-180" : ""}`}
          fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      </div>

      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}

      {/* Dropdown */}
      {open && !disabled && (
        <div className="absolute z-50 mt-1 w-full min-w-[300px] shadow-lg rounded-xl border border-gray-200 bg-white">
          <SinglePicker
            selectedDate={selectedDate}
            selectedTime={selectedTime}
            minDate={minDate}
            maxDate={maxDate}
            minTimeOnDate={minTimeOnDate}
            minTimeDate={minTimeDate}
            maxTimeOnDate={maxTimeOnDate}
            maxTimeDate={maxTimeDate}
            onDateSelect={handleDateSelect}
            onTimeSelect={handleTimeSelect}
            isStart={isStart}
          />
        </div>
      )}
    </div>
  );
};

export default DateTimePicker;