const getDifference = (startStr, endStr) => {
  const start = new Date(startStr);
  const end = new Date(endStr);

  if (start > end) return getDifference(endStr, startStr);

  let years = end.getFullYear() - start.getFullYear();

  let candidate = new Date(start);
  candidate.setFullYear(candidate.getFullYear() + years);

  if (candidate > end) {
    years -= 1;
    candidate = new Date(start);
    candidate.setFullYear(candidate.getFullYear() + years);
  }

  let months = end.getMonth() - candidate.getMonth();
  if (months < 0) {
    months += 12;
  }

  let candidate2 = new Date(candidate);
  candidate2.setMonth(candidate2.getMonth() + months);

  // Handling edge cases like start=Jan 31 + 1 month = Feb 28 or Mar 3
  // By using setMonth, JS adjusts Jan 31 + 1 to Mar 2 (or 3). We want Feb 28/29.
  // Actually, standard date difference logic:

  let dYears = end.getFullYear() - start.getFullYear();
  let dMonths = end.getMonth() - start.getMonth();
  let dDays = end.getDate() - start.getDate();

  if (dDays < 0) {
    dMonths -= 1;
    const prevMonth = new Date(end.getFullYear(), end.getMonth(), 0);
    dDays += prevMonth.getDate();
  }
  if (dMonths < 0) {
    dYears -= 1;
    dMonths += 12;
  }

  const totalDays = Math.round((end - start) / (1000 * 60 * 60 * 24));

  return { dYears, dMonths, dDays, totalDays };
};

console.log(getDifference("2000-02-29", "2001-02-28")); // Expect 0 y, 11 m, 30/29 d? Wait, 2001 is not leap. 29th Feb to 28th Feb is 1 year?
console.log(getDifference("2000-02-29", "2024-02-28"));
console.log(getDifference("2020-02-29", "2021-03-01"));
console.log(getDifference("1995-03-10", "1998-11-22"));
