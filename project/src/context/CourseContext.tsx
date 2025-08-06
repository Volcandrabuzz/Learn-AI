import React, { createContext, useContext, useState, useEffect } from 'react';

interface Question {
  id: number;
  type: 'mcq' | 'text';
  question: string;
  options?: string[];
  answer: string;
}

interface Subtopic {
  id: number;
  name: string;
  explanation: string;
  flashcardPoints: string[];
  quiz: Question[];
  completed: boolean;
  quizPassed: boolean;
}

interface Course {
  topic: string;
  topicIntro: string;
  realLifeExample: string;
  subtopics: Subtopic[];
  finalQuiz: Question[];
  currentSubtopic: number;
  finalQuizCompleted: boolean;
}

interface QuizAttempt {
  subtopicIndex?: number; // undefined for final quiz
  score: number;
  passed: boolean;
  timestamp: number;
  incorrectQuestions?: Array<{
    question: string;
    userAnswer: string;
    correctAnswer: string;
  }>;
}

interface CourseContextType {
  course: Course | null;
  setCourse: (course: Course | null) => void;
  updateCourse: (course: Course) => void;
  quizAttempts: QuizAttempt[];
  addQuizAttempt: (attempt: QuizAttempt) => void;
  clearCourse: () => void;
}

const CourseContext = createContext<CourseContextType | undefined>(undefined);

export const CourseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [course, setCourseState] = useState<Course | null>(null);
  const [quizAttempts, setQuizAttempts] = useState<QuizAttempt[]>([]);

  // Load data from localStorage on mount
  useEffect(() => {
    const savedCourse = localStorage.getItem('learnai-course');
    const savedAttempts = localStorage.getItem('learnai-quiz-attempts');
    
    if (savedCourse) {
      try {
        setCourseState(JSON.parse(savedCourse));
      } catch (error) {
        console.error('Failed to load course from localStorage:', error);
      }
    }
    
    if (savedAttempts) {
      try {
        setQuizAttempts(JSON.parse(savedAttempts));
      } catch (error) {
        console.error('Failed to load quiz attempts from localStorage:', error);
      }
    }
  }, []);

  // Save course to localStorage whenever it changes
  useEffect(() => {
    if (course) {
      localStorage.setItem('learnai-course', JSON.stringify(course));
    } else {
      localStorage.removeItem('learnai-course');
    }
  }, [course]);

  // Save quiz attempts to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('learnai-quiz-attempts', JSON.stringify(quizAttempts));
  }, [quizAttempts]);

  const setCourse = (newCourse: Course | null) => {
    setCourseState(newCourse);
  };

  const updateCourse = (updatedCourse: Course) => {
    setCourseState(updatedCourse);
  };

  const addQuizAttempt = (attempt: QuizAttempt) => {
    setQuizAttempts(prev => [...prev, attempt]);
  };

  const clearCourse = () => {
    setCourseState(null);
    setQuizAttempts([]);
    localStorage.removeItem('learnai-course');
    localStorage.removeItem('learnai-quiz-attempts');
  };

  return (
    <CourseContext.Provider value={{
      course,
      setCourse,
      updateCourse,
      quizAttempts,
      addQuizAttempt,
      clearCourse
    }}>
      {children}
    </CourseContext.Provider>
  );
};

export const useCourse = (): CourseContextType => {
  const context = useContext(CourseContext);
  if (context === undefined) {
    throw new Error('useCourse must be used within a CourseProvider');
  }
  return context;
};