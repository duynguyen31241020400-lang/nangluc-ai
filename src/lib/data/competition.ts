export type CompetencyId =
  | "set_basics"
  | "set_operations"
  | "quadratic_basics";

export type MasteryLevel = "weak" | "average" | "strong";

export interface LearnerProfile {
  name: string;
  grade: string;
  target: string;
  shortGoal: string;
  primaryNeed: string;
}

export interface CompetencyDefinition {
  id: CompetencyId;
  code: string;
  title: string;
  shortLabel: string;
  tutorHint: string;
}

export interface Question {
  id: string;
  competencyId: CompetencyId;
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
}

export interface CompetencyResult {
  competencyId: CompetencyId;
  title: string;
  code: string;
  correct: number;
  total: number;
  score: number;
  level: MasteryLevel;
  explanation: string;
}

export interface AssessmentReport {
  learner: LearnerProfile;
  results: CompetencyResult[];
  recommendedCompetencyId: CompetencyId;
  weakestCompetencyId: CompetencyId;
  strongestCompetencyId: CompetencyId;
  summary: string;
  coachNote: string;
  generatedAt: string;
  demoScenarioId?: DemoScenarioId;
}

export interface LearningNode {
  id: CompetencyId;
  code: string;
  title: string;
  shortLabel: string;
  mastery: number;
  status: "completed" | "active" | "available";
  description: string;
  recommendedAction: string;
  isCurrentGoal?: boolean;
}

export type DemoScenarioId = "set-operations" | "quadratic-basics";

export const SEEDED_LEARNER: LearnerProfile = {
  name: "Minh",
  grade: "Lớp 10",
  target: "Tự tin hơn trước bài kiểm tra giữa kỳ Toán",
  shortGoal: "Chốt 1 điểm yếu chính và xử lý gọn trong 1 tuần.",
  primaryNeed: "Biết mình yếu phần nào để không học lan man.",
};

export const COMPETENCIES: CompetencyDefinition[] = [
  {
    id: "set_basics",
    code: "M10.1",
    title: "Khái niệm tập hợp",
    shortLabel: "Tập hợp cơ bản",
    tutorHint: "Nhắc lại ký hiệu tập hợp, tập rỗng và tập số tự nhiên.",
  },
  {
    id: "set_operations",
    code: "M10.2",
    title: "Phép toán tập hợp và khoảng",
    shortLabel: "Phép toán tập hợp",
    tutorHint: "Ưu tiên giao, hợp và đổi điều kiện sang khoảng hoặc đoạn.",
  },
  {
    id: "quadratic_basics",
    code: "M10.3",
    title: "Hàm số bậc hai cơ bản",
    shortLabel: "Hàm bậc hai",
    tutorHint: "Tập trung vào dạng tổng quát, đỉnh parabol và vai trò của hệ số.",
  },
];

