import { FaHeart } from "react-icons/fa";

const LikedSongs = ({ likedSongs, setCurrentSong, setLike }) => {
  if (likedSongs.length === 0) {
    return <p className="text-center mt-10 text-gray-400">No liked songs ❤️</p>;
  }

  return likedSongs.map((item, index) => (
    <div key={index} className="my-4 flex gap-2 px-4 cursor-pointer">
      <img src={item.artworkUrl60} className="w-[60px]" alt="" />

      <div className="flex-1" onClick={() => setCurrentSong(item)}>
        <p className="text-sm">{item.trackName}</p>
        <p className="text-[12px] text-[#8B99AE]">{item.artistName}</p>
      </div>

      <FaHeart
        color="red"
        onClick={() =>
          setLike(prev => prev.filter(id => id !== item.trackId))
        }
      />
    </div>
  ));
};

export default LikedSongs;
