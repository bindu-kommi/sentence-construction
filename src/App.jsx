import React, { useState, useEffect } from "react";
import Question from "./components/Questions";
import Feedback from "./components/Feedback";
import data from "../utils/Questions.json";

function App() {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState(
    Array(10)
      .fill(null)
      .map(() => [])
  ); // Array of arrays for multiple blanks
  const [timer, setTimer] = useState(30);
  const [isTimeUp, setIsTimeUp] = useState(false);
  const [allBlanksFilled, setAllBlanksFilled] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        setQuestions(data);
      } catch (error) {
        console.error("Could not fetch questions:", error);
        // Handle error appropriately (e.g., display an error message to the user)
      }
    };

    fetchQuestions();
  }, []);

  useEffect(() => {
    if (questions.length > 0 && !showFeedback) {
      setTimer(30);
      setIsTimeUp(false);
      const interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [currentQuestionIndex, questions, showFeedback]);

  useEffect(() => {
    if (timer === 0 && !showFeedback) {
      setIsTimeUp(true);
      handleNextQuestion();
    }
  }, [timer, showFeedback]);

  useEffect(() => {
    if (questions.length > 0) {
      const currentBlanksFilled =
        userAnswers[currentQuestionIndex]?.filter((answer) => answer !== null)
          .length === questions[currentQuestionIndex]?.blanks?.length;
      setAllBlanksFilled(currentBlanksFilled);
    }
  }, [userAnswers, currentQuestionIndex, questions]);

  const handleWordSelect = (word, blankIndex) => {
    setUserAnswers((prevAnswers) => {
      const newAnswers = [...prevAnswers];
      const currentAnswers = [...(newAnswers[currentQuestionIndex] || [])];

      // Check if the word is already placed in another blank
      const wordIndexInCurrent = currentAnswers.indexOf(word);
      if (wordIndexInCurrent !== -1) {
        currentAnswers[wordIndexInCurrent] = null; // Unselect from previous position
      }

      currentAnswers[blankIndex] = word;
      newAnswers[currentQuestionIndex] = currentAnswers;
      return newAnswers;
    });
  };

  const handleBlankClick = (blankIndex) => {
    setUserAnswers((prevAnswers) => {
      const newAnswers = [...prevAnswers];
      const currentAnswers = [...(newAnswers[currentQuestionIndex] || [])];
      currentAnswers[blankIndex] = null;
      newAnswers[currentQuestionIndex] = currentAnswers;
      return newAnswers;
    });
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setShowFeedback(true);
    }
  };

  const calculateScore = () => {
    let score = 0;
    questions.forEach((question, index) => {
      const correct =
        JSON.stringify(
          userAnswers[index]?.filter((ans) => ans !== null).sort()
        ) === JSON.stringify(question.correctAnswers.sort());
      if (correct) {
        score++;
      }
    });
    return score;
  };

  if (questions.length === 0) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading questions...
      </div>
    );
  }

  if (showFeedback) {
    return (
      <Feedback
        questions={questions}
        userAnswers={userAnswers}
        score={calculateScore()}
      />
    );
  }

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="bg-gray-100 min-h-screen py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-semibold mb-4">Sentence Construction</h2>
        <p className="text-gray-600 mb-4">
          Complete the sentence by selecting the correct words.
        </p>

        <div className="mb-4">
          <p className="text-lg">
            <span className="font-semibold">
              Question {currentQuestionIndex + 1}
            </span>{" "}
            ({timer} seconds left)
          </p>
        </div>

        <Question
          question={currentQuestion}
          userAnswers={userAnswers[currentQuestionIndex] || []}
          onWordSelect={handleWordSelect}
          onBlankClick={handleBlankClick}
        />

        <div className="mt-6 flex justify-end">
          <button
            onClick={handleNextQuestion}
            className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${
              !allBlanksFilled && !isTimeUp
                ? "opacity-50 cursor-not-allowed"
                : ""
            }`}
            disabled={!allBlanksFilled && !isTimeUp}
          >
            {currentQuestionIndex < questions.length - 1 ? "Next" : "Finish"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
