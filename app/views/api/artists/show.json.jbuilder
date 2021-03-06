json.set! :artist do
    json.set! @artist.id do
      json.extract! @artist, :id, :name, :img_url
      json.songIds @artist.songs.pluck(:id)
      json.albumIds @artist.albums.pluck(:id)
    end
  end
  
  json.set! :song do
    @artist.songs.each do |song|
      json.set! song.id do
        json.partial! "/api/songs/song", song: song
      end
    end
  end
  
  json.set! :album do
    @artist.albums.each do |album|
      json.set! album.id do
        json.partial! "/api/albums/album", album: album
      end
    end
end