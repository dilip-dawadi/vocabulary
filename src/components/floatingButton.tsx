import { useEffect, useState } from "react";
import AddVocabularyForm from "./addNewVocabulary";

export default function FloatingActionButton() {
  const [open, setOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const handleNavigate = () => {
    setOpen(!open);
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    const handleScroll = () => {
      const scrolledToBottom =
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight;

      setIsVisible(!scrolledToBottom);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    isVisible && (
      <div className="fixed-position">
        <div className="container">
          <div className="button" onClick={() => handleNavigate()}>
            + Add
          </div>
        </div>
        <AddVocabularyForm isOpen={open} onClose={() => setOpen(false)} />
      </div>
    )
  );
}