export const DIAGNOSTIC_QUESTIONS: Question[] = [
  {
    id: "q1",
    competencyId: "set_basics",
    question: "Cho A = {x ∈ N | x < 5}. Cách viết nào đúng?",
    options: [
      "A = {0; 1; 2; 3; 4; 5}",
      "A = {1; 2; 3; 4}",
      "A = {0; 1; 2; 3; 4}",
      "A = {1; 2; 3; 4; 5}",
    ],
    correctAnswer: "A = {0; 1; 2; 3; 4}",
    explanation: "Tập N bao gồm cả 0 nên phương án đúng là {0; 1; 2; 3; 4}.",
  },
  {
    id: "q2",
    competencyId: "set_basics",
    question: "Ký hiệu nào biểu diễn tập hợp rỗng?",
    options: ["{0}", "∅", "{∅}", "N"],
    correctAnswer: "∅",
    explanation: "Tập rỗng là tập hợp không có phần tử nào và ký hiệu là ∅.",
  },
  {
    id: "q3",
    competencyId: "set_operations",
    question: "Cho A = {1; 2; 3} và B = {2; 3; 4}. Giao của A và B là:",
    options: ["{1; 2; 3; 4}", "{2; 3}", "{1; 4}", "{2}"],
    correctAnswer: "{2; 3}",
    explanation: "Giao là phần tử xuất hiện đồng thời trong cả hai tập.",
  },
  {
    id: "q4",
    competencyId: "set_operations",
    question: "Cho A = {x ∈ R | 1 < x ≤ 5}. Viết A dưới dạng khoảng hoặc đoạn.",
    options: ["[1; 5]", "(1; 5]", "(1; 5)", "[1; 5)"],
    correctAnswer: "(1; 5]",
    explanation: "x > 1 dùng ngoặc tròn, x ≤ 5 dùng ngoặc vuông.",
  },
  {
    id: "q5",
    competencyId: "quadratic_basics",
    question: "Hàm số nào sau đây là hàm số bậc hai?",
    options: ["y = 2x + 1", "y = x² - 3x + 2", "y = 1/x", "y = √x"],
    correctAnswer: "y = x² - 3x + 2",
    explanation: "Hàm số bậc hai có dạng y = ax² + bx + c với a khác 0.",
  },
  {
    id: "q6",
    competencyId: "quadratic_basics",
    question: "Với y = x² - 2x + 3, hoành độ đỉnh của parabol là:",
    options: ["-1", "0", "1", "2"],
    correctAnswer: "1",
    explanation: "Hoành độ đỉnh bằng -b / (2a) = 1.",
  },
];

export const DEMO_SCENARIOS: Array<{
  id: DemoScenarioId;
  title: string;
  description: string;
}> = [
  {
    id: "set-operations",
    title: "Kịch bản A",
    description: "Minh yếu ở phép toán tập hợp nên current goal chuyển sang M10.2.",
  },
  {
    id: "quadratic-basics",
    title: "Kịch bản B",
    description: "Minh yếu ở hàm bậc hai nên current goal chuyển sang M10.3.",
  },
];

function normalizeAnswer(value: string): string {
  return value.trim().toLowerCase();
}

function getCompetencyDefinition(id: CompetencyId): CompetencyDefinition {
  return COMPETENCIES.find((item) => item.id === id) ?? COMPETENCIES[0];
}

function levelFromScore(score: number): MasteryLevel {
  if (score < 0.4) {
    return "weak";
  }

  if (score < 0.8) {
    return "average";
  }

  return "strong";
}

function masteryLabel(level: MasteryLevel): string {
  if (level === "weak") {
    return "Yếu";
  }

  if (level === "average") {
    return "Trung bình";
  }

  return "Khá";
}

function buildCoachNote(recommended: CompetencyDefinition, level: MasteryLevel): string {
  if (level === "weak") {
    return `Lumiq AI đề xuất Minh dồn lực cho ${recommended.shortLabel.toLowerCase()} trong 3 buổi tới để xử lý đúng lỗ hổng quan trọng nhất trước giữa kỳ.`;
  }

  return `Minh đã có nền tương đối ổn, nhưng vẫn nên ưu tiên ${recommended.shortLabel.toLowerCase()} để chuyển từ hiểu mơ hồ sang làm chủ chắc tay.`;
}

