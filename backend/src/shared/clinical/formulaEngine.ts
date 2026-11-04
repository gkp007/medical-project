/**
 * Clinical Formula Engine for Laboratory Diagnostic Calculations
 * Computes dependent parameters such as Globulin, A/G Ratio, eGFR, MCV, MCH, MCHC, VLDL, etc.
 * Includes topological sort for chained formula dependency resolution.
 */

export interface FormulaContext {
  [parameterCode: string]: number | undefined;
}

export interface FormulaParameter {
  code: string;
  formula?: string | null;
  isCalculated: boolean;
}

export class ClinicalFormulaEngine {
  /**
   * Evaluates standard clinical laboratory formulas given parameter values
   */
  static calculate(formula: string, context: FormulaContext): number | null {
    try {
      // Safety sanitize: only allow alphanumeric parameter keys, basic operators (+ - * / () .) and spaces
      if (!/^[a-zA-Z0-9_+\-*/().\s]+$/.test(formula)) {
        return null;
      }

      // Replace parameter tokens with actual numbers from context
      let expression = formula;
      const tokens = formula.match(/[a-zA-Z_][a-zA-Z0-9_]*/g) || [];

      for (const token of tokens) {
        const val = context[token];
        if (val === undefined || isNaN(val)) {
          return null; // Missing prerequisite parameter
        }
        // Replace token as a whole word
        const regex = new RegExp(`\\b${token}\\b`, 'g');
        expression = expression.replace(regex, val.toString());
      }

      // Evaluate safe mathematical expression
      // eslint-disable-next-line no-new-func
      const result = new Function(`return (${expression});`)();

      if (typeof result === 'number' && !isNaN(result) && isFinite(result)) {
        return Math.round(result * 100) / 100; // 2 decimal precision
      }

      return null;
    } catch {
      return null;
    }
  }

  /**
   * Extracts parameter code dependencies from a formula string.
   * Returns the list of parameter codes that appear as tokens in the formula.
   */
  static extractDependencies(formula: string): string[] {
    if (!formula) return [];
    const tokens = formula.match(/[a-zA-Z_][a-zA-Z0-9_]*/g) || [];
    return [...new Set(tokens)];
  }

  /**
   * Topological sort of parameters so that formula-dependent parameters
   * are evaluated after their prerequisites.
   *
   * Uses Kahn's algorithm (BFS-based) — returns parameters in safe evaluation order.
   * Non-calculated parameters come first, then calculated params sorted by dependency chain.
   * Circular dependencies are broken gracefully (appended at the end).
   */
  static resolveEvaluationOrder(parameters: FormulaParameter[]): FormulaParameter[] {
    const codeToParam = new Map<string, FormulaParameter>();
    const paramCodes = new Set<string>();

    for (const p of parameters) {
      codeToParam.set(p.code, p);
      paramCodes.add(p.code);
    }

    // Separate non-calculated (direct entry) from calculated (formula-derived)
    const directParams: FormulaParameter[] = [];
    const formulaParams: FormulaParameter[] = [];

    for (const p of parameters) {
      if (p.isCalculated && p.formula) {
        formulaParams.push(p);
      } else {
        directParams.push(p);
      }
    }

    if (formulaParams.length === 0) {
      return parameters; // No formulas — original order is fine
    }

    // Build adjacency list: edges from dependency → dependent
    // inDegree counts how many unresolved deps each formula param has
    const inDegree = new Map<string, number>();
    const dependents = new Map<string, string[]>(); // dep code → list of param codes that depend on it

    for (const p of formulaParams) {
      const deps = this.extractDependencies(p.formula!).filter(d => paramCodes.has(d) && d !== p.code);
      // Only count dependencies that are themselves calculated (direct params are always available)
      const calculatedDeps = deps.filter(d => {
        const dp = codeToParam.get(d);
        return dp && dp.isCalculated && dp.formula;
      });
      inDegree.set(p.code, calculatedDeps.length);

      for (const dep of calculatedDeps) {
        if (!dependents.has(dep)) dependents.set(dep, []);
        dependents.get(dep)!.push(p.code);
      }
    }

    // Kahn's BFS
    const queue: string[] = [];
    for (const p of formulaParams) {
      if ((inDegree.get(p.code) || 0) === 0) {
        queue.push(p.code);
      }
    }

    const sortedFormulaCodes: string[] = [];
    while (queue.length > 0) {
      const current = queue.shift()!;
      sortedFormulaCodes.push(current);

      const deps = dependents.get(current) || [];
      for (const dep of deps) {
        const newDeg = (inDegree.get(dep) || 1) - 1;
        inDegree.set(dep, newDeg);
        if (newDeg === 0) {
          queue.push(dep);
        }
      }
    }

    // Append any remaining (circular dependency) params at the end gracefully
    for (const p of formulaParams) {
      if (!sortedFormulaCodes.includes(p.code)) {
        sortedFormulaCodes.push(p.code);
      }
    }

    // Final ordered list: direct params first, then sorted formula params
    const sortedFormulaParams = sortedFormulaCodes
      .map(code => codeToParam.get(code)!)
      .filter(Boolean);

    return [...directParams, ...sortedFormulaParams];
  }

  /**
   * Common Standard Medical Formulas
   */
  static readonly STANDARD_FORMULAS = {
    // Liver Function Test
    GLOBULIN: 'TOTAL_PROTEIN - ALBUMIN',
    AG_RATIO: 'ALBUMIN / GLOBULIN',
    // Complete Blood Count (Wintrobe indices)
    MCV: '(PCV * 10) / RBC',
    MCH: '(HB * 10) / RBC',
    MCHC: '(HB * 100) / PCV',
    // Lipid Profile (Friedewald formula)
    VLDL: 'TRIGLYCERIDES / 5',
    LDL_CHOLESTEROL: 'TOTAL_CHOLESTEROL - (HDL_CHOLESTEROL + (TRIGLYCERIDES / 5))'
  };
}
