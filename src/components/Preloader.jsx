import {
  AnimatedSpan,
  Terminal,
  TypingAnimation,
} from "@/components/ui/terminal";
function Preloader() {
  return (
    <div className="fixed inset-0 bg-black flex items-center justify-center z-50">
      <Terminal>
        <TypingAnimation>Initializing Portfolio v2.3...</TypingAnimation>
        <AnimatedSpan>✔ Loading personal projects.</AnimatedSpan>
        <AnimatedSpan>✔ Compiling creativity modules.</AnimatedSpan>
        <AnimatedSpan>✔ Applying color themes & fonts.</AnimatedSpan>
        <TypingAnimation>
          Success! Welcome to Hashim’s digital playground.
        </TypingAnimation>
      </Terminal>
    </div>
  );
}

export default Preloader;
