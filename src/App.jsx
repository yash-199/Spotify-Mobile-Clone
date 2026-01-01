import React, { useEffect, useState } from 'react'
import music from './assets/index.js'
import { CiHeart } from "react-icons/ci";
import { FaHeart } from "react-icons/fa";
import { FaPlay } from "react-icons/fa6";
import { useRef } from 'react';
import { FaPause } from "react-icons/fa";
import { GrChapterNext } from "react-icons/gr";
import { GrChapterPrevious } from "react-icons/gr";
import { FaMinimize } from "react-icons/fa6";
const App = () => {
    const [filteredSong, setFilteredSong] = useState([]);
    const [searchValue, setSearchValue] = useState("");
    const [currentSong, setCurrentSong] = useState(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false)
    const [duration, setDuration] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);
    const [isExpanded, setIsExpanded] = useState(false);
    const [likedPage, setLikedPage] = useState(false)
    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState("");

    const audioRef = useRef(null);

    function formatTime(milliseconds = 0) {
        const totalSeconds = Math.floor(milliseconds / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        return `${minutes}:${seconds.toString().padStart(2, "0")}`;
    }
    console.log(currentSong)
    // Get Localstorage of Liked Song
    const [like, setLike] = useState(() => {
        const saved = localStorage.getItem("Liked Song");
        if (!saved) return []; // no saved data
        try {
            return JSON.parse(saved); // try parsing
        } catch (error) {
            console.error("Failed to parse liked songs:", error);
            return []; // fallback if corrupted data
        }

    });

    // Searching Song using debounced
    useEffect(() => {
        const timer = setTimeout(() => {
            const searchSong = music.filter((song) =>
                song.trackName.toLowerCase().includes(searchValue.toLowerCase())
            );
            setFilteredSong(searchSong)
        }, 500)
        return () => clearTimeout(timer);
    }, [searchValue])

    // Set liked song on localstorage
    useEffect(() => {
        localStorage.setItem("Liked Song", JSON.stringify(like || []));
    }, [like])

    // Length
    const musicLength = music.length;
    // on click button play music and play
    function handleClick() {
        const nextPlaying = !isPlaying;
        setIsPlaying(nextPlaying);
        if (nextPlaying) {
            audioRef.current.play();
        } else {
            audioRef.current.pause();
        }
        // setIsPlaying(!isPlaying)
    }

    // click any song start play
    useEffect(() => {
        if (currentSong && audioRef.current) {
            audioRef.current.load()
            audioRef.current.play()
            setIsPlaying(true)
        }
    }, [currentSong])

    function nextSong() {
        const nextTrack = (currentIndex + 1) % music.length;
        setCurrentIndex(nextTrack)
        setCurrentSong(music[nextTrack])
        setIsPlaying(true)
    }

    function prevSong() {
        const prevTrack = (currentIndex - 1 + music.length) % music.length;
        setCurrentIndex(prevTrack);
        setCurrentSong(music[prevTrack]);
        setIsPlaying(true);
    }

    const progressBar = duration > 0 ? (currentTime / duration) * 100 : 0;

    // Show Liked Songs on Liked Page
    const likedSongs = music.filter(song => like.includes(song.trackId))

    return (

        <>
            <div className='w-[450px] bg-gradient-to-t from-[#000000] to-[#0a1f44] mx-auto text-white rounded h-[100vh] overflow-y-auto overflow-x-hidden'>
                {/* Number of songs and liked */}
                <div className='flex justify-between w-1/2 pt-4 px-4'>
                    <p className='cursor-pointer' onClick={() => setLikedPage(false)}>({musicLength}) Songs</p>
                    <p className='cursor-pointer' onClick={() => setLikedPage(true)}>({like.length}) Liked Song</p>
                </div>
                {/* Search Songs */}
                <div className='mx-4'>
                    <div className='w-full my-4 outline outline-2 rounded '>
                        <input type="text" value={searchValue} onChange={(e) => setSearchValue(e.target.value)} className='w-full h-[2rem] rounded bg-transparent outline-none px-2 ' placeholder='Search Songs..' />
                    </div>
                </div>
                <hr />
                {!isExpanded && !likedPage && filteredSong.map((item, index) => (
                    <div key={index} className="my-4 flex gap-2 px-4 cursor-pointer">
                        <div>
                            <img src={item.artworkUrl60} className="w-[60px]" alt="" />
                        </div>

                        <div className="flex-1 min-w-0" onClick={() => setCurrentSong(item)}>
                            <p
                                className={`text-sm font-medium ${isPlaying && currentSong?.trackId === item.trackId
                                    ? "text-green-400"
                                    : ""
                                    }`}
                            >
                                {item.trackName}
                            </p>

                            <p className="text-[12px] mt-1 font-medium text-[#8B99AE] line-clamp-3 break-words">
                                {item.artistName}
                            </p>
                        </div>
                        {/* Liked and Unliked */}
                        <div>
                            {Array.isArray(like) && like.includes(item.trackId) ? (
                                <FaHeart
                                    size={19}
                                    style={{ color: "red", cursor: "pointer" }}
                                    onClick={() => {
                                        setLike(prev => prev.filter(id => id !== item.trackId));
                                        setAlertMessage("Removed from Liked Playlist 💔");
                                        setShowAlert(true);

                                        setTimeout(() => {
                                            setShowAlert(false);
                                        }, 2000);
                                    }}
                                />
                            ) : (
                                <CiHeart
                                    size={19}
                                    style={{ cursor: "pointer" }}
                                    onClick={() => {
                                        setLike(prev => [...prev, item.trackId]);
                                        setAlertMessage("Added to Liked Playlist ❤️");
                                        setShowAlert(true);

                                        setTimeout(() => {
                                            setShowAlert(false);
                                        }, 2000);
                                    }}
                                />
                            )}

                        </div>
                    </div>
                ))}

                {/* Bottom Player */}
                {!isExpanded && currentSong && (
                    <div className='fixed bg-gradient-to-t from-[#000000] to-[#0a1f44] text-white bottom-0 px-2 cursor-pointer'>
                        <div style={{ width: "100%", maxWidth: "800px", height: "4px", backgroundColor: "grey", }} >
                            <div
                                style={{
                                    width: `${progressBar}%`,
                                    height: "100%",
                                    backgroundColor: "white",
                                    transition: "width 0.1s linear"
                                }}
                            >

                            </div>
                        </div>
                        <div className='w-full min-w-[26rem] flex justify-between gap-3 my-4'>
                            <div>
                                <img src={currentSong.artworkUrl30} alt="" />
                            </div>
                            {/* Track Name and Artist Name */}
                            <div onClick={() => setIsExpanded(true)}>
                                <p className='text-sm'>{currentSong.trackName}</p>
                                <p className='text-[10px]'>{currentSong.artistName}</p>
                            </div>
                            {/* Like and unlIked */}
                            <div>
                                {Array.isArray(like) && like.includes(currentSong.trackId) ? (
                                    <FaHeart
                                        size={19}
                                        style={{ color: "red", cursor: "pointer" }}
                                        onClick={() =>
                                            setLike(prev => prev.filter(id => id !== currentSong.trackId))
                                        }
                                    />
                                ) : (
                                    <CiHeart
                                        size={19}
                                        style={{ cursor: "pointer" }}
                                        onClick={() =>
                                            setLike(prev => [...prev, currentSong.trackId])
                                        }
                                    />
                                )}
                            </div>
                            {/* Play, pause, next and Prev Button */}
                            <div className='flex justify-between gap-2'>
                                {/* Prev Button */}
                                <GrChapterPrevious onClick={prevSong} className='cursor-pointer' />
                                {/* Play and Pause */}
                                <div onClick={handleClick} className='cursor-pointer'>
                                    {isPlaying ? <FaPause /> : <FaPlay />}
                                </div>
                                {/* Next Button */}
                                <GrChapterNext className='cursor-pointer' onClick={nextSong} />
                                {/* <FaPlay onClick={handleClick}/> */}
                            </div>

                            {/* <audio ref={audioRef} onPlay={() => setIsPlaying(true)} onPause={() => setIsPlaying(false)}
                                onEnded={nextSong}
                                onLoadedMetadata={() => { setDuration(audioRef.current.duration); }}
                                onTimeUpdate={() => { setCurrentTime(audioRef.current.currentTime); }}>
                                <source src={currentSong.previewUrl} />
                            </audio> */}
                        </div>
                    </div>
                )}

                {isExpanded && currentSong && (
                    <div className='w-[450px] bg-gradient-to-t from-[#000000] to-[#0a1f44] mx-auto text-white rounded  overflow-y-hidden py-10 px-10'>
                        {/* Minimize tab */}
                        <div className='flex items-center justify-end'>
                            <FaMinimize className='cursor-pointer absolute top-28' onClick={() => setIsExpanded(false)} />
                        </div>
                        <div>
                            <center>
                                <img className='w-[100%]' src={currentSong.artworkUrl100} alt="" />
                            </center>
                        </div>
                        <div className='flex items-center justify-between my-4'>
                            <div>
                                <img src={currentSong.artworkUrl60} alt="" />
                            </div>
                            <div>
                                <p>{currentSong.trackName}</p>
                                <p className='text-[10px] mt-1 font-medium text-[#8B99AE] line-clamp-3 break-words'>{currentSong.artistName}</p>
                            </div>
                            <div>
                                {Array.isArray(like) && like.includes(currentSong.trackId) ? (
                                    <FaHeart
                                        size={19}
                                        style={{ color: "red", cursor: "pointer" }}
                                        onClick={() => setLike(prev => prev.filter(id => id !== currentSong.trackId))}
                                        className='text-2xl' />
                                ) : (
                                    <CiHeart className='text-2xl'
                                        onClick={() => setLike(prev => [...prev, currentSong.trackId])}
                                    />
                                )}
                            </div>

                        </div>

                        <div style={{ width: "100%", maxWidth: "800px", height: "4px", backgroundColor: "grey", }} >
                            <div
                                style={{
                                    width: `${progressBar}%`,
                                    height: "100%",
                                    backgroundColor: "white",
                                    transition: "width 0.1s linear"
                                }}
                            >

                            </div>
                        </div>
                        <div className='flex items-center justify-between my-2'>
                            <p>{formatTime(currentTime * 1000)}</p>
                            <p>{formatTime(duration * 1000)}</p>
                        </div>
                        <div className='flex items-center justify-center gap-10'>
                            <GrChapterPrevious onClick={prevSong} className='border border-2 text-4xl rounded-full p-2 cursor-pointer' />
                            <div onClick={handleClick} className='cursor-pointer'>
                                {isPlaying ? <FaPause className='text-2xl' /> : <FaPlay className='text-2xl' />}
                            </div>
                            <GrChapterNext onClick={nextSong} className='border border-2 text-4xl rounded-full p-2 cursor-pointer' />
                        </div>
                    </div>
                )}

                {likedPage && !isExpanded && (
                    <>
                        {likedSongs.length === 0 ? (
                            <p className="text-center mt-10 text-gray-400">
                                No liked songs yet ❤️
                            </p>
                        ) : (
                            likedSongs.map((item, index) => (
                                <div key={index} className="my-4 flex gap-2 px-4 cursor-pointer">
                                    <div>
                                        <img src={item.artworkUrl60} className="w-[60px]" alt="" />
                                    </div>

                                    <div
                                        className="flex-1 min-w-0"
                                        onClick={() => {
                                            setCurrentSong(item);
                                            setCurrentIndex(
                                                music.findIndex(song => song.trackId === item.trackId)
                                            );
                                        }}
                                    >
                                        <p className="text-sm font-medium">
                                            {item.trackName}
                                        </p>
                                        <p className="text-[12px] mt-1 text-[#8B99AE]">
                                            {item.artistName}
                                        </p>
                                    </div>

                                    {/* Unlike button */}
                                    <FaHeart
                                        size={19}
                                        style={{ color: "red", cursor: "pointer" }}
                                        onClick={() =>
                                            setLike(prev => prev.filter(id => id !== item.trackId))
                                        }
                                    />
                                </div>
                            ))
                        )}
                    </>
                )}

                <audio ref={audioRef} onPlay={() => setIsPlaying(true)} onPause={() => setIsPlaying(false)}
                    onEnded={nextSong}
                    onLoadedMetadata={() => { setDuration(audioRef.current.duration); }}
                    onTimeUpdate={() => { setCurrentTime(audioRef.current.currentTime); }}>
                    {currentSong &&
                        <source src={currentSong.previewUrl} />
                    }
                </audio>

                {/* Alert Message */}
                {showAlert && (
                    <div className="fixed bottom-24 left-1/2 -translate-x-1/2 
                    bg-white text-black px-4 py-2 rounded shadow-lg">
                        {alertMessage}
                    </div>
                )}

            </div>
        </>
    )
}

export default App