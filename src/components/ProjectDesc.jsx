import { LuExternalLink } from "react-icons/lu";

function ProjectDesc({ project, isActive, setIsActive }) {
  const { title, img, desc, short_desc, tags, link } = project;

  return (
    <div>
      <div className="flex flex-col gap-5 w-full max-w-2xl px-5 py-7 bg-black text-white rounded-2xl absolute top-10 left-100">
        <button
          className="bg-pAccent text-black w-10 h-10 absolute right-3 top-3 text-2xl rounded-full hover:scale-105 transition-all duration-200 cursor-pointer"
          onClick={() => setIsActive(null)}
        >
          &times;
        </button>
        <img src={img} className="w-full h-64 rounded-2xl" />
        <h1 className="text-xl font-poppins font-bold">{title}</h1>
        <p className="font-poppins text-justify">{desc}</p>

        <a
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          className="w-40  hover:text-pAccent font-poppins flex items-center gap-2 cursor-pointer transition-all duration-200"
        >
          <LuExternalLink />
          Check Here &rarr;
        </a>
      </div>
    </div>
  );
}

export default ProjectDesc;
