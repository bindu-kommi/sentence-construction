import React, { useState } from 'react';

function Question({ question, userAnswers, onWordSelect, onBlankClick }) {
  const [activeBlankIndex, setActiveBlankIndex] = useState(null);
  const sentenceParts = question.sentence.split('___');

  const handleBlankClickLocal = (index) => {
    setActiveBlankIndex(index);
  };

  const handleOptionClick = (option) => {
    if (activeBlankIndex !== null && !userAnswers.includes(option)) {
      onWordSelect(option, activeBlankIndex);
      setActiveBlankIndex(null); // Reset active blank
    }
  };

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-4">
        {sentenceParts.map((part, index) => (
          <React.Fragment key={index}>
            <span>{part}</span>
            {index < question.blanks.length && (
              <button
                className={`bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-1 px-2 rounded focus:outline-none focus:shadow-outline cursor-pointer ${
                  userAnswers[index]
                    ? 'bg-blue-200 hover:bg-blue-300 text-blue-700'
                    : activeBlankIndex === index
                    ? 'border-2 border-blue-500' 
                    : ''
                }`}
                onClick={() => handleBlankClickLocal(index)}
              >
                {userAnswers[index] || question.blanks[index]}
              </button>
            )}
          </React.Fragment>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-4">
        {question.options.map((option, index) => (
          <button
            key={index}
            className={`bg-green-100 hover:bg-green-200 text-green-700 font-semibold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${userAnswers.includes(option) ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
            onClick={() => handleOptionClick(option)}
            disabled={userAnswers.includes(option)}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
}

export default Question;