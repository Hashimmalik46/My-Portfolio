function Hero() {
  return (
    <>
      <div className="hidden md:flex w-full h-full flex-col items-center justify-center mt-20">
        <h1 className="text-[160px] font-longsile absolute">Hashim Malik</h1>
        <img src="character.png" className="w-[900px] absolute bottom-0" />
        <h1 className="text-5xl md:text-6xl lg:text-[160px] font-longsile absolute text-transparent [-webkit-text-stroke:0.5px_white]">
          Hashim Malik
        </h1>
      </div>

      <div className="md:hidden w-full h-full flex flex-col items-center mt-40">
        <h1 className="text-[30px] font-longsile">Hey there!</h1>
        <h1 className="text-[45px] font-longsile">I'm Hashim Malik</h1>
        <h1 className="text-[20px] font-longsile text-center">
          Frontend Developer crafting modern web experiences
        </h1>
        <img src="character.png" className="absolute bottom-0" />
      </div>
    </>
  );
}
export default Hero;
