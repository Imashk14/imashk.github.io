import sqlite3
import os

DB_PATH = os.path.join(os.path.dirname(__file__), '..', '..', 'data.db')

def get_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def from_array(array):
    car = Car()
    car.fill(array)

    return car

def find(id: int):
    conn = get_connection()
    sql = "SELECT * FROM car WHERE id = ?"
    cursor = conn.cursor()
    cursor.execute(sql, (id,))
    row = cursor.fetchone()
    conn.close()

    if row is None:
        return None
    else:
        return from_array(row)

def find_all():
    conn = get_connection()
    sql = "SELECT * FROM car"
    cursor = conn.cursor()
    cursor.execute(sql)
    rows = cursor.fetchall()
    conn.close()

    return [from_array(row) for row in rows]

class Car:
    id: int = None
    manufacturer: str = None
    model: str = None
    color: str = None
    year: int = None

    def get_id(self):
        return self.id

    def set_id(self, id):
        self.id = id

    def get_manufacturer(self):
        return self.manufacturer

    def set_manufacturer(self, manufacturer):
        self.manufacturer = manufacturer

    def get_model(self):
        return self.model

    def set_model(self, model):
        self.model = model

    def get_color(self):
        return self.color

    def set_color(self, color):
        self.color = color

    def get_year(self):
        return self.year

    def set_year(self, year):
        self.year = year

    def fill(self, array):
        if array['id'] is not None and self.get_id() is None:
            self.set_id(array['id'])
        if array['manufacturer'] is not None and self.get_manufacturer() is None:
            self.set_manufacturer(array['manufacturer'])
        if (array['model'] is not None) and self.get_model() is None:
            self.set_model(array['model'])
        if (array['color'] is not None) and self.get_color() is None:
            self.set_color(array['color'])
        if (array['year'] is not None) and self.get_year() is None:
            self.set_year(array['year'])

    def save(self):
        conn = sqlite3.connect(DB_PATH)

        if self.get_id() is None:
            sql = "INSERT INTO car (manufacturer, model, color, year) VALUES (?, ?, ?, ?)"
            cursor = conn.cursor()
            cursor.execute(sql, (self.get_manufacturer(), self.get_model(), self.get_color(), self.get_year()))
            conn.commit()
            self.set_id(cursor.lastrowid)
        else:
            sql = "UPDATE car SET manufacturer = ?, model = ?, color = ?, year = ? WHERE id = ?"
            cursor = conn.cursor()
            cursor.execute(sql, (self.get_manufacturer(), self.get_model(), self.get_color(), self.get_year(), self.get_id()))
            conn.commit()

        conn.close()

    def delete(self):
        conn = sqlite3.connect(DB_PATH)
        sql = "DELETE FROM car WHERE id = ?"
        cursor = conn.cursor()
        cursor.execute(sql, (self.get_id(),))
        conn.commit()
        conn.close()

        self.set_id(None)
        self.set_manufacturer(None)
        self.set_model(None)
        self.set_color(None)
        self.set_year(None)