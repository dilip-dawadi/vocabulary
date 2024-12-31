import React, { useState } from "react";
import { useCreateVocabulary } from "../hooks/useVocabularyData";
import { VocabularyItemType } from "../types";

interface AddVocabularyFormProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddVocabularyForm: React.FC<AddVocabularyFormProps> = ({
  isOpen,
  onClose,
}) => {
  const [word, setWord] = useState("");
  const [romanNepaliWord, setRomanNepaliWord] = useState("");
  const [meaning, setMeaning] = useState("");
  const [romanNepaliMeaning, setRomanNepaliMeaning] = useState("");
  const [synonyms, setSynonyms] = useState<string>("");
  const [understood, setUnderstood] = useState(false);

  const mutation = useCreateVocabulary();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Prepare the new vocabulary item
    const newVocabularyItem: VocabularyItemType = {
      id: Date.now(), // Unique ID based on timestamp (you could use a UUID instead)
      word,
      romanNepaliWord,
      meaning,
      romanNepaliMeaning,
      synonyms: synonyms.split(",").map((synonym) => synonym.trim()),
      understood,
    };

    // Assuming mutation will handle adding the new vocabulary
    mutation.mutate(newVocabularyItem);

    // Reset form and close modal after submission
    setWord("");
    setMeaning("");
    setSynonyms("");
    setUnderstood(false);
    onClose();
  };

  if (!isOpen) return null; // Don't render anything if the modal is not open

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>Add New Vocabulary</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="word">Word:</label>
            <input
              type="text"
              id="word"
              value={word}
              onChange={(e) => setWord(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="meaning">Meaning:</label>
            <input
              id="meaning"
              value={meaning}
              onChange={(e) => setMeaning(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="romanNepaliWord">romanNepaliWord:</label>
            <input
              id="romanNepaliWord"
              value={romanNepaliWord}
              onChange={(e) => setRomanNepaliWord(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="romanNepaliMeaning">romanNepaliMeaning:</label>
            <input
              id="romanNepaliMeaning"
              value={romanNepaliMeaning}
              onChange={(e) => setRomanNepaliMeaning(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="synonyms">Synonyms (comma separated):</label>
            <input
              type="text"
              id="synonyms"
              value={synonyms}
              onChange={(e) => setSynonyms(e.target.value)}
              required
            />
          </div>
          <div>
            <label>
              <input
                type="checkbox"
                checked={understood}
                onChange={() => setUnderstood((prev) => !prev)}
              />
              Understood
            </label>
          </div>
          <button type="submit" disabled={mutation.isPending}>
            {mutation.isPending ? "Adding..." : "Add Vocabulary"}
          </button>
        </form>
        <button className="close-btn" onClick={onClose}>
          x
        </button>
      </div>
    </div>
  );
};

export default AddVocabularyForm;
