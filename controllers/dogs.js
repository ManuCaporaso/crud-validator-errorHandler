const mongodb = require('../data/database');
const ObjectId = require('mongodb').ObjectId;

    const getAll = async (req, res, next) => {
    try {
        const result = await mongodb.getDatabase().db().collection('dogs').find();
        const dogs = await result.toArray();
        res.status(200).json(dogs);
    } catch (err) {
        next(err);
    }
    };

const getOne = async (req, res, next) => {
  try {
    const dogID = new ObjectId(req.params.id);
    const result = await mongodb.getDatabase().db().collection('dogs').find({ _id: dogID });
    const dogs = await result.toArray();

    if (!dogs[0]) {
      const error = new Error('Dog not found');
      error.statusCode = 404;
      throw error;
    }

    res.status(200).json(dogs[0]);
  } catch (err) {
    next(err);
  }
};

const createDog = async (req, res, next) => {
  try {
    const dog = {
      name: req.body.name,
      breed: req.body.breed,
      age: req.body.age,
      weightKg: req.body.weightKg,
      vaccinated: req.body.vaccinated,
      microchipped: req.body.microchipped,
      owner: {
        name: req.body.owner.name,
        phone: req.body.owner.phone,
      },
    };

    const response = await mongodb.getDatabase().db().collection('dogs').insertOne(dog);

    if (!response.acknowledged) {
      const error = new Error('Some error occurred while creating the Dog.');
      error.statusCode = 500;
      throw error;
    }

    res.status(201).json({ insertedId: response.insertedId });
  } catch (err) {
    next(err);
  }
};

const updateDog = async (req, res, next) => {
  try {
    const DogId = new ObjectId(req.params.id);
    const dog = {
      name: req.body.name,
      breed: req.body.breed,
      age: req.body.age,
      weightKg: req.body.weightKg,
      vaccinated: req.body.vaccinated,
      microchipped: req.body.microchipped,
      owner: {
        name: req.body.owner.name,
        phone: req.body.owner.phone,
      },
    };

    const response = await mongodb.getDatabase().db().collection('dogs').replaceOne(
      { _id: DogId },
      dog
    );

    if (response.modifiedCount === 0) {
      const error = new Error('Dog not found or no changes applied.');
      error.statusCode = 404;
      throw error;
    }

    res.status(204).send();
  } catch (err) {
    next(err);
  }
};

const deleteDog = async (req, res, next) => {
  try {
    const DogId = new ObjectId(req.params.id);
    const response = await mongodb.getDatabase().db().collection('dogs').deleteOne({ _id: DogId });

    if (response.deletedCount === 0) {
      const error = new Error('Dog not found.');
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
  createDog,
  updateDog,
  deleteDog,
};
