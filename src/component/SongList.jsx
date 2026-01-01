import { CiHeart } from "react-icons/ci";
import { FaHeart } from "react-icons/fa";

const SongList = ({
  songs,
  like,
  setLike,
  setCurrentSong,
  isPlaying,
  currentSong,
  showAlertFn
}) => {
  return (
    <>
      {songs.map((item, index) => (
        <div key={index} className="my-4 flex gap-2 px-4 cursor-pointer">
          <img src={item.artworkUrl60} className="w-[60px]" alt="" />

          <div className="flex-1 min-w-0" onClick={() => setCurrentSong(item)}>
            <p className={`text-sm font-medium ${
              isPlaying && currentSong?.trackId === item.trackId
                ? "text-green-400"
                : ""
            }`}>
              {item.trackName}
            </p>
            <p className="text-[12px] text-[#8B99AE]">
              {item.artistName}
            </p>
          </div>

          {like.includes(item.trackId) ? (
            <FaHeart
              color="red"
              onClick={() => {
                setLike(prev => prev.filter(id => id !== item.trackId));
                showAlertFn("Removed from Liked Playlist 💔");
              }}
            />
          ) : (
            <CiHeart
              onClick={() => {
                setLike(prev => [...prev, item.trackId]);
                showAlertFn("Added to Liked Playlist ❤️");
              }}
            />
          )}
        </div>
      ))}
    </>
  );
};

export default SongList;
