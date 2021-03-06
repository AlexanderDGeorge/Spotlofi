import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { fetchSong } from '../../actions/song_actions';
import { connect } from 'react-redux';
import { MdPlayCircleOutline, MdPauseCircleOutline } from 'react-icons/md';
import { IoMdHeartEmpty, IoMdHeart } from 'react-icons/io';
import { GiSettingsKnobs } from 'react-icons/gi';
import { createLike, deleteLike } from '../../actions/like_actions';
import { createPlaylistSong, deletePlaylistSong } from '../../actions/playlist_song_actions';
import { qPlayNow, qPauseSong, qPlaySong } from '../../actions/queue_actions';
import SongDropdown from './song-dropdown';
import Reward from 'react-rewards';

function Song(props) {

    const likeRef = useRef();
    const playRef = useRef();
    const { likes, song, queue } = props;
    const [open, setOpen] = useState(false);
    const songIds = [];
    likes.forEach(like => {
        songIds.push(like.song_id)
    });

    function handleLike() {
        if (songIds.includes(song.id)) {
            let like = likes[songIds.indexOf(song.id)]
            props.unlikeSong(like)
        } else {
            props.likeSong({ user_id: props.userId, song_id: song.id });
            likeRef.current.rewardMe();
        }
    }

    function handlePlay() {
        if (queue.songArray[queue.index] === song) {
            if (queue.playing) {
                props.pauseSong();
            } else {
                props.playSong();
                playRef.current.rewardMe()
            }
        } else {
            props.playNow(song);
            playRef.current.rewardMe();
        }
    }

    function isLiked() {
        return songIds.includes(song.id)
    }

    function isPlaying() {
        return queue.songArray[queue.index] === song && queue.playing
    }

    return (
        <div className="song">
            <Reward ref={playRef} type="memphis">
                {isPlaying() ? 
                    <MdPauseCircleOutline className="song-button" onClick={handlePlay} color="limegreen"/> :
                    <MdPlayCircleOutline className="song-button" onClick={handlePlay} />
                }
            </Reward>
            <Reward ref={likeRef} type="emoji" config={{ emoji: ["❤️"], lifetime: 100, spread: 360, startVelocity: 10, elementCount: 8, springAnimation: false, }}>
                {isLiked() ? 
                    <IoMdHeart color="white" className="song-button" onClick={handleLike} /> : 
                    <IoMdHeartEmpty className="song-button" onClick={handleLike}/> } 
            </Reward>
            <p className="song-name">
                {song.name}
            </p>
            <Link className="song-artist" to={"/artists/" + song.artist_id}>
                {song.artist}
            </Link>
            <Link className="song-album" to={"/albums/" + song.album_id}>
                {song.album}
            </Link>
            <p className="song-duration">
                {song.duration}
            </p>
            <GiSettingsKnobs className="song-button" onClick={() => setOpen(!open)}/>
            {open ? <SongDropdown setOpen={val => setOpen(val)} song={song} /> : null}
        </div>
    )
}

const mapState = state => ({
    userId: state.session.id,
    likes: Object.values(state.entities.user.likes),
    queue: state.queue,
})

const mapDispatch = dispatch => ({
    fetchSong: songId => dispatch(fetchSong(songId)),
    likeSong: like => dispatch(createLike(like)),
    unlikeSong: likeId => dispatch(deleteLike(likeId)),
    addToPlaylist: song => dispatch(createPlaylistSong(song)),
    removeFromPlaylist: songId => dispatch(deletePlaylistSong(songId)),
    playNow: song => dispatch(qPlayNow(song)),
    pauseSong: () => dispatch(qPauseSong()),
    playSong: () => dispatch(qPlaySong()),
});

export default connect(mapState, mapDispatch)(Song);