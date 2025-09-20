const mongodb = require('../data/database');
const ObjectId = require('mongodb').ObjectId;

    const getAll = async (req, res, next) => {
    try {
        const result = await mongodb.getDatabase().db().collection('cats').find();
        const cats = await result.toArray();
        res.status(200).json(cats);
    } catch (err) {
        next(err);
    }
    };

const getOne = async (req, res, next) => {
  try {
    const CatID = new ObjectId(req.params.id);
    const result = await mongodb.getDatabase().db().collection('cats').find({ _id: CatID });
    const cats = await result.toArray();

    if (!cats[0]) {
      const error = new Error('Cat not found');
      error.statusCode = 404;
      throw error;
    }

    res.status(200).json(cats[0]);
  } catch (err) {
    next(err);
  }
};

const createCat = async (req, res, next) => {
  try {
    const Cat = {
      name: req.body.name,
      age: req.body.age,
      color: req.body.color,
      indoor: req.body.indoor,
    };

    const response = await mongodb.getDatabase().db().collection('cats').insertOne(Cat);

    if (!response.acknowledged) {
      const error = new Error('Some error occurred while creating the Cat.');
      error.statusCode = 500;
      throw error;
    }

    res.status(201).json({ insertedId: response.insertedId });
  } catch (err) {
    next(err);
  }
};

const updateCat = async (req, res, next) => {
  try {
    const CatId = new ObjectId(req.params.id);
    const Cat = {
      name: req.body.name,
      age: req.body.age,
      color: req.body.color,
      indoor: req.body.indoor,
     };

    const response = await mongodb.getDatabase().db().collection('cats').replaceOne(
      { _id: CatId },
      Cat
    );

    if (response.modifiedCount === 0) {
      const error = new Error('Cat not found or no changes applied.');
      error.statusCode = 404;
      throw error;
    }

    res.status(204).send();
  } catch (err) {
    next(err);
  }
};

const deleteCat = async (req, res, next) => {
  try {
    const CatId = new ObjectId(req.params.id);
    const response = await mongodb.getDatabase().db().collection('cats').deleteOne({ _id: CatId });

    if (response.deletedCount === 0) {
      const error = new Error('Cat not found.');
      error.statusCode = 404;
      throw error;
    }

    res.status(204).send();
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getAll,
  getOne,
  createCat,
  updateCat,
  deleteCat,
};

