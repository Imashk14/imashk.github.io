import os
import subprocess
from datetime import datetime

from flask import Flask, render_template

from app.controller import car_controller
from app.model.car import find_all


def compile_assets(static_dir):
    less_file = os.path.abspath(os.path.join(static_dir, "less", "style.less"))
    css_file = os.path.abspath(os.path.join(static_dir, "dist", "style.min.css"))

    try:
        if os.path.exists(less_file):
            os.makedirs(os.path.dirname(css_file), exist_ok=True)
            subprocess.run(
                ["npx", "-y", "-p", "less", "lessc", less_file, css_file],
                capture_output=True,
                text=True,
                check=True,
            )
            return
    except Exception:
        pass


def init_db(root_dir):
    db_path = os.path.abspath(os.path.join(root_dir, "data.db"))
    sql_path = os.path.abspath(os.path.join(root_dir, "sql", "01-car.sql"))

    if not os.path.exists(db_path) or os.path.getsize(db_path) == 0:
        try:
            import sqlite3

            conn = sqlite3.connect(db_path)
            if os.path.exists(sql_path):
                with open(sql_path, "r") as f:
                    schema = f.read()
                conn.executescript(schema)
                conn.commit()
            conn.close()
        except Exception:
            pass


def create_app():
    base_dir = os.path.dirname(__file__)
    template_dir = os.path.abspath(os.path.join(base_dir, "templates"))
    static_dir = os.path.abspath(os.path.join(base_dir, "static"))
    root_dir = os.path.abspath(os.path.join(base_dir, ".."))

    # Run setup tasks
    init_db(root_dir)
    compile_assets(static_dir)

    app = Flask(
        __name__,
        template_folder=template_dir,
        static_folder=static_dir,
        static_url_path="/assets",
    )

    @app.context_processor
    def inject_now():
        return {"current_year": datetime.now().year}

    @app.route("/")
    def index():
        cars = find_all()
        return render_template("car/index.html", cars=cars)

    app.register_blueprint(car_controller.bp)

    return app
