import { File, Search, Settings } from "lucide-react";
import { OrbitingCircles } from "@/components/ui/orbiting-circles";
import { FaHtml5, FaCss3Alt, FaReact } from "react-icons/fa";
import { SiJavascript, SiTailwindcss } from "react-icons/si";

const Icons = {
  html: FaHtml5,
  css: FaCss3Alt,
  js: SiJavascript,
  react: FaReact,
  tailwind: SiTailwindcss,
};

function Orbit() {
  return (
    <div className="relative flex h-[500px] w-full flex-col items-center justify-center overflow-hidden">
      <OrbitingCircles iconSize={40}>
        <Icons.html className="text-orange-500 w-8 h-8" />
        <Icons.css className="text-blue-500 w-8 h-8" />
        <Icons.js className="text-yellow-500 w-8 h-8" />
        <Icons.react className="text-cyan-500 w-8 h-8" />
        <Icons.tailwind className="text-purple-500 w-8 h-8" />
      </OrbitingCircles>
      <OrbitingCircles iconSize={30} radius={100} reverse speed={2}>
        <Icons.html className="text-orange-500 w-8 h-8" />
        <Icons.css className="text-blue-500 w-8 h-8" />
        <Icons.js className="text-yellow-500 w-8 h-8" />
        <Icons.react className="text-cyan-500 w-8 h-8" />
        <Icons.tailwind className="text-purple-500 w-8 h-8" />
      </OrbitingCircles>
    </div>
  );
}

export default Orbit;
