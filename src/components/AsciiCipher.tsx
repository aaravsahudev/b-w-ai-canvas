import { useState, useEffect } from "react";

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|;:',.<>?/~`";

interface AsciiCipherProps {
  text: string;
  isActive: boolean;
  onComplete?: () => void;
}

const AsciiCipher = ({ text, isActive, onComplete }: AsciiCipherProps) => {
  const [display, setDisplay] = useState(text);

  useEffect(() => {
    if (!isActive) {
      setDisplay(text);
      return;
    }

    let frame = 0;
    const maxFrames = 40;
    const interval = setInterval(() => {
      frame++;
      if (frame >= maxFrames) {
        clearInterval(interval);
        setDisplay(text);
        onComplete?.();
        return;
      }

      setDisplay(
        text
          .split("")
          .map(() => CHARS[Math.floor(Math.random() * CHARS.length)])
          .join("")
      );
    }, 16);

    return () => clearInterval(interval);
  }, [isActive, text, onComplete]);

  return (
    <span className={`font-mono ${isActive ? "animate-cipher" : ""}`}>
      {display}
    </span>
  );
};

export default AsciiCipher;
