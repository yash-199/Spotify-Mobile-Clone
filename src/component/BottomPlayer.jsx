import { FaPause, FaPlay } from "react-icons/fa";
import { GrChapterNext, GrChapterPrevious } from "react-icons/gr";

const BottomPlayer = ({
  currentSong,
  isPlaying,
  handleClick,
  nextSong,
  prevSong,
  setIsExpanded,
  progressBar
}) => {
  if (!currentSong) return null;

  return (
    <div className="fixed bottom-0 w-[450px] bg-black px-2">
      <div className="h-1 bg-gray-500">
        <div className="h-full bg-white" style={{ width: `${progressBar}%` }} />
      </div>

      <div className="flex justify-between my-4">
        <img src={currentSong.artworkUrl30} alt="" />
        <div onClick={() => setIsExpanded(true)}>
          <p>{currentSong.trackName}</p>
          <p className="text-xs">{currentSong.artistName}</p>
        </div>

        <div className="flex gap-3">
          <GrChapterPrevious onClick={prevSong} />
          {isPlaying ? (
            <FaPause onClick={handleClick} />
          ) : (
            <FaPlay onClick={handleClick} />
          )}
          <GrChapterNext onClick={nextSong} />
        </div>
      </div>
    </div>
  );
};

export default BottomPlayer;
