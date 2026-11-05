export type AgeGapDate = {
  year: number;
  month: number;
  day: number;
};

export type AgeDifference = {
  years: number;
  months: number;
  days: number;
};

export type CoupleAgeCalculationResult = {
  olderPerson: "A" | "B" | "same";
  exactDifference: AgeDifference;
  totalDays: number;
  totalWeeks: number;
  totalFullMonths: number;
  ages: {
    personA: AgeDifference;
    personB: AgeDifference;
  };
  combinedAge: AgeDifference;
};

/**
 * Parses a YYYY-MM-DD string into UTC date components to avoid timezone shifts.
 */
export const parseDateSafe = (dateString: string): Date => {
  const [year, month, day] = dateString.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, day, 0, 0, 0, 0));
};

export const getExactAgeDifference = (start: Date, end: Date): AgeDifference => {
  let years = end.getUTCFullYear() - start.getUTCFullYear();
  let months = end.getUTCMonth() - start.getUTCMonth();
  let days = end.getUTCDate() - start.getUTCDate();

  if (days < 0) {
    months -= 1;
    // Get the number of days in the previous month of the `end` date
    const prevMonth = new Date(Date.UTC(end.getUTCFullYear(), end.getUTCMonth(), 0));
    days += prevMonth.getUTCDate();
  }

  if (months < 0) {
    years -= 1;
    months += 12;
  }

  return { years, months, days };
};

export const calculateCoupleAgeDifference = (
  dateAStr: string,
  dateBStr: string,
  todayStr: string, // YYYY-MM-DD
): CoupleAgeCalculationResult => {
  const dateA = parseDateSafe(dateAStr);
  const dateB = parseDateSafe(dateBStr);
  const today = parseDateSafe(todayStr);

  let olderPerson: "A" | "B" | "same" = "same";
  let earlier = dateA;
  let later = dateB;

  if (dateA.getTime() < dateB.getTime()) {
    olderPerson = "A";
    earlier = dateA;
    later = dateB;
  } else if (dateB.getTime() < dateA.getTime()) {
    olderPerson = "B";
    earlier = dateB;
    later = dateA;
  }

  const exactDifference = getExactAgeDifference(earlier, later);
  const diffTime = later.getTime() - earlier.getTime();
  const totalDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
  const totalWeeks = Math.floor(totalDays / 7);

  // Total full months: (years * 12) + months
  const totalFullMonths = exactDifference.years * 12 + exactDifference.months;

  const ageA = getExactAgeDifference(dateA, today);
  const ageB = getExactAgeDifference(dateB, today);

  // Combined Age
  let cDays = ageA.days + ageB.days;
  let cMonths = ageA.months + ageB.months;
  let cYears = ageA.years + ageB.years;

  // Approximate overflow handling for combined age (using a 30-day average for simplicity of combination)
  if (cDays >= 30) {
    cMonths += Math.floor(cDays / 30);
    cDays = cDays % 30;
  }
  if (cMonths >= 12) {
    cYears += Math.floor(cMonths / 12);
    cMonths = cMonths % 12;
  }

  return {
    olderPerson,
    exactDifference,
    totalDays,
    totalWeeks,
    totalFullMonths,
    ages: {
      personA: ageA,
      personB: ageB,
    },
    combinedAge: {
      years: cYears,
      months: cMonths,
      days: cDays,
    },
  };
};
