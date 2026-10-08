export const EXAM_QUESTIONS = 25;
export const EXAM_MINUTES = 30;
export const POINTS_PER_ANSWER = 4;
export const PASS_SCORE = 80;

export function scoreExam(correct) {
  const score = correct * POINTS_PER_ANSWER;
  return { score, passed: score >= PASS_SCORE };
}
