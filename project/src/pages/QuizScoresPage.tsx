import React from 'react';
import { useCourse } from '../context/CourseContext';
import { useNavigate } from 'react-router-dom';
import { BarChart3, TrendingUp, Award, AlertCircle } from 'lucide-react';
import ScoreChart from '../components/ScoreChart';

const QuizScoresPage: React.FC = () => {
  const { course, quizAttempts } = useCourse();
  const navigate = useNavigate();

  if (!course) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <BarChart3 className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">No Quiz Data Available</h1>
          <p className="text-xl text-gray-600 mb-8">
            Complete some quizzes to see your performance analytics here.
          </p>
          <button
            onClick={() => navigate('/generate')}
            className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-300"
          >
            <span>Start Learning</span>
          </button>
        </div>
      </div>
    );
  }

  const getOverallStats = () => {
    const completedQuizzes = course.subtopics.filter(s => s.quizPassed).length;
    const totalQuizzes = course.subtopics.length + (course.finalQuizCompleted ? 1 : 0);
    const averageScore = quizAttempts.length > 0 
      ? quizAttempts.reduce((sum, attempt) => sum + attempt.score, 0) / quizAttempts.length 
      : 0;

    return {
      completedQuizzes,
      totalQuizzes,
      averageScore: Math.round(averageScore),
      totalAttempts: quizAttempts.length
    };
  };

  const stats = getOverallStats();

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <BarChart3 className="h-8 w-8 text-white" />
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Quiz Scores & Analytics</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Track your progress and identify areas for improvement in {course.topic}.
        </p>
      </div>

      {/* Overall Stats */}
      <div className="grid md:grid-cols-4 gap-6 mb-12">
        <div className="bg-white p-6 rounded-2xl shadow-lg">
          <div className="flex items-center space-x-3 mb-2">
            <Award className="h-6 w-6 text-green-500" />
            <span className="text-sm font-medium text-gray-600">Completed</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">
            {stats.completedQuizzes}/{stats.totalQuizzes}
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-lg">
          <div className="flex items-center space-x-3 mb-2">
            <TrendingUp className="h-6 w-6 text-blue-500" />
            <span className="text-sm font-medium text-gray-600">Average Score</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">
            {stats.averageScore}%
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-lg">
          <div className="flex items-center space-x-3 mb-2">
            <BarChart3 className="h-6 w-6 text-purple-500" />
            <span className="text-sm font-medium text-gray-600">Total Attempts</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">
            {stats.totalAttempts}
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-lg">
          <div className="flex items-center space-x-3 mb-2">
            <AlertCircle className="h-6 w-6 text-orange-500" />
            <span className="text-sm font-medium text-gray-600">Success Rate</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">
            {stats.totalQuizzes > 0 ? Math.round((stats.completedQuizzes / stats.totalQuizzes) * 100) : 0}%
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid lg:grid-cols-2 gap-8 mb-12">
        <div className="bg-white p-6 rounded-2xl shadow-lg">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Subtopic Performance</h3>
          <ScoreChart
            data={course.subtopics.map((subtopic, index) => ({
              name: subtopic.name,
              passed: subtopic.quizPassed,
              attempts: quizAttempts.filter(a => a.subtopicIndex === index).length
            }))}
          />
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-lg">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Recent Attempts</h3>
          <div className="space-y-4">
            {quizAttempts.slice(-5).reverse().map((attempt, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div>
                  <span className="font-medium text-gray-900">
                    {attempt.subtopicIndex !== undefined 
                      ? course.subtopics[attempt.subtopicIndex]?.name 
                      : 'Final Quiz'}
                  </span>
                  <p className="text-sm text-gray-500">
                    {new Date(attempt.timestamp).toLocaleDateString()}
                  </p>
                </div>
                <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                  attempt.passed 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {attempt.score}% {attempt.passed ? '✓' : '✗'}
                </div>
              </div>
            ))}
            
            {quizAttempts.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No quiz attempts yet. Complete some quizzes to see your history!
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Incorrect Questions Review */}
      {quizAttempts.some(a => a.incorrectQuestions && a.incorrectQuestions.length > 0) && (
        <div className="bg-white p-6 rounded-2xl shadow-lg">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Review Incorrect Questions</h3>
          <div className="space-y-6">
            {quizAttempts
              .filter(a => a.incorrectQuestions && a.incorrectQuestions.length > 0)
              .slice(-3)
              .map((attempt, attemptIndex) => (
                <div key={attemptIndex}>
                  <h4 className="font-semibold text-gray-800 mb-4">
                    {attempt.subtopicIndex !== undefined 
                      ? course.subtopics[attempt.subtopicIndex]?.name 
                      : 'Final Quiz'} - Recent Mistakes
                  </h4>
                  <div className="space-y-4">
                    {attempt.incorrectQuestions?.map((q, qIndex) => (
                      <div key={qIndex} className="p-4 bg-red-50 rounded-xl border-l-4 border-red-400">
                        <p className="font-medium text-gray-900 mb-2">{q.question}</p>
                        <div className="grid md:grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-red-600 font-medium">Your Answer: </span>
                            <span className="text-red-700">{q.userAnswer}</span>
                          </div>
                          <div>
                            <span className="text-green-600 font-medium">Correct Answer: </span>
                            <span className="text-green-700">{q.correctAnswer}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default QuizScoresPage;