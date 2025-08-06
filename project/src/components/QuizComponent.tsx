import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, RefreshCw, BookOpen } from 'lucide-react';
import { useCourse } from '../context/CourseContext';

interface Question {
  id: number;
  type: 'mcq' | 'text';
  question: string;
  options?: string[];
  answer: string;
}

interface QuizComponentProps {
  questions: Question[];
  onPass: (score: number) => void;
  onFail: (score: number) => void;
  passingScore: number;
  title: string;
  showRetakeOption?: boolean;
  allowRelearn?: () => void;
}

const QuizComponent: React.FC<QuizComponentProps> = ({
  questions,
  onPass,
  onFail,
  passingScore,
  title,
  showRetakeOption = false,
  allowRelearn
}) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<number, string>>({});
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30); // 30 seconds per question
  const { addQuizAttempt, course } = useCourse();

  useEffect(() => {
    if (!showResults && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !showResults) {
      handleNextQuestion();
    }
  }, [timeLeft, showResults]);

  const handleAnswer = (questionId: number, answer: string) => {
    setUserAnswers(prev => ({ ...prev, [questionId]: answer }));
  };

  const handleNextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setTimeLeft(30);
    } else {
      calculateScore();
    }
  };

  const calculateScore = () => {
    let correct = 0;
    const incorrectQuestions: Array<{
      question: string;
      userAnswer: string;
      correctAnswer: string;
    }> = [];

    questions.forEach(question => {
      const userAnswer = userAnswers[question.id] || '';
      const isCorrect = userAnswer.toLowerCase().trim() === question.answer.toLowerCase().trim();
      
      if (isCorrect) {
        correct++;
      } else {
        incorrectQuestions.push({
          question: question.question,
          userAnswer: userAnswer || 'No answer',
          correctAnswer: question.answer
        });
      }
    });

    const percentage = Math.round((correct / questions.length) * 100);
    setScore(percentage);
    setShowResults(true);

    // Add quiz attempt to history
    if (course) {
      const isSubtopicQuiz = title.includes('Quiz:');
      const subtopicIndex = isSubtopicQuiz 
        ? course.subtopics.findIndex(s => title.includes(s.name))
        : undefined;

      addQuizAttempt({
        subtopicIndex,
        score: percentage,
        passed: percentage >= passingScore,
        timestamp: Date.now(),
        incorrectQuestions: incorrectQuestions.length > 0 ? incorrectQuestions : undefined
      });
    }

    if (percentage >= passingScore) {
      onPass(percentage);
    } else {
      onFail(percentage);
    }
  };

  const restartQuiz = () => {
    setCurrentQuestion(0);
    setUserAnswers({});
    setShowResults(false);
    setScore(0);
    setTimeLeft(30);
  };

  if (showResults) {
    const passed = score >= passingScore;
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-3xl shadow-xl p-8 text-center">
          <div className={`w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center ${
            passed ? 'bg-green-100' : 'bg-red-100'
          }`}>
            {passed ? (
              <CheckCircle className="h-10 w-10 text-green-500" />
            ) : (
              <XCircle className="h-10 w-10 text-red-500" />
            )}
          </div>
          
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            {passed ? 'Congratulations!' : 'Keep Trying!'}
          </h2>
          
          <p className="text-xl text-gray-600 mb-6">
            You scored <span className={`font-bold ${passed ? 'text-green-600' : 'text-red-600'}`}>
              {score}%
            </span> on this quiz
          </p>
          
          <p className="text-gray-500 mb-8">
            {passed 
              ? `Great job! You passed with ${score}% (needed ${passingScore}% or higher).`
              : `You need ${passingScore}% or higher to pass. You scored ${score}%.`
            }
          </p>

          <div className="flex justify-center space-x-4">
            {!passed && showRetakeOption && (
              <>
                <button
                  onClick={restartQuiz}
                  className="flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-300"
                >
                  <RefreshCw className="h-5 w-5" />
                  <span>Retake Quiz</span>
                </button>
                
                {allowRelearn && (
                  <button
                    onClick={allowRelearn}
                    className="flex items-center space-x-2 bg-gradient-to-r from-green-500 to-teal-500 text-white px-6 py-3 rounded-xl font-semibold hover:from-green-600 hover:to-teal-600 transition-all duration-300"
                  >
                    <BookOpen className="h-5 w-5" />
                    <span>Return to Section</span>
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    );
  }

  const question = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="bg-white rounded-3xl shadow-xl p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
            <p className="text-gray-600">
              Question {currentQuestion + 1} of {questions.length}
            </p>
          </div>
          <div className="text-right">
            <div className={`text-2xl font-bold ${timeLeft <= 10 ? 'text-red-500' : 'text-blue-500'}`}>
              {timeLeft}s
            </div>
            <div className="text-sm text-gray-500">Time left</div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-2 mb-8">
          <div
            className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          ></div>
        </div>

        {/* Question */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            {question.question}
          </h2>

          {question.type === 'mcq' ? (
            <div className="space-y-3">
              {question.options?.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswer(question.id, option)}
                  className={`w-full p-4 text-left rounded-xl border-2 transition-all duration-200 ${
                    userAnswers[question.id] === option
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-4 h-4 rounded-full border-2 ${
                      userAnswers[question.id] === option
                        ? 'border-blue-500 bg-blue-500'
                        : 'border-gray-300'
                    }`}>
                      {userAnswers[question.id] === option && (
                        <div className="w-full h-full rounded-full bg-white scale-50"></div>
                      )}
                    </div>
                    <span>{option}</span>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <textarea
              value={userAnswers[question.id] || ''}
              onChange={(e) => handleAnswer(question.id, e.target.value)}
              placeholder="Type your answer here..."
              className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-0 h-32 resize-none"
            />
          )}
        </div>

        {/* Next Button */}
        <button
          onClick={handleNextQuestion}
          disabled={!userAnswers[question.id]}
          className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-4 rounded-2xl text-lg font-semibold hover:from-blue-600 hover:to-purple-700 transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
        >
          {currentQuestion === questions.length - 1 ? 'Finish Quiz' : 'Next Question'}
        </button>
      </div>
    </div>
  );
};

export default QuizComponent;