export function calculateAssessmentReport(
  answers: Record<string, string>,
  learner: LearnerProfile = SEEDED_LEARNER,
): AssessmentReport {
  const grouped = new Map<CompetencyId, { correct: number; total: number }>();

  for (const competency of COMPETENCIES) {
    grouped.set(competency.id, { correct: 0, total: 0 });
  }

  for (const question of DIAGNOSTIC_QUESTIONS) {
    const bucket = grouped.get(question.competencyId);

    if (!bucket) {
      continue;
    }

    bucket.total += 1;

    if (normalizeAnswer(answers[question.id] ?? "") === normalizeAnswer(question.correctAnswer)) {
      bucket.correct += 1;
    }
  }

  const results = COMPETENCIES.map((competency) => {
    const bucket = grouped.get(competency.id) ?? { correct: 0, total: 1 };
    const score = bucket.total === 0 ? 0 : bucket.correct / bucket.total;
    const level = levelFromScore(score);

    return {
      competencyId: competency.id,
      title: competency.title,
      code: competency.code,
      correct: bucket.correct,
      total: bucket.total,
      score,
      level,
      explanation: competency.tutorHint,
    };
  });

  const sorted = [...results].sort((left, right) => left.score - right.score);
  const weakest = sorted[0];
  const strongest = sorted[sorted.length - 1];
  const recommended = getCompetencyDefinition(weakest.competencyId);

  return {
    learner,
    results,
    recommendedCompetencyId: weakest.competencyId,
    weakestCompetencyId: weakest.competencyId,
    strongestCompetencyId: strongest.competencyId,
    summary: `${learner.name} đang chắc hơn ở ${strongest.title.toLowerCase()}, nhưng cần ưu tiên ${recommended.shortLabel.toLowerCase()} để học đúng trọng tâm.`,
    coachNote: buildCoachNote(recommended, weakest.level),
    generatedAt: new Date().toISOString(),
  };
}

export function buildScenarioReport(id: DemoScenarioId): AssessmentReport {
  const answers = DIAGNOSTIC_QUESTIONS.reduce<Record<string, string>>((map, question) => {
    map[question.id] = question.correctAnswer;
    return map;
  }, {});

  if (id === "set-operations") {
    answers.q3 = "{1; 2; 3; 4}";
    answers.q4 = "[1; 5]";
  }

  if (id === "quadratic-basics") {
    answers.q5 = "y = 2x + 1";
    answers.q6 = "2";
  }

  return {
    ...calculateAssessmentReport(answers),
    demoScenarioId: id,
  };
}

export function buildLearningNodes(report: AssessmentReport): LearningNode[] {
  return COMPETENCIES.map((competency) => {
    const result = report.results.find((item) => item.competencyId === competency.id);
    const mastery = result?.score ?? 0;
    const isCurrentGoal = competency.id === report.recommendedCompetencyId;

    let status: LearningNode["status"] = "available";

    if (isCurrentGoal) {
      status = "active";
    } else if ((result?.level ?? "weak") === "strong") {
      status = "completed";
    }

    return {
      id: competency.id,
      code: competency.code,
      title: competency.title,
      shortLabel: competency.shortLabel,
      mastery,
      status,
      isCurrentGoal,
      description: competency.tutorHint,
      recommendedAction: isCurrentGoal
        ? "Ôn lại khái niệm, làm 2 ví dụ mẫu và hỏi tutor nếu còn vướng."
        : status === "completed"
          ? "Giữ nhịp bằng 1 bài ôn nhanh để không rơi kiến thức."
          : "Để dành sau khi khóa xong mục tiêu hiện tại.",
    };
  }).sort((left, right) => {
    if (left.isCurrentGoal) {
      return -1;
    }

    if (right.isCurrentGoal) {
      return 1;
    }

    return left.mastery - right.mastery;
  });
}

type LearnerContextNode = Pick<LearningNode, "title" | "recommendedAction">;

export function buildLearnerContext(report: AssessmentReport, activeNode?: LearnerContextNode) {
  const weakest = getCompetencyDefinition(report.weakestCompetencyId);
  const focus = activeNode ?? buildLearningNodes(report)[0];

  return {
    learnerName: report.learner.name,
    learnerGrade: report.learner.grade,
    learnerTarget: report.learner.target,
    shortGoal: report.learner.shortGoal,
    weakArea: weakest.title,
    activeTopic: focus.title,
    recommendedAction: focus.recommendedAction,
  };
}

export function getMasteryLabel(level: MasteryLevel): string {
  return masteryLabel(level);
}
