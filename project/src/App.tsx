import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import LandingPage from './pages/LandingPage';
import GenerateCoursePage from './pages/GenerateCoursePage';
import CoursePage from './pages/CoursePage';
import FlashcardsPage from './pages/FlashcardsPage';
import QuizScoresPage from './pages/QuizScoresPage';
import { CourseProvider } from './context/CourseContext';
import './index.css';

function App() {
  return (
    <CourseProvider>
      <Router>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
          <Header />
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/generate" element={<GenerateCoursePage />} />
            <Route path="/course" element={<CoursePage />} />
            <Route path="/flashcards" element={<FlashcardsPage />} />
            <Route path="/scores" element={<QuizScoresPage />} />
          </Routes>
        </div>
      </Router>
    </CourseProvider>
  );
}

export default App;