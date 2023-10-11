import AsyncHandler from "express-async-handler";
import Artist from "../models/artistModel.js";
import Song from "../models/songModel.js";

//@desc Get all the artistes
//@route GET /api/artistes/all
//@access public
const getArtists = AsyncHandler(async (req, res) => {
  try {
    const artists = await Artist.find();

    if (!artists) {
      res.status(400).json({ message: "Artists not found!" });
    }

    res.status(200).json(artists);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
});

//@desc Get the top artistes
//@route GET /api/artistes/top
//@access public
const getTopArtists = AsyncHandler(async (req, res) => {
  try {
    const artists = await Artist.find();

    if (!artists) {
      res.status(400).json({ message: "Artists not found!" });
    }

    const result = artists.slice(1, 11);

    res.status(200).json(result);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
});

//@desc Get details for an artiste
//@route GET /api/artistes/:id
//@access public
const getArtist = AsyncHandler(async (req, res) => {
  try {
    const { id } = req.params;

    const artist = await Artist.findById(id);
    if (!artist) {
      return res.status(404).json({ message: "Artist not found!" });
    }

    const artistSongs = await Song.find({ artistIds: id });
    if (!artistSongs) {
      return res.status(400).json({ message: "An error occured!" });
    }

    res.status(200).json({ ...artist._doc, songs: artistSongs });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
});

//@desc Add single artists
//@route POST /api/artists/single
//@access private (you can make it public if needed)
const addSingleArtist = AsyncHandler(async (req, res) => {
  try {
    const { name, image, type, bio } = req.body;

    const newArtist = await Artist.create({ name, image, type, bio });

    res.status(201).json(newArtist);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
});
//@desc Add multiple artists at once
//@route POST /api/artists/bulk
//@access private (you can make it public if needed)
const addBulkArtists = AsyncHandler(async (req, res) => {
  try {
    const artistsData = req.body;

    if (!Array.isArray(artistsData)) {
      return res
        .status(400)
        .json({ message: "Invalid request data. Expected an array of songs." });
    }

    const insertedArtists = await Artist.insertMany(artistsData);

    res.status(201).json(insertedArtists);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
});

export {
  getArtist,
  getArtists,
  getTopArtists,
  addBulkArtists,
  addSingleArtist,
};
