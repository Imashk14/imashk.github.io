from flask import Blueprint, abort, redirect, render_template, request, url_for

from app.model.car import Car, find, find_all

bp = Blueprint("car", __name__)


@bp.route("/cars")
def index():
    cars = find_all()
    return render_template("car/index.html", cars=cars)


@bp.route("/cars/<int:id>")
def show(id: int):
    car = find(id)
    if not car:
        abort(404)
    return render_template("car/show.html", car=car)


@bp.route("/cars/create", methods=["GET", "POST"])
def create():
    if request.method == "POST":
        manufacturer = request.form.get("car[manufacturer]")
        model = request.form.get("car[model]")
        color = request.form.get("car[color]")
        year = request.form.get("car[year]")

        car = Car()
        car.manufacturer = manufacturer
        car.model = model
        car.color = color
        try:
            car.year = int(year) if year else None
        except ValueError:
            car.year = None

        car.save()
        return redirect(url_for("car.index"))

    return render_template("car/create.html", car=None)


@bp.route("/cars/<int:id>/edit", methods=["GET", "POST"])
def edit(id: int):
    car = find(id)
    if not car:
        abort(404)

    if request.method == "POST":
        car.manufacturer = request.form.get("car[manufacturer]")
        car.model = request.form.get("car[model]")
        car.color = request.form.get("car[color]")
        year = request.form.get("car[year]")
        try:
            car.year = int(year) if year else None
        except ValueError:
            car.year = None

        car.save()
        return redirect(url_for("car.show", id=car.id))

    return render_template("car/edit.html", car=car)


@bp.route("/cars/delete", methods=["POST"])
def delete():
    id_value = request.form.get("id") or request.form.get("car[id]")
    if not id_value:
        abort(400)

    try:
        id_int = int(id_value)
    except ValueError:
        abort(400)

    car = find(id_int)
    if car:
        car.delete()

    return redirect(url_for("car.index"))
