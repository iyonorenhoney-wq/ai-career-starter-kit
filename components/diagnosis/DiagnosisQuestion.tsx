"use client";

/**
 * 質問画面
 *
 * 出典: docs/01_diagnosis-spec.md §12-14 / docs/08_web-spec.md §39, §42
 *
 * レイアウト:
 *   進捗 → QUESTION 03 / 10 → 質問文 → 回答カード → 前の質問へ
 *
 * 1画面につき1問だけ表示する（01 §13）。
 */

import { AnswerCard } from "@/components/diagnosis/AnswerCard";
import { BackButton } from "@/components/diagnosis/BackButton";
import { ProgressBar } from "@/components/diagnosis/ProgressBar";
import { QuestionCounter } from "@/components/diagnosis/QuestionCounter";
import type { OptionId, Question, QuestionId } from "@/types/diagnosis";

type DiagnosisQuestionProps = {
  question: Question;
  currentNumber: number;
  totalQuestions: number;
  selectedOptionId: OptionId | undefined;
  canGoBack: boolean;
  onAnswer: (questionId: QuestionId, optionId: OptionId) => void;
  onBack: () => void;
};

export function DiagnosisQuestion({
  question,
  currentNumber,
  totalQuestions,
  selectedOptionId,
  canGoBack,
  onAnswer,
  onBack,
}: DiagnosisQuestionProps) {
  const headingId = `question-${question.id}`;

  return (
    <section className="flex flex-col gap-8" aria-labelledby={headingId}>
      <div className="flex flex-col gap-3">
        <ProgressBar current={currentNumber} total={totalQuestions} />
        <QuestionCounter current={currentNumber} total={totalQuestions} />
      </div>

      <h1 id={headingId} className="text-question font-bold">
        {question.question}
      </h1>

      <ul className="flex flex-col gap-3">
        {question.options.map((option) => (
          <li key={option.id}>
            <AnswerCard
              optionId={option.id}
              label={option.label}
              selected={selectedOptionId === option.id}
              onSelect={(optionId) => onAnswer(question.id, optionId)}
            />
          </li>
        ))}
      </ul>

      {canGoBack ? <BackButton onClick={onBack} /> : null}
    </section>
  );
}
