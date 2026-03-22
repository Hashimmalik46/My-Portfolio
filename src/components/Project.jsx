import ProjectDesc from "./ProjectDesc";
function Project({ project, isActive, setActive }) {
  const { title, short_desc, tags } = project;

  return (
    <div className="border border-black rounded-xl p-5 flex flex-col gap-3">
      <h1 className="text-xl font-poppins font-bold">{title}</h1>
      <p className="font-poppins">{short_desc}</p>

      <div className="flex items-center gap-5">
        {tags.map((tag, index) => (
          <span
            key={index}
            className="font-poppins bg-black text-white px-3 py-1 rounded-full text-center"
          >
            {tag}
          </span>
        ))}
      </div>

      <button
        type="button"
        className="w-30 bg-pAccent rounded p-2 cursor-pointer hover:bg-amber-400 transition-all duration-200"
        onClick={setActive}
      >
        Read More &rarr;
      </button>

      {isActive && (
        <ProjectDesc
          project={project}
          isActive={isActive}
          setIsActive={setActive}
        />
      )}
    </div>
  );
}
export default Project;
