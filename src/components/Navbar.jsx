function Navbar() {
  return (
    <nav className=" w-full flex items-center justify-around pt-15">
      <h1 className="font-khuma text-3xl font-bold">Hash</h1>
      <ul className="flex gap-6 font-poppins text-[18px] font-semibold ">
        <li>
          <a href="#Home">Home</a>
        </li>
        <li>
          <a href="#About">About</a>
        </li>
        <li>
          <a href="#home">Portfolio</a>
        </li>
        <li>
          <a href="#home">Contact</a>
        </li>
      </ul>
      <div className="flex gap-5">
        <a href="https://github.com/Hashimmalik46" target="blank">
          <img src="/github.png" className="w-8" />
        </a>
        <a href="https://www.linkedin.com/in/hashim-malik-a868102b0/" target="blank">
          <img src="/linkedin.png" className="w-8" />
        </a>
      </div>
    </nav>
  );
}
export default Navbar;
