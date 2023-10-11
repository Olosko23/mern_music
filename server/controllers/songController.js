import AsyncHandler from "express-async-handler";
import User from "../models/userModel.js";
import Song from "../models/songModel.js";

//@desc Get all the songs
//@route GET /api/songs
//@access public
const getSongs = AsyncHandler(async (req, res) => {
  try {
    const songs = await Song.find({});

    if (!songs) {
      return res.status(400).json({ message: "No songs found!" });
    }
    const shuffledSongs = songs.sort(() => (Math.random() > 0.5 ? 1 : -1));

    res.status(200).json(shuffledSongs);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
});

//@desc Get the top songs
//@route GET /api/songs/top
//@access public
const getTopSongs = AsyncHandler(async (req, res) => {
  try {
    const results = await Song.aggregate([
      {
        $project: {
          title: 1,
          duration: 1,
          coverImage: 1,
          artistes: 1,
          songUrl: 1,
          artistIds: 1,
          type: 1,
          likes: {
            $size: {
              $objectToArray: "$likes",
            },
          },
        },
      },
      { $sort: { likes: -1 } },
      { $limit: 8 },
    ]);
    res.status(200).json(results);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
});

//@desc Get the new releases
//@route GET /api/songs/releases
//@access public
// Fisher-Yates shuffle algorithm for sorting
//After retrieving all songs, the code selects a subset of songs representing new releases.
//It does this by taking a slice of the array, starting from the second-to-last item (-11) and ending at the last item (-1).
//This effectively selects the last 10 items in the array
const getNewReleases = AsyncHandler(async (req, res) => {
  try {
    const songs = await Song.find({});

    const result = songs.slice(-11, -1);
    const shuffledSongs = result.sort(() => (Math.random() > 0.5 ? 1 : -1));

    res.status(200).json(shuffledSongs);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
});

//@desc Get random songs
//@route GET /api/songs/random
//@access public
const getRandom = AsyncHandler(async (req, res) => {
  try {
    const songs = await Song.find({});

    const shuffledSongs = songs.sort(() => (Math.random() > 0.5 ? 1 : -1));
    const result = shuffledSongs.slice(-11, -1);

    res.status(200).json(result);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
});

//@desc Get the popular songs around you
//@route GET /api/songs/popular
//@access public
const getAroundYou = AsyncHandler(async (req, res) => {
  try {
    const songs = await Song.find({});

    const result = songs.slice(0, 11);
    const shuffledSongs = result.sort(() => (Math.random() > 0.5 ? 1 : -1));

    res.status(200).json(shuffledSongs);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
});

//@desc Like or unlike a song
//@route PATCH /api/songs/like/:id
//@access private
const likeSong = AsyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const song = await Song.findById(id);
    const user = await User.findById(userId);

    if (!user) {
      return res.json(404).json({ message: "User not found!" });
    }
    if (!song) {
      return res.json(404).json({ message: "Song not found!" });
    }

    const isLiked = song.likes.get(userId);

    if (isLiked) {
      song.likes.delete(userId);
      user.favorites = user.favorites.filter((songId) => songId !== id);
    } else {
      song.likes.set(userId, true);
      user.favorites.push(id);
    }

    const savedSong = await song.save();
    const savedUser = await user.save();

    if (!savedSong || !savedUser) {
      return res.status(400).json({ message: "An error occured" });
    }

    const returnUser = {
      id: savedUser.id,
      username: savedUser.username,
      favorites: savedUser.favorites,
      playlists: savedUser.playlists,
    };

    res.status(200).json(returnUser);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
});

//@desc Add a song
//@route POST /api/songs/single
//@access private (you can make it public if needed)
const addSingleSong = AsyncHandler(async (req, res) => {
  try {
    const { title, duration, coverImage, artists, songUrl } = req.body;

    const newSong = await Song.create({
      title,
      duration,
      coverImage,
      artists,
      songUrl,
    });

    res.status(201).json(newSong);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
});

//@desc Add multiple songs at once
//@route POST /api/songs/bulk
//@access private (you can make it public if needed)
const addBulkSongs = AsyncHandler(async (req, res) => {
  try {
    const songsData = req.body; // Expect an array of song objects in the request body

    // Validate that songsData is an array
    if (!Array.isArray(songsData)) {
      return res
        .status(400)
        .json({ message: "Invalid request data. Expected an array of songs." });
    }

    const insertedSongs = await Song.insertMany(songsData);

    res.status(201).json(insertedSongs);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
});

export {
  getSongs,
  getTopSongs,
  getNewReleases,
  getRandom,
  getAroundYou,
  likeSong,
  addBulkSongs,
  addSingleSong,
};
