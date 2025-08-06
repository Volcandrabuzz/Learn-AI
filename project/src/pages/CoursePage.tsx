import React, { useState } from 'react';
import { useCourse } from '../context/CourseContext';
import { useNavigate } from 'react-router-dom';
import { GraduationCap, Package, ArrowRight, RotateCcw } from 'lucide-react';
import QuizComponent from '../components/QuizComponent';

const CoursePage: React.FC = () => {
  const { course, updateCourse } = useCourse();
  const navigate = useNavigate();
  const [showQuiz, setShowQuiz] = useState(false);
  const [showFinalQuiz, setShowFinalQuiz] = useState(false);

  if (!course) {
    navigate('/generate');
    return null;
  }

  const currentSubtopic = course.subtopics[course.currentSubtopic];
  const allSubtopicsCompleted = course.subtopics.every(s => s.completed && s.quizPassed);

  const handleQuizPass = (score: number) => {
    if (showFinalQuiz) {
      updateCourse({
        ...course,
        finalQuizCompleted: true
      });
      setShowFinalQuiz(false);
      return;
    }

    const updatedSubtopics = [...course.subtopics];
    updatedSubtopics[course.currentSubtopic] = {
      ...updatedSubtopics[course.currentSubtopic],
      quizPassed: true
    };

    updateCourse({
      ...course,
      subtopics: updatedSubtopics
    });
    setShowQuiz(false);
  };

  const handleQuizFail = () => {
    setShowQuiz(false);
  };

  const handleNextSubtopic = () => {
    if (course.currentSubtopic < course.subtopics.length - 1) {
      updateCourse({
        ...course,
        currentSubtopic: course.currentSubtopic + 1
      });
    }
  };

  const markSubtopicComplete = () => {
    const updatedSubtopics = [...course.subtopics];
    updatedSubtopics[course.currentSubtopic] = {
      ...updatedSubtopics[course.currentSubtopic],
      completed: true
    };

    updateCourse({
      ...course,
      subtopics: updatedSubtopics
    });
    setShowQuiz(true);
  };

  const handleLearnMore = () => {
    navigate('/generate');
  };

  if (course.finalQuizCompleted) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <div className="w-24 h-24 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-8">
            <GraduationCap className="h-12 w-12 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Congratulations! 🎉
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            You've successfully completed the course on {course.topic}!
          </p>
          <button
            onClick={handleLearnMore}
            className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-4 rounded-2xl text-lg font-semibold hover:from-blue-600 hover:to-purple-700 transform hover:scale-105 transition-all duration-300"
          >
            <span>Let's Learn More</span>
            <ArrowRight className="h-5 w-5" />
          </button>
        </div>
      </div>
    );
  }

  if (showFinalQuiz) {
    return (
      <QuizComponent
        questions={course.finalQuiz}
        onPass={handleQuizPass}
        onFail={handleQuizFail}
        passingScore={15}
        title={`Final Quiz: ${course.topic}`}
        showRetakeOption={true}
      />
    );
  }

  if (showQuiz) {
    return (
      <QuizComponent
        questions={currentSubtopic.quiz}
        onPass={handleQuizPass}
        onFail={handleQuizFail}
        passingScore={8}
        title={`Quiz: ${currentSubtopic.name}`}
        showRetakeOption={true}
        allowRelearn={() => {
          setShowQuiz(false);
        }}
      />
    );
  }

  if (allSubtopicsCompleted && !course.finalQuizCompleted) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <div className="w-20 h-20 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-8">
            <GraduationCap className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Ready for the Final Challenge?
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            You've completed all subtopics! Time for the final comprehensive quiz.
          </p>
          <button
            onClick={() => setShowFinalQuiz(true)}
            className="inline-flex items-center space-x-2 bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-8 py-4 rounded-2xl text-lg font-semibold hover:from-yellow-600 hover:to-orange-600 transform hover:scale-105 transition-all duration-300"
          >
            <span>Take Final Quiz</span>
            <ArrowRight className="h-5 w-5" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Topic Introduction */}
      {course.currentSubtopic === 0 && (
        <>
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-3xl p-8 mb-8 text-white">
            <div className="flex items-center space-x-3 mb-4">
              <Package className="h-8 w-8" />
              <h2 className="text-2xl font-bold">Course Introduction</h2>
            </div>
            <p className="text-lg leading-relaxed opacity-90">
              {course.topicIntro}
            </p>
          </div>

          <div className="bg-gradient-to-r from-green-500 to-teal-500 rounded-3xl p-8 mb-8 text-white">
            <div className="flex items-center space-x-3 mb-4">
              <GraduationCap className="h-8 w-8" />
              <h2 className="text-2xl font-bold">Real-Life Example</h2>
            </div>
            <p className="text-lg leading-relaxed opacity-90">
              {course.realLifeExample}
            </p>
          </div>
        </>
      )}

      {/* Current Subtopic */}
      <div className="bg-white rounded-3xl shadow-xl p-8 mb-8">
        <div className="flex items-center space-x-3 mb-6">
          <GraduationCap className="h-8 w-8 text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-900">
            {currentSubtopic.name}
          </h1>
          <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
            {course.currentSubtopic + 1} of {course.subtopics.length}
          </span>
        </div>
        
        <div className="prose prose-lg max-w-none mb-8">
          <div 
            className="text-gray-700 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: currentSubtopic.explanation }}
          />
        </div>

        {!currentSubtopic.completed ? (
          <button
            onClick={markSubtopicComplete}
            className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-4 rounded-2xl text-lg font-semibold hover:from-blue-600 hover:to-purple-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            <span>Complete Section & Take Quiz</span>
            <ArrowRight className="h-5 w-5" />
          </button>
        ) : currentSubtopic.quizPassed ? (
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-green-600">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-green-600 font-bold">✓</span>
              </div>
              <span className="font-semibold text-lg">Section Completed!</span>
            </div>
            
            {course.currentSubtopic < course.subtopics.length - 1 && (
              <button
                onClick={handleNextSubtopic}
                className="inline-flex items-center space-x-2 bg-gradient-to-r from-green-500 to-blue-500 text-white px-8 py-4 rounded-2xl text-lg font-semibold hover:from-green-600 hover:to-blue-600 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                <span>Next Section</span>
                <ArrowRight className="h-5 w-5" />
              </button>
            )}
          </div>
        ) : (
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setShowQuiz(true)}
              className="inline-flex items-center space-x-2 bg-gradient-to-r from-orange-500 to-red-500 text-white px-8 py-4 rounded-2xl text-lg font-semibold hover:from-orange-600 hover:to-red-600 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              <RotateCcw className="h-5 w-5" />
              <span>Retake Quiz</span>
            </button>
            <div className="text-center">
              <span className="text-red-600 font-medium">Quiz not passed</span>
              <p className="text-sm text-gray-500">Need 8/10 correct to proceed</p>
            </div>
          </div>
        )}
      </div>

      {/* Progress Bar */}
      <div className="bg-white rounded-2xl p-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">Course Progress</span>
          <span className="text-sm text-gray-500">
            {course.subtopics.filter(s => s.completed && s.quizPassed).length} / {course.subtopics.length}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div
            className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full transition-all duration-500"
            style={{
              width: `${(course.subtopics.filter(s => s.completed && s.quizPassed).length / course.subtopics.length) * 100}%`
            }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default CoursePage;