/**
 * Biological Reference Range Evaluator
 * Evaluates test result values against age- and gender-specific normal bounds.
 */

export type ClinicalFlag = 'NORMAL' | 'LOW' | 'HIGH' | 'CRITICAL_LOW' | 'CRITICAL_HIGH';

export interface EvaluationRange {
  minAge: number;
  maxAge: number;
  gender: string; // 'All' | 'Male' | 'Female'
  lowerBound: number;
  upperBound: number;
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
   * Matches patient demographics to appropriate biological range and evaluates value
   */
  static evaluate(
    value: number | string,
    ranges: EvaluationRange[],
    patientAge: number,
    patientGender: string
  ): RangeEvaluationResult {
    // If value is non-numeric (e.g. "Negative", "Reactive", "Clear")
    if (typeof value === 'string' && isNaN(Number(value))) {
      const match = ranges[0]?.textualNormal || 'Negative';
      const isNormal = value.trim().toLowerCase() === match.trim().toLowerCase();
      return {
        flag: isNormal ? 'NORMAL' : 'HIGH',
        isAbnormal: !isNormal,
        isPanicCritical: false,
        referenceIntervalText: match
      };
    }

    const numericValue = typeof value === 'number' ? value : parseFloat(value);

    // Find the best matching biological range by age and gender
    const matchedRange = ranges.find(r => {
      const ageMatches = patientAge >= r.minAge && patientAge <= r.maxAge;
      const genderMatches = r.gender === 'All' || r.gender.toLowerCase() === patientGender.toLowerCase();
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

    const { lowerBound, upperBound, criticalLow, criticalHigh } = matchedRange;
    const referenceIntervalText = `${lowerBound} - ${upperBound}`;

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
