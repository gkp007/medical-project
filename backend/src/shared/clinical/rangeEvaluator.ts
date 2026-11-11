/**
 * Biological Reference Range Evaluator
 * Evaluates test result values against age- and gender-specific normal bounds.
 */

export type ClinicalFlag = 'NORMAL' | 'LOW' | 'HIGH' | 'CRITICAL_LOW' | 'CRITICAL_HIGH';

export interface EvaluationRange {
  minAge: number;
  minAgeUnit?: string; // 'Years' | 'Days' | 'Months'
  maxAge: number;
  maxAgeUnit?: string; // 'Years' | 'Days' | 'Months'
  gender: string; // 'All' | 'Any' | 'Male' | 'Female' | 'Other'
  lowerBound: number;
  upperBound: number;
  displayRange?: string; // e.g. "12 - 15", "< 2", "17 - 23"
  criticalLow?: number;
  criticalHigh?: number;
  textualNormal?: string;
}

export interface RangeEvaluationResult {
  flag: ClinicalFlag;
  isAbnormal: boolean;
  isPanicCritical: boolean;
  referenceIntervalText: string;
}

export class BiologicalRangeEvaluator {
  /**
   * Helper to convert age with unit to days for precise matching
   */
  private static toDays(age: number, unit?: string): number {
    const u = (unit || 'years').toLowerCase();
    if (u === 'days' || u === 'day') return age;
    if (u === 'months' || u === 'month') return Math.round(age * 30.417);
    return Math.round(age * 365);
  }

  /**
   * Matches patient demographics to appropriate biological range and evaluates value
   */
  static evaluate(
    value: number | string,
    ranges: EvaluationRange[],
    patientAge: number,
    patientGender: string,
    patientAgeUnit: string = 'Years'
  ): RangeEvaluationResult {
    // If value is non-numeric (e.g. "Negative", "Reactive", "Clear")
    if (typeof value === 'string' && isNaN(Number(value))) {
      const match = ranges[0]?.textualNormal || ranges[0]?.displayRange || 'Negative';
      const isNormal = value.trim().toLowerCase() === match.trim().toLowerCase();
      return {
        flag: isNormal ? 'NORMAL' : 'HIGH',
        isAbnormal: !isNormal,
        isPanicCritical: false,
        referenceIntervalText: match
      };
    }

    const numericValue = typeof value === 'number' ? value : parseFloat(value);
    const patientAgeDays = this.toDays(patientAge, patientAgeUnit);

    // Find the best matching biological range by age and gender
    const matchedRange = ranges.find(r => {
      const minDays = this.toDays(r.minAge, r.minAgeUnit);
      const maxDays = this.toDays(r.maxAge, r.maxAgeUnit);
      const ageMatches = patientAgeDays >= minDays && patientAgeDays <= maxDays;

      const g = (r.gender || 'Any').toLowerCase();
      const pG = (patientGender || 'Any').toLowerCase();
      const genderMatches = g === 'all' || g === 'any' || g === pG || (g === 'm' && pG === 'male') || (g === 'f' && pG === 'female');

      return ageMatches && genderMatches;
    }) || ranges[0];

    if (!matchedRange) {
      return {
        flag: 'NORMAL',
        isAbnormal: false,
        isPanicCritical: false,
        referenceIntervalText: 'Not specified'
      };
    }

    const { lowerBound, upperBound, criticalLow, criticalHigh, displayRange } = matchedRange;
    const referenceIntervalText = displayRange && displayRange.trim() ? displayRange.trim() : `${lowerBound} - ${upperBound}`;

    // Critical panic thresholds
    if (criticalLow !== undefined && numericValue <= criticalLow) {
      return { flag: 'CRITICAL_LOW', isAbnormal: true, isPanicCritical: true, referenceIntervalText };
    }
    if (criticalHigh !== undefined && numericValue >= criticalHigh) {
      return { flag: 'CRITICAL_HIGH', isAbnormal: true, isPanicCritical: true, referenceIntervalText };
    }

    // Standard abnormal bounds
    if (numericValue < lowerBound) {
      return { flag: 'LOW', isAbnormal: true, isPanicCritical: false, referenceIntervalText };
    }
    if (numericValue > upperBound) {
      return { flag: 'HIGH', isAbnormal: true, isPanicCritical: false, referenceIntervalText };
    }

    return {
      flag: 'NORMAL',
      isAbnormal: false,
      isPanicCritical: false,
      referenceIntervalText
    };
  }
}
