import React, { useState } from 'react';
import { fetchSong } from '../../actions/song_actions';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { MdPlayCircleOutline } from 'react-icons/md';
import { IoMdHeartEmpty, IoMdHeart } from 'react-icons/io';
import { GiSettingsKnobs } from 'react-icons/gi';
import { createLike, deleteLike } from '../../actions/like_actions';
import { createPlaylistSong, deletePlaylistSong } from '../../actions/playlist_song_actions';
import SongDropdown from './song-dropdown';

function Song(props) {

    const [open, setOpen] = useState(false);

    function handleLike() {
        props.likeSong({ user_id: props.userId, song_id: props.song.id })
    }

    return (
        <div className="song">
            <MdPlayCircleOutline className="song-button"/>
            <IoMdHeartEmpty className="song-button" onClick={handleLike}/> 
            <p className="song-name">
                {props.song.name}
            </p>
            <Link className="song-artist" to={"/artists/" + props.song.artist_id}>
                {props.song.artist}
            </Link>
            <Link className="song-album" to={"/albums/" + props.song.album_id}>
                {props.song.album}
            </Link>
            <p className="song-duration">
                {props.song.duration}
            </p>
            <GiSettingsKnobs className="song-button" onClick={() => setOpen(!open)}/>
            {open ? <SongDropdown setOpen={val => setOpen(val)} song={props.song} /> : null}
        </div>
    )
}

const mapState = state => ({
    userId: () => state.session.id
})

const mapDispatch = dispatch => ({
    fetchSong: songId => dispatch(fetchSong(songId)),
    likeSong: like => dispatch(createLike(like)),
    unlikeSong: likeId => dispatch(deleteLike(likeId)),
    addToPlaylist: song => dispatch(createPlaylistSong(song)),
    removeFromPlaylist: songId => dispatch(deletePlaylistSong(songId)),
});

export default connect(mapState, mapDispatch)(Song);