import {
  type AssessmentReport,
  type DemoScenarioId,
  buildScenarioReport,
} from "@/src/lib/data/competition";

const STORAGE_KEY = "lumiq-competition-report-v1";

function canUseStorage() {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

export function getStoredAssessmentReport(): AssessmentReport | null {
  if (!canUseStorage()) {
    return null;
  }

  const raw = window.localStorage.getItem(STORAGE_KEY);

  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw) as AssessmentReport;
  } catch {
    return null;
  }
}

export function saveAssessmentReport(report: AssessmentReport) {
  if (!canUseStorage()) {
    return;
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(report));
}

export function loadScenarioReport(id: DemoScenarioId): AssessmentReport {
  const report = buildScenarioReport(id);
  saveAssessmentReport(report);
  return report;
}

export function getOrCreateDemoReport(defaultScenario: DemoScenarioId = "set-operations") {
  const stored = getStoredAssessmentReport();

  if (stored) {
    return stored;
  }

  return loadScenarioReport(defaultScenario);
}
