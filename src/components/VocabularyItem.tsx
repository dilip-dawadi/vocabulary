// src/components/VocabularyItem.tsx
import React, { useState } from "react";
import { VocabularyItemType } from "../types";
import { useUpdateUnderstoodVocabulary } from "../hooks/useVocabularyData";
import DeleteVocabularyForm from "./deleteVocabulary";

interface VocabularyItemProps extends VocabularyItemType {
  page: number;
  understoodFilter: boolean;
}
const VocabularyItem: React.FC<VocabularyItemProps> = ({
  id,
  word,
  meaning,
  synonyms,
  romanNepaliMeaning,
  romanNepaliWord,
  understood,
  understoodFilter,
  page,
}) => {
  const [open, setOpen] = useState(false);
  const [showRomanNepali, setShowRomanNepali] = useState(false);
  const handleNavigate = () => {
    setOpen(!open);
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
  };
  const capitalizeWord = (text: string) =>
    text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();

  // Function to handle text-to-speech for the word
  const handleSpeakWord = () => {
    const utterance = new SpeechSynthesisUtterance(
      `The word is ${capitalizeWord(word)}. It means: ${meaning}.`
    );
    utterance.lang = "en-US"; // Set language, adjust as needed
    utterance.rate = 0.8; // Adjust rate for slower speech
    window.speechSynthesis.speak(utterance);
  };
  const mutation = useUpdateUnderstoodVocabulary();
  return (
    <div className="vocabulary-item">
      <button onClick={() => setShowRomanNepali((prev) => !prev)}>
        Show {showRomanNepali ? " English" : " Roman Nepali"}
      </button>

      <h3>
        {showRomanNepali
          ? `${capitalizeWord(word)}: ${romanNepaliWord}`
          : capitalizeWord(word)}{" "}
        <button onClick={handleSpeakWord} className="speak-button">
          🔊
        </button>
      </h3>
      <p>
        <strong>{showRomanNepali ? " Roman" : " "}Meaning: </strong>{" "}
        {showRomanNepali ? romanNepaliMeaning : meaning}
      </p>
      <p>
        <strong>Synonyms:</strong> {synonyms.join(", ")}
      </p>
      <button
        onClick={() =>
          mutation.mutate({
            item: {
              id,
              word,
              meaning,
              synonyms,
              understood,
              romanNepaliMeaning,
              romanNepaliWord,
            },
            understoodFilter,
            page,
          })
        }
        disabled={id === mutation?.variables?.item?.id && mutation.isPending}
      >
        Mark as {`${understood ? " Un-Understood" : " Understood"}`}
      </button>
      <button className="btn-danger" onClick={() => handleNavigate()}>
        Delete Vocabulary
      </button>

      <DeleteVocabularyForm
        id={id}
        isOpen={open}
        onClose={() => setOpen(false)}
      />
    </div>
  );
};

export default VocabularyItem;
