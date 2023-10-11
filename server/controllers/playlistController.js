import AsyncHandler from "express-async-handler";
import Playlist from "../models/playlistModel.js";
import User from "../models/userModel.js";
import Song from "../models/songModel.js";

//@desc Get all the playlists
//@route GET /api/playlists
//@access public
const getPlaylists = AsyncHandler(async (req, res) => {
  try {
    const playlists = await Playlist.find({});

    if (!playlists) {
      return res.status(400).json({ message: "An error occured" });
    }

    res.status(200).json(playlists);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
});

//@desc Create a playlist
//@route POST /api/playlists/create
//@access private
const createPlaylist = AsyncHandler(async (req, res) => {
  try {
    const { id, username } = req.user;
    const { title, description, isPrivate, songIds } = req.body;
    const user = await User.findById(id);

    if (!title || !songIds) {
      return res.status(400).json({ message: "All fields are required!" });
    }

    if (!user) {
      return res.status(404).json({ message: "User not found!" });
    }

    await Promise.all(
      songIds.map(async (id) => {
        const songExists = await Song.findById(id);
        if (!songExists) {
          return res.status(404).json({ message: "Song not found" });
        }
      })
    );

    const newPlaylist = await Playlist.create({
      title,
      description,
      userId: id,
      userName: username,
      songs: songIds,
      isPrivate,
    });

    if (!newPlaylist) {
      return res.status(400).json({ message: "An error occured!" });
    }

    user.playlists.push(newPlaylist.id);
    await user.save();

    res.status(201).json(newPlaylist);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
});

//@desc Get a playlists' details
//@route GET /api/playlists/:id
//@access public
const getPlaylist = AsyncHandler(async (req, res) => {
  try {
    const { id } = req.params;

    const playlist = await Playlist.findById(id);

    if (!playlist) {
      return res.status(404).json({ message: "Playlist not found!" });
    }

    let songs = [];

    await Promise.all(
      playlist.songs.map(async (songId) => {
        const playlistSong = await Song.findById(songId);
        if (!playlistSong) {
          return res.status(404).json({ message: "Song not found" });
        } else {
          songs.push(playlistSong);
        }
      })
    );

    res.status(200).json({ ...playlist.toObject(), songs });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
});

//@desc Add or remove a song from a playlist
//@route PATCH /api/playlists/:id
//@access private
const editPlaylist = AsyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const { title, description, songIds } = req.body;
    const playlist = await Playlist.findById(id);

    if (!title || !songIds) {
      return res.status(400).json({ message: "All fields are required!" });
    }

    if (!playlist) {
      return res.status(400).json({ message: "Playlist not found!" });
    }

    if (playlist.userId !== userId) {
      return res.status(403).json({
        message: "You are not allowed to edit other users' playlists!",
      });
    }

    await Promise.all(
      songIds.map(async (id) => {
        const songExists = await Song.findById(id);
        if (!songExists) {
          return res.status(404).json({ message: "Song not found" });
        }
      })
    );

    const updatedPlaylist = await Playlist.findByIdAndUpdate(
      id,
      { title, description, songs: songIds },
      {
        new: true,
      }
    );

    if (!updatedPlaylist) {
      return res.status(400).json({ message: "Playlist not updated!" });
    }
    res.status(200).json(updatedPlaylist);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
});

export { getPlaylists, createPlaylist, getPlaylist, editPlaylist };
