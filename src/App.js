import React, { useState, useEffect, useRef } from "react";
import "./App.css";

// Sentences for each difficulty level
const sentences = {
  easy: [
    "The cat sat on the mat.",
    "I love to eat pizza.",
    "She reads a book every day.",
    "The sun is shining brightly.",
    "He plays football with his friends.",
    "We went to the park yesterday.",
    "The dog barked at the stranger.",
    "She sings beautifully.",
    "They are going to the market.",
    "The baby is sleeping peacefully.",
  ],
  medium: [
    "The quick brown fox jumps over the lazy dog.",
    "Programming is a valuable skill in today's world.",
    "She enjoys reading novels in her free time.",
    "The weather is perfect for a picnic today.",
    "He decided to take a break and relax for a while.",
    "The teacher explained the concept clearly to the students.",
    "They traveled to Europe during their summer vacation.",
    "The restaurant serves delicious food at reasonable prices.",
    "She completed the project before the deadline.",
    "The movie was so interesting that I watched it twice.",
  ],
  hard: [
    "Artificial intelligence is transforming industries across the globe.",
    "The scientist conducted experiments to test the hypothesis.",
    "Learning a new language requires dedication and consistent practice.",
    "The company announced a new product launch next month.",
    "The marathon runner trained rigorously for the upcoming race.",
    "The government implemented new policies to boost the economy.",
    "The artist created a masterpiece that left everyone in awe.",
    "The engineer designed a revolutionary new system for data analysis.",
    "The professor delivered an insightful lecture on quantum mechanics.",
    "The entrepreneur started a successful business from scratch.",
  ],
};

const App = () => {
  const [paragraph, setParagraph] = useState("");
  const [userInput, setUserInput] = useState("");
  const [timeLeft, setTimeLeft] = useState(30);
  const [isRunning, setIsRunning] = useState(false);
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(0);
  const [highestWpm, setHighestWpm] = useState(0);
  const [highestAccuracy, setHighestAccuracy] = useState(0);
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  const [difficulty, setDifficulty] = useState("easy");

  const textareaRef = useRef(null);

  // Set a random paragraph based on difficulty
  // const setRandomSentence = () => {
  const setRandomSentence = useCallback(() => {
    const randomSentence =
      sentences[difficulty][Math.floor(Math.random() * sentences[difficulty].length)];
    setParagraph(randomSentence);
  };

  // Initialize the first sentence
  // useEffect(() => {
  //   setRandomSentence();
  // }, [difficulty]);

  useEffect(() => {
  setRandomSentence();
  handleSubmit();
}, [setRandomSentence, handleSubmit]); 

  // Start the timer
  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      const timer = setTimeout(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      handleSubmit();
    }
  }, [isRunning, timeLeft]);

  // Handle user input
  const handleInput = (e) => {
    if (!isRunning) setIsRunning(true);
    setUserInput(e.target.value);
  };

  // Calculate WPM and Accuracy
  const calculateResults = () => {
    const wordsTyped = userInput.trim().split(/\s+/).length;
    const timeInMinutes = (30 - timeLeft) / 60;
    const calculatedWpm = Math.round(wordsTyped / timeInMinutes);

    const correctChars = userInput
      .split("")
      .filter((char, i) => char === paragraph[i]).length;
    const calculatedAccuracy = Math.round(
      (correctChars / paragraph.length) * 100
    );

    setWpm(calculatedWpm);
    setAccuracy(calculatedAccuracy);

    // Update highest WPM and Accuracy
    if (calculatedWpm > highestWpm) {
      setHighestWpm(calculatedWpm);
    }
    if (calculatedAccuracy > highestAccuracy) {
      setHighestAccuracy(calculatedAccuracy);
    }
  };

  // Handle submission
  // const handleSubmit = () => {
  const handleSubmit = useCallback(() => {
    setIsRunning(false);
    calculateResults();

    // Reset the test and set a new sentence
    setUserInput("");
    setTimeLeft(30);
    setIsRunning(false);
    setRandomSentence(); // Set a new sentence based on the current difficulty
    textareaRef.current.focus();
  };

  // Toggle theme
  const toggleTheme = () => {
    setIsDarkTheme((prev) => !prev);
  };

  // Change difficulty level
  const handleDifficultyChange = (e) => {
    setDifficulty(e.target.value);
    setUserInput("");
    setTimeLeft(30);
    setIsRunning(false);
    setRandomSentence(); // Set a new sentence based on the new difficulty
    textareaRef.current.focus();
  };

  // Function to highlight incorrect characters
  const renderHighlightedParagraph = () => {
    return paragraph.split("").map((char, index) => {
      let color = "black"; // Default color
      if (index < userInput.length) {
        color = char === userInput[index] ? "green" : "red"; // Green for correct, red for incorrect
      }
      return (
        <span key={index} style={{ color }}>
          {char}
        </span>
      );
    });
  };

  return (
    <div className={`app ${isDarkTheme ? "dark" : "light"}`}>
      {/* Top Bar */}
      <div className="top-bar">
        {/* Difficulty Selector */}
        <div className="difficulty-selector">
          <label>Select Difficulty: </label>
          <select value={difficulty} onChange={handleDifficultyChange}>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>

        {/* Highest Results and Theme Toggle */}
        <div className="right-section">
          <div className="highest-results">
            <div>🎯 Highest Accuracy: {highestAccuracy}%</div>
            <div>🏆 Highest WPM: {highestWpm}</div>
          </div>
          <div className="theme-toggle-box">
            <button className="theme-toggle" onClick={toggleTheme}>
              {isDarkTheme ? "🌞" : "🌙"}
            </button>
          </div>
        </div>
      </div>

      <h1>Typing Speed Test</h1>

      <div className="timer">Time Left: {timeLeft}s</div>
      <div className="paragraph">{renderHighlightedParagraph()}</div>
      <textarea
        ref={textareaRef}
        value={userInput}
        onChange={handleInput}
        disabled={timeLeft === 0} // Disable only when time is up
        placeholder="Start typing here..."
      />

      {/* Submit Button */}
      <div className="action-buttons">
        <button onClick={handleSubmit} disabled={timeLeft === 0}>
          ✅ Submit
        </button>
      </div>

      {/* Display Results */}
      {wpm > 0 && (
        <div className="results">
          <h2>Results</h2>
          <p>WPM: {wpm}</p>
          <p>Accuracy: {accuracy}%</p>
        </div>
      )}
    </div>
  );
};

export default App;
