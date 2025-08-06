import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Minus, BookOpen, Sparkles } from 'lucide-react';
import { useCourse } from '../context/CourseContext';
import LoadingSpinner from '../components/LoadingSpinner';

const GenerateCoursePage: React.FC = () => {
  const [topic, setTopic] = useState('');
  const [subtopics, setSubtopics] = useState(['']);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState('');
  const { setCourse } = useCourse();
  const navigate = useNavigate();

  const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
  const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

  const generateCourseWithGemini = async (topic: string, subtopics: string[]) => {
    const filteredSubtopics = subtopics.filter(s => s.trim());
    
    const prompt = `You are an expert educational content creator. Generate a comprehensive course structure in JSON format for the topic "${topic}" with the following subtopics: ${filteredSubtopics.join(', ')}.

The response must be a valid JSON object with the following exact structure:

{
  "topic": "${topic}",
  "topicIntro": "A comprehensive 3-4 sentence introduction to the topic explaining what students will learn, key concepts they'll master, practical skills they'll develop, and real-world applications they'll understand",
  "realLifeExample": "A detailed practical real-world example (3-4 sentences) showing how this topic applies in daily life, professional contexts, or current industry trends with specific scenarios",
  "subtopics": [
    {
      "id": 1,
      "name": "subtopic name",
      "explanation": "Comprehensive HTML explanation with proper Tailwind CSS styling. Must include: 1) Core Concept section (4-5 paragraphs explaining fundamental principles with examples), 2) Key Principles section (3-4 detailed bullet points with explanations), 3) Practical Applications section (4-5 real-world examples with context), 4) Why It Matters section (2-3 paragraphs on importance and relevance), 5) Common Challenges section (2-3 paragraphs on typical difficulties and how to overcome them). Use div containers with classes like 'bg-blue-50 p-6 rounded-xl border-l-4 border-blue-500 mb-6', include emoji icons in headings (🎯, 🔍, 💡, 🚀, ⚠️), and ensure content is detailed and educational",
      "flashcardPoints": [
        "8 specific flashcard points that comprehensively summarize key concepts from this subtopic",
        "Each point should be detailed but concise (2-3 sentences each)",
        "Cover definitions, principles, applications, relationships, important facts, common misconceptions, key formulas/methods, and practical tips"
      ],
      "quiz": [
        {
          "id": 1,
          "type": "mcq",
          "question": "Relevant multiple choice question testing understanding",
          "options": ["4 comprehensive options with one clearly correct answer"],
          "answer": "The correct answer exactly as written in options"
        },
        {
          "id": 2,
          "type": "text",
          "question": "Fill-in-the-blank or short answer question (design for 1-2 word answers only)",
          "answer": "Expected 1-2 word answer for exact matching"
        }
        // Continue for 12 total questions (mix of mcq and text, with text questions at positions 3, 6, 9, 12)
      ],
      "completed": false,
      "quizPassed": false
    }
    // Repeat for each subtopic with incremental ids
  ],
  "finalQuiz": [
    // 25 comprehensive questions covering all subtopics
    // Questions 5, 10, 15, 20, 25 should be "text" type (1-2 word answers), others "mcq"
    // Each question should test deep understanding across different subtopics
    // MCQ questions need 4 detailed options with one correct answer
    // Text questions should be fill-in-the-blank or require single concept answers
  ],
  "currentSubtopic": 0,
  "finalQuizCompleted": false
}

CRITICAL REQUIREMENTS:
1. The explanation field must contain extensive, detailed HTML content with proper Tailwind CSS classes
2. Each subtopic explanation should be substantial (equivalent to 2-3 pages of text when rendered)
3. Use multiple div containers with appropriate background colors, spacing, and styling
4. Include comprehensive sections: Core Concept, Key Principles, Practical Applications, Why It Matters, Common Challenges
5. Add emoji icons in headings for visual appeal (🎯, 🔍, 💡, 🚀, ⚠️, 📊, 🔧, 💪)
6. Each subtopic needs exactly 8 detailed flashcard points
7. Each subtopic needs exactly 12 quiz questions (mcq at most positions, text at positions 3, 6, 9, 12)
8. Final quiz needs exactly 25 questions (text questions only at positions 5, 10, 15, 20, 25)
9. All MCQ questions must have exactly 4 comprehensive options
10. ALL TEXT-TYPE QUESTIONS must be designed for 1-2 word answers only (fill-in-the-blank, single concepts, names, terms)
11. Text question answers should be simple terms that can be matched exactly (no sentences or explanations)
12. Make content highly educational, academically rigorous, and engaging
13. Ensure JSON is valid and properly escaped
14. Include practical examples, case studies, and real-world connections throughout

EXAMPLES OF GOOD TEXT QUESTIONS:
- "The primary programming language for Android development is ____" (Answer: "Java" or "Kotlin")
- "Machine learning algorithm that mimics neural networks: ____" (Answer: "Neural Networks")
- "The capital of France is ____" (Answer: "Paris")

AVOID THESE TEXT QUESTION TYPES:
- Questions requiring explanations or sentences
- Questions with multiple possible correct answers
- Questions requiring subjective responses

Generate comprehensive, detailed educational content that would be suitable for an advanced structured learning course. Focus on depth, practical applications, academic rigor, and progressive learning while ensuring text answers are simple and exact-matchable.`;

    try {
      const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: prompt
                }
              ]
            }
          ],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 8192,
          }
        })
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      
      if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
        throw new Error('Invalid response structure from Gemini API');
      }

      const generatedText = data.candidates[0].content.parts[0].text;
      
      // Extract JSON from the response (in case there's additional text)
      const jsonMatch = generatedText.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No valid JSON found in response');
      }

      const courseData = JSON.parse(jsonMatch[0]);
      
      // Validate the structure
      if (!courseData.topic || !courseData.subtopics || !Array.isArray(courseData.subtopics)) {
        throw new Error('Invalid course data structure');
      }

      return courseData;

    } catch (error) {
      console.error('Gemini API Error:', error);
      throw error;
    }
  };

  const addSubtopic = () => {
    setSubtopics([...subtopics, '']);
  };

  const removeSubtopic = (index: number) => {
    if (subtopics.length > 1) {
      setSubtopics(subtopics.filter((_, i) => i !== index));
    }
  };

  const updateSubtopic = (index: number, value: string) => {
    const updated = [...subtopics];
    updated[index] = value;
    setSubtopics(updated);
  };

  const generateCourse = async () => {
    if (!topic.trim() || subtopics.every(s => !s.trim())) return;

    if (!GEMINI_API_KEY) {
      setError('Please add your Gemini API key to use this feature.');
      return;
    }

    setIsGenerating(true);
    setError('');
    
    try {
      const courseData = await generateCourseWithGemini(topic, subtopics);
      setCourse(courseData);
      navigate('/course');
    } catch (error) {
      console.error('Course generation failed:', error);
      setError('Failed to generate course. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  if (isGenerating) {
    return <LoadingSpinner message="Generating Comprehensive Course with AI..." />;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <BookOpen className="h-8 w-8 text-white" />
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Generate Your Course</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Create a comprehensive, detailed learning experience with in-depth content tailored to your interests and goals using AI.
        </p>
      </div>

      <div className="bg-white rounded-3xl shadow-xl p-8">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        <div className="space-y-8">
          <div>
            <label className="block text-lg font-semibold text-gray-900 mb-3">
              What topic would you like to learn?
            </label>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g., Machine Learning, History of Art, Python Programming"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-0 text-lg transition-colors duration-200"
            />
          </div>

          <div>
            <label className="block text-lg font-semibold text-gray-900 mb-3">
              Break it down into subtopics
            </label>
            <div className="space-y-3">
              {subtopics.map((subtopic, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <input
                    type="text"
                    value={subtopic}
                    onChange={(e) => updateSubtopic(index, e.target.value)}
                    placeholder={`Subtopic ${index + 1}`}
                    className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-0 transition-colors duration-200"
                  />
                  <button
                    onClick={() => removeSubtopic(index)}
                    disabled={subtopics.length === 1}
                    className="p-3 text-red-500 hover:bg-red-50 rounded-xl transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Minus className="h-5 w-5" />
                  </button>
                </div>
              ))}
            </div>
            <button
              onClick={addSubtopic}
              className="mt-4 flex items-center space-x-2 px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-xl transition-colors duration-200"
            >
              <Plus className="h-5 w-5" />
              <span>Add Unit</span>
            </button>
          </div>

          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-blue-900 mb-2">📚 Enhanced Course Generation</h3>
            <p className="text-blue-800 text-sm mb-2">
              <strong>What you'll get:</strong> Comprehensive course content with detailed explanations, 8 flashcard points per subtopic, 12 quiz questions per subtopic, and a 25-question final exam.
            </p>
            <p className="text-blue-700 text-xs">
              <strong>Note:</strong> Text questions are designed for exact matching with 1-2 word answers.
            </p>
          </div>

          <button
            onClick={generateCourse}
            disabled={!topic.trim() || subtopics.every(s => !s.trim()) || isGenerating}
            className="w-full flex items-center justify-center space-x-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-4 rounded-2xl text-lg font-semibold hover:from-blue-600 hover:to-purple-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            <Sparkles className="h-6 w-6" />
            <span>{isGenerating ? 'Generating Comprehensive Course...' : 'Generate Detailed Course with AI'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default GenerateCoursePage;