// src/App.tsx
import React from "react";
import VocabularyList from "./components/VocabularyList.tsx";

const App: React.FC = () => {
  return (
    <div className="App">
      <VocabularyList />
      <div className="text-center font-bold margin-button-10">
        Learning is the key for success {";>"}
      </div>
    </div>
  );
};

export default App;
