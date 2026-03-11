function Hero() {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center mt-20">
      <h1 className="text-[160px] font-longsile absolute">Hashim Malik</h1>
      <img src="character.png" className="w-[900px] absolute bottom-0 drop-shadow drop-shadow-pAccent"/>
      <h1 className="text-[160px] font-longsile absolute text-transparent [-webkit-text-stroke:0.5px_white]">
        Hashim Malik
      </h1>
    </div>
  );
}
export default Hero;
