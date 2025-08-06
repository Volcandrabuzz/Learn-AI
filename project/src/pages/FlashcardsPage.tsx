import React, { useState, useEffect } from 'react';
import { useCourse } from '../context/CourseContext';
import { useNavigate } from 'react-router-dom';
import { Brain, RotateCcw, ChevronLeft, ChevronRight, ArrowRight, BookOpen, Trash2 } from 'lucide-react';
import FlashcardComponent from '../components/FlashcardComponent';

interface StoredCourse {
  id: string;
  topic: string;
  subtopics: any[];
  createdAt: string;
}

const FlashcardsPage: React.FC = () => {
  const { course } = useCourse();
  const navigate = useNavigate();
  const [allCourses, setAllCourses] = useState<StoredCourse[]>([]);
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
  const [selectedSubtopic, setSelectedSubtopic] = useState<number | null>(null);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);

  // Load stored courses from memory on component mount
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('storedCourses') || '[]');
    setAllCourses(stored);
  }, []);

  // Save current course to storage when it changes
  useEffect(() => {
    if (course) {
      const courseId = `course_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const newStoredCourse: StoredCourse = {
        id: courseId,
        topic: course.topic,
        subtopics: course.subtopics,
        createdAt: new Date().toISOString()
      };

      setAllCourses(prev => {
        // Check if course with same topic already exists
        const existingIndex = prev.findIndex(c => c.topic === course.topic);
        let updated;
        
        if (existingIndex >= 0) {
          // Replace existing course with same topic
          updated = [...prev];
          updated[existingIndex] = newStoredCourse;
        } else {
          // Add new course
          updated = [newStoredCourse, ...prev];
        }
        
        // Store in memory (replacing localStorage for Claude.ai compatibility)
        try {
          localStorage.setItem('storedCourses', JSON.stringify(updated));
        } catch (e) {
          // Fallback for environments where localStorage isn't available
          console.log('Courses stored in memory only');
        }
        
        return updated;
      });

      // Auto-select the new course
      setSelectedCourseId(courseId);
    }
  }, [course]);

  const deleteCourse = (courseId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setAllCourses(prev => {
      const updated = prev.filter(c => c.id !== courseId);
      try {
        localStorage.setItem('storedCourses', JSON.stringify(updated));
      } catch (e) {
        console.log('Updated courses stored in memory only');
      }
      return updated;
    });
    
    if (selectedCourseId === courseId) {
      setSelectedCourseId(null);
      setSelectedSubtopic(null);
      setCurrentCardIndex(0);
    }
  };

  // If no courses exist at all
  if (allCourses.length === 0 && !course) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Brain className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">No Flashcards Available</h1>
          <p className="text-xl text-gray-600 mb-8">
            Generate your first course to start building your flashcard collection.
          </p>
          <button
            onClick={() => navigate('/generate')}
            className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-4 rounded-2xl text-lg font-semibold hover:from-blue-600 hover:to-purple-700 transform hover:scale-105 transition-all duration-300"
          >
            <span>Generate Course</span>
            <ArrowRight className="h-5 w-5" />
          </button>
        </div>
      </div>
    );
  }

  // Course selection view
  if (!selectedCourseId) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Brain className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Memory Flashcards</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            Access flashcards from all your generated courses. Your learning library grows with each course!
          </p>
          
          <div className="flex justify-center mb-8">
            <button
              onClick={() => navigate('/generate')}
              className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-blue-600 hover:to-purple-700 transform hover:scale-105 transition-all duration-300"
            >
              <span>Generate New Course</span>
              <ArrowRight className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Course Library ({allCourses.length} courses)</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {allCourses.map((storedCourse) => {
              const totalFlashcards = storedCourse.subtopics.reduce((sum, subtopic) => sum + subtopic.flashcardPoints.length, 0);
              return (
                <div
                  key={storedCourse.id}
                  onClick={() => setSelectedCourseId(storedCourse.id)}
                  className="group relative p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl cursor-pointer transform hover:scale-105 transition-all duration-300 border-2 border-transparent hover:border-purple-200"
                >
                  <button
                    onClick={(e) => deleteCourse(storedCourse.id, e)}
                    className="absolute top-3 right-3 p-1 text-red-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                  
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                      <BookOpen className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 group-hover:text-purple-600 line-clamp-2">
                        {storedCourse.topic}
                      </h3>
                    </div>
                  </div>
                  
                  <div className="space-y-2 mb-4">
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">{storedCourse.subtopics.length}</span> subtopics
                    </p>
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">{totalFlashcards}</span> flashcards total
                    </p>
                    <p className="text-xs text-gray-500">
                      Created {new Date(storedCourse.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  
                  <div className="flex items-center text-purple-600 font-medium">
                    <span>Study Flashcards</span>
                    <ChevronRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  const selectedCourse = allCourses.find(c => c.id === selectedCourseId);
  if (!selectedCourse) {
    setSelectedCourseId(null);
    return null;
  }

  // Subtopic selection view
  if (selectedSubtopic === null) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => setSelectedCourseId(null)}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ChevronLeft className="h-5 w-5" />
            <span>Back to Courses</span>
          </button>
        </div>

        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Brain className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">{selectedCourse.topic}</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Choose a subtopic to study its flashcards.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {selectedCourse.subtopics.map((subtopic, index) => (
            <div
              key={index}
              onClick={() => setSelectedSubtopic(index)}
              className="group p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl cursor-pointer transform hover:scale-105 transition-all duration-300 border-2 border-transparent hover:border-purple-200"
            >
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center text-white font-bold">
                  {index + 1}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 group-hover:text-purple-600">
                  {subtopic.name}
                </h3>
              </div>
              <p className="text-gray-600 mb-4">
                {subtopic.flashcardPoints.length} flashcards available
              </p>
              <div className="flex items-center text-purple-600 font-medium">
                <span>Study Now</span>
                <ChevronRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const currentSubtopic = selectedCourse.subtopics[selectedSubtopic];
  const totalCards = currentSubtopic.flashcardPoints.length;

  const nextCard = () => {
    setCurrentCardIndex((prev) => (prev + 1) % totalCards);
  };

  const prevCard = () => {
    setCurrentCardIndex((prev) => (prev - 1 + totalCards) % totalCards);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex items-center justify-between mb-8">
        <button
          onClick={() => {
            setSelectedSubtopic(null);
            setCurrentCardIndex(0);
          }}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ChevronLeft className="h-5 w-5" />
          <span>Back to Subtopics</span>
        </button>
        
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">{currentSubtopic.name}</h1>
          <p className="text-gray-600">
            {currentCardIndex + 1} of {totalCards} cards
          </p>
          <p className="text-sm text-gray-500">
            From: {selectedCourse.topic}
          </p>
        </div>

        <button
          onClick={() => setCurrentCardIndex(0)}
          className="flex items-center space-x-2 text-purple-600 hover:text-purple-700 transition-colors"
        >
          <RotateCcw className="h-5 w-5" />
          <span>Restart</span>
        </button>
      </div>

      <div className="mb-8">
        <FlashcardComponent
          frontText={`${currentSubtopic.name} - Concept ${currentCardIndex + 1}`}
          backText={currentSubtopic.flashcardPoints[currentCardIndex]}
        />
      </div>

      <div className="flex items-center justify-between">
        <button
          onClick={prevCard}
          className="flex items-center space-x-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-xl transition-colors"
        >
          <ChevronLeft className="h-5 w-5" />
          <span>Previous</span>
        </button>

        <div className="flex space-x-2">
          {Array.from({ length: totalCards }).map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentCardIndex(index)}
              className={`w-3 h-3 rounded-full transition-colors ${
                index === currentCardIndex
                  ? 'bg-purple-500'
                  : 'bg-gray-300 hover:bg-gray-400'
              }`}
            />
          ))}
        </div>

        <button
          onClick={nextCard}
          className="flex items-center space-x-2 bg-purple-500 hover:bg-purple-600 text-white px-6 py-3 rounded-xl transition-colors"
        >
          <span>Next</span>
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      {/* Progress Bar */}
      <div className="mt-8 bg-gray-200 rounded-full h-2">
        <div
          className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-300"
          style={{ width: `${((currentCardIndex + 1) / totalCards) * 100}%` }}
        />
      </div>
    </div>
  );
};

export default FlashcardsPage;