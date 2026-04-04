export interface Question {
  id: string;
  competencyId: string;
  type: "multiple-choice" | "fill-in-the-blank" | "short-essay";
  question: string;
  options?: string[];
  correctAnswer: string;
  explanation: string;
}

export const DIAGNOSTIC_QUESTIONS: Question[] = [
  {
    id: "q1",
    competencyId: "TOAN10.1",
    type: "multiple-choice",
    question: "Cho tập hợp A = {x ∈ N | x < 5}. Cách viết nào sau đây đúng?",
    options: ["A = {0; 1; 2; 3; 4; 5}", "A = {1; 2; 3; 4}", "A = {0; 1; 2; 3; 4}", "A = {1; 2; 3; 4; 5}"],
    correctAnswer: "A = {0; 1; 2; 3; 4}",
    explanation: "Tập hợp N là tập hợp các số tự nhiên {0, 1, 2, ...}. x < 5 nên x ∈ {0, 1, 2, 3, 4}."
  },
  {
    id: "q2",
    competencyId: "TOAN10.1",
    type: "multiple-choice",
    question: "Tập hợp rỗng được kí hiệu là:",
    options: ["{0}", "∅", "{∅}", "0"],
    correctAnswer: "∅",
    explanation: "Kí hiệu ∅ dùng để chỉ tập hợp không chứa phần tử nào."
  },
  {
    id: "q3",
    competencyId: "TOAN10.2",
    type: "multiple-choice",
    question: "Cho A = {1; 2; 3} và B = {2; 3; 4}. Tập hợp A ∩ B là:",
    options: ["{1; 2; 3; 4}", "{2; 3}", "{1; 4}", "{2}"],
    correctAnswer: "{2; 3}",
    explanation: "Giao của hai tập hợp là tập hợp các phần tử chung của cả hai."
  },
  {
    id: "q4",
    competencyId: "TOAN10.2",
    type: "fill-in-the-blank",
    question: "Cho A = {x ∈ R | 1 < x ≤ 5}. Viết tập hợp A dưới dạng khoảng, đoạn: (Nhập kết quả dạng (a;b] hoặc [a;b]...)",
    correctAnswer: "(1;5]",
    explanation: "x > 1 tương ứng với ngoặc tròn '(', x ≤ 5 tương ứng với ngoặc vuông ']'."
  },
  {
    id: "q5",
    competencyId: "TOAN10.3",
    type: "multiple-choice",
    question: "Bất phương trình nào sau đây là bất phương trình bậc nhất hai ẩn?",
    options: ["2x + 3y > 5", "x^2 + y < 0", "2x - y^2 ≥ 1", "xyz < 1"],
    correctAnswer: "2x + 3y > 5",
    explanation: "Bất phương trình bậc nhất hai ẩn có dạng ax + by < c (hoặc >, ≤, ≥) với a, b không đồng thời bằng 0."
  },
  {
    id: "q6",
    competencyId: "TOAN10.3",
    type: "multiple-choice",
    question: "Cặp số (x; y) = (1; 1) là nghiệm của bất phương trình nào?",
    options: ["x + y < 2", "x - y > 0", "2x + y > 1", "x + 2y ≤ 2"],
    correctAnswer: "2x + y > 1",
    explanation: "Thay x=1, y=1 vào: 2(1) + 1 = 3 > 1 (Đúng)."
  },
  {
    id: "q7",
    competencyId: "TOAN10.5",
    type: "multiple-choice",
    question: "Hàm số nào sau đây là hàm số bậc hai?",
    options: ["y = 2x + 1", "y = x^2 - 3x + 2", "y = 1/x", "y = √x"],
    correctAnswer: "y = x^2 - 3x + 2",
    explanation: "Hàm số bậc hai có dạng y = ax^2 + bx + c (a ≠ 0)."
  },
  {
    id: "q8",
    competencyId: "TOAN10.5",
    type: "fill-in-the-blank",
    question: "Tọa độ đỉnh của parabol y = x^2 - 2x + 3 là (x; y). Nhập giá trị của x:",
    correctAnswer: "1",
    explanation: "Hoành độ đỉnh x = -b / (2a) = -(-2) / (2*1) = 1."
  },
  {
    id: "q9",
    competencyId: "TOAN10.1",
    type: "short-essay",
    question: "Hãy nêu sự khác biệt giữa tập hợp N và N*.",
    correctAnswer: "N chứa số 0, N* không chứa số 0",
    explanation: "N = {0, 1, 2, ...} và N* = {1, 2, 3, ...}."
  },
  {
    id: "q10",
    competencyId: "TOAN10.2",
    type: "multiple-choice",
    question: "Cho A = (-∞; 3] và B = (1; 5]. Tập hợp A ∪ B là:",
    options: ["(1; 3]", "(-∞; 5]", "(3; 5]", "(-∞; 1)"],
    correctAnswer: "(-∞; 5]",
    explanation: "Hợp của hai khoảng/đoạn là lấy tất cả các phần tử thuộc ít nhất một trong hai."
  }
  // ... Adding more to reach 20-25 in a real scenario, but for MVP we use a representative set
];
