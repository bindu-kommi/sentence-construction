import React from 'react';

function Feedback({ questions, userAnswers, score }) {
  return (
    <div className="bg-gray-100 min-h-screen py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-semibold mb-4">Feedback</h2>
        <p className="text-lg mb-4">Your Score: <span className="font-bold">{score} / {questions.length}</span></p>

        <ul>
          {questions.map((question, index) => (
            <li key={question.id} className="mb-4 p-4 border rounded">
              <p className="font-semibold">Question {index + 1}:</p>
              <p className="text-gray-700">
                {question.sentence.split('___').map((part, i) => (
                  <React.Fragment key={i}>
                    {part}
                    {i < question.blanks.length && (
                      <span
                        className={`font-semibold ${
                          userAnswers[index]?.[i] === question.correctAnswers[i]
                            ? 'text-green-500'
                            : userAnswers[index]?.[i] !== null
                            ? 'text-red-500'
                            : ''
                        }`}
                      >
                        {userAnswers[index]?.[i] !== null ? userAnswers[index][i] : '___'}
                      </span>
                    )}
                  </React.Fragment>
                ))}
              </p>

              <p className="mt-2">
                Correct Answers:{' '}
                {question.correctAnswers.map((correctAnswer, i) => (
                  <span key={i} className="font-semibold text-green-600">
                    {correctAnswer}
                    {i < question.correctAnswers.length - 1 && ', '}
                  </span>
                ))}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Feedback;