const Car = require('../models/Car');

function asyncHandler(handler) {
  return function handleAsync(req, res, next) {
    Promise.resolve(handler(req, res, next)).catch(next);
  };
}

async function find(req, res) {
  const car = await Car.find(req.params.id);
  if (!car) {
    res.status(404).render('error', { message: 'Missing car', error: {} });
    return null;
  }
  return car;
}

function parseCarBody(body = {}) {
  return {
    manufacturer: body.manufacturer ? body.manufacturer.trim() : null,
    model: body.model ? body.model.trim() : null,
    color: body.color ? body.color.trim() : null,
    year: body.year ? Number(body.year) : null,
  };
}

async function index(req, res) {
  const cars = await Car.findAll();
  res.render('cars/index', { cars });
}

function createForm(req, res) {
  res.render('cars/create', { car: new Car() });
}

async function create(req, res) {
  const car = Car.fromObject(parseCarBody(req.body));
  await car.save();
  res.redirect('/cars');
}

async function editForm(req, res) {
  const car = await find(req, res);
  if (car) {
    res.render('cars/edit', { car });
  }
}

async function update(req, res) {
  const car = await find(req, res);
  if (car) {
    car.fill(parseCarBody(req.body));
    await car.save();
    res.redirect('/cars');
  }
}

async function show(req, res) {
  const car = await find(req, res);
  if (car) {
    res.render('cars/show', { car });
  }
}

async function remove(req, res) {
  const car = await find(req, res);
  if (car) {
    await car.delete();
    res.redirect('/cars');
  }
}

module.exports = {
  index: asyncHandler(index),
  createForm,
  create: asyncHandler(create),
  editForm: asyncHandler(editForm),
  update: asyncHandler(update),
  show: asyncHandler(show),
  remove: asyncHandler(remove),
};
