import ProjectDesc from "./ProjectDesc";
function Project({
  project,
  setPreviewOpen,
  setActiveProject,
  index,
  activeProject,
}) {
  const { title, short_desc, tags, img } = project;

  const isActive = activeProject === index;

  function handleModalOpen() {
    setActiveProject(index);
  }
  function handleModalClose() {
    setActiveProject(null);
  }

  return (
    <div
      onMouseEnter={() => !isActive && setPreviewOpen(img)}
      onMouseLeave={() => !isActive && setPreviewOpen("")}
      className="border border-black/10 p-5 flex flex-col gap-3 shadow-lg transition-all duration-200"
    >
      <h1 className="text-xl font-poppins font-bold">{title}</h1>
      <p className="font-poppins">{short_desc}</p>

      <div className="w-full flex items-center justify-between">
        <div className="flex items-center w-1/2 gap-5">
          {tags.map((tag) => (
            <span
              key={tag.id}
              className="font-poppins px-3 py-1 rounded-full text-sm bg-black/10 border border-black/10 transition-all duration-300 hover:bg-white/30 hover:scale-105"
            >
              {tag.tag}
            </span>
          ))}
        </div>

        <button
          type="button"
          className="w-30 rounded p-2 cursor-pointer hover:text-pAccent transition-all duration-200"
          onClick={handleModalOpen}
        >
          Read More &rarr;
        </button>
      </div>

      <ProjectDesc
        project={project}
        isActive={isActive}
        handleModalClose={handleModalClose}
      />
    </div>
  );
}
export default Project;
