import React from "react";
import { useDeleteVocabulary } from "../hooks/useVocabularyData";

interface DeleteVocabularyFormProps {
  isOpen: boolean;
  onClose: () => void;
  id: number;
}

const DeleteVocabularyForm: React.FC<DeleteVocabularyFormProps> = ({
  isOpen,
  onClose,
  id,
}) => {
  const mutation = useDeleteVocabulary();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Assuming mutation will handle adding the new vocabulary
    mutation.mutate(id);
    onClose();
  };

  if (!isOpen) return null; // Don't render anything if the modal is not open

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>Delete Vocabulary</h2>
        <p>Are you sure u want to delete?</p>
        <button className="btn-danger" onClick={handleSubmit}>
          Yes, Delete
        </button>
        <button className="close-btn" onClick={onClose}>
          x
        </button>
      </div>
    </div>
  );
};

export default DeleteVocabularyForm;
