class Car {
  constructor({ id = null, manufacturer = null, model = null, color = null, year = null } = {}) {
    this.id = id;
    this.manufacturer = manufacturer;
    this.model = model;
    this.color = color;
    this.year = year;
  }

  static fromObject(data = {}) {
    const car = new Car();
    return car.fill(data);
  }

  fill(data = {}) {
    if (Object.prototype.hasOwnProperty.call(data, 'id') && !this.id) {
      this.id = data.id;
    }
    ['manufacturer', 'model', 'color', 'year'].forEach((field) => {
      if (Object.prototype.hasOwnProperty.call(data, field)) {
        this[field] = data[field];
      }
    });
    return this;
  }

  static async findAll() {
    const db = getDb();
    const rows = await all(db, 'SELECT * FROM car');
    return rows.map((row) => Car.fromObject(row));
  }

  static async find(id) {
    const db = getDb();
    const row = await get(db, 'SELECT * FROM car WHERE id = ?', [id]);
    return row ? Car.fromObject(row) : null;
  }

  async save() {
    const db = getDb();
    if (!this.id) {
      const result = await run(
        db,
        'INSERT INTO car (manufacturer, model, color, year) VALUES (?, ?, ?, ?)',
        [this.manufacturer, this.model, this.color, this.year]
      );
      this.id = result.lastID;
      return;
    }

    await run(
      db,
      'UPDATE car SET manufacturer = ?, model = ?, color = ?, year = ? WHERE id = ?',
      [this.manufacturer, this.model, this.color, this.year, this.id]
    );
  }

  async delete() {
    if (!this.id) {
      return;
    }
    const db = getDb();
    await run(db, 'DELETE FROM car WHERE id = ?', [this.id]);
    this.id = null;
    this.manufacturer = null;
    this.model = null;
    this.color = null;
    this.year = null;
  }
}

module.exports = Car;
