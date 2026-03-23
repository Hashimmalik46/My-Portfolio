import {
  AnimatedSpan,
  Terminal,
  TypingAnimation,
} from "@/components/ui/terminal";
function Preloader() {
  return (
    <div className="fixed inset-0 bg-black flex items-center justify-center z-50">
      <Terminal>
        <TypingAnimation duration={30}>Initializing Portfolio v2.3...</TypingAnimation>
        <AnimatedSpan className={`text-blue-500`}>✔ Loading personal projects.</AnimatedSpan>
        <AnimatedSpan>✔ Compiling creativity modules.</AnimatedSpan>
        <AnimatedSpan className={`text-green-500`}>✔ Applying color themes & fonts.</AnimatedSpan>
        <TypingAnimation duration={20}>
          Success! Welcome to Hashim’s digital playground.
        </TypingAnimation>
      </Terminal>
    </div>
  );
}

export default Preloader;
