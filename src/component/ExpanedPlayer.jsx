import {  FaPause, FaPlay } from "react-icons/fa";
import { GrChapterNext, GrChapterPrevious } from "react-icons/gr";

const ExpandedPlayer = ({
  currentSong,
  isPlaying,
  handleClick,
  nextSong,
  prevSong,
  setIsExpanded
}) => {
  if (!currentSong) return null;

  return (
    <div className="p-6">
      <FaMinimize onClick={() => setIsExpanded(false)} />

      <img src={currentSong.artworkUrl100} className="w-full my-4" />

      <p>{currentSong.trackName}</p>
      <p className="text-sm">{currentSong.artistName}</p>

      <div className="flex justify-center gap-10 mt-6">
        <GrChapterPrevious onClick={prevSong} />
        {isPlaying ? (
          <FaPause onClick={handleClick} />
        ) : (
          <FaPlay onClick={handleClick} />
        )}
        <GrChapterNext onClick={nextSong} />
      </div>
    </div>
  );
};

export default ExpandedPlayer;
