// Basic ML-like analytics (heuristics) to compute metrics and simple recommendations.
// This is a placeholder for future true ML models. It computes useful aggregates now.

function calculateStdDev(values) {
  if (!values || values.length === 0) return 0;
  const mean = values.reduce((a, b) => a + b, 0) / values.length;
  const variance =
    values.reduce((acc, v) => acc + Math.pow(v - mean, 2), 0) / values.length;
  return Math.sqrt(variance);
}

class MLAnalysisService {
  analyzeAttempts(attempts) {
    if (!attempts || attempts.length === 0) {
      return {
        totalAttempts: 0,
        avgAccuracy: 0,
        avgSpeedQpm: 0,
        commonWeakAreas: [],
      };
    }

    let totalAccuracy = 0;
    let totalSpeed = 0;
    const weakAreasCount = {};

    attempts.forEach((attempt) => {
      const questions = attempt.questions || [];
      const correct = questions.filter((q) => q.isCorrect).length;
      const accuracy = questions.length > 0 ? correct / questions.length : 0;
      totalAccuracy += accuracy;

      const totalTime = (attempt.totalTimeSeconds || 0);
      const speed = totalTime > 0 ? (questions.length / (totalTime / 60)) : 0; // q per minute
      totalSpeed += speed;

      questions.forEach((q) => {
        if (!q.isCorrect) {
          const key = `${q.questionType}:${q.complexity}`;
          weakAreasCount[key] = (weakAreasCount[key] || 0) + 1;
        }
      });
    });

    const avgAccuracy = totalAccuracy / attempts.length;
    const avgSpeedQpm = totalSpeed / attempts.length;

    const commonWeakAreas = Object.entries(weakAreasCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([key]) => key);

    return {
      totalAttempts: attempts.length,
      avgAccuracy,
      avgSpeedQpm,
      commonWeakAreas,
    };
  }

  generateRecommendations(attempts) {
    const aggs = this.analyzeAttempts(attempts);
    const recs = [];

    if (aggs.avgAccuracy < 0.6) {
      recs.push("Focus on foundational topics and medium-difficulty questions.");
    } else if (aggs.avgAccuracy < 0.8) {
      recs.push("Gradually increase difficulty; practice timed quizzes.");
    } else {
      recs.push("Attempt harder questions to improve mastery under time constraints.");
    }

    if (aggs.avgSpeedQpm < 0.5) {
      recs.push("Practice speed drills; allocate time per question and move on if stuck.");
    }

    if (aggs.commonWeakAreas.length > 0) {
      recs.push(`Work on weak areas: ${aggs.commonWeakAreas.join(", ")}.`);
    }

    return {
      recommendations: recs,
    };
  }

  predictNextDifficulty(attempts) {
    const aggs = this.analyzeAttempts(attempts);
    let nextDifficulty = "medium";
    if (aggs.avgAccuracy > 0.85 && aggs.avgSpeedQpm > 0.8) nextDifficulty = "hard";
    else if (aggs.avgAccuracy < 0.6) nextDifficulty = "easy";
    return {
      nextTestDifficulty: nextDifficulty,
      confidence: 0.6,
    };
  }
}

module.exports = new MLAnalysisService();


