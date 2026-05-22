<?php

namespace src\Model;

use src\Service\Config;

class Car
{
    private ?int $id = null;
    private ?string $manufacturer = null;
    private ?string $model = null;
    private ?string $color = null;
    private ?int $year = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function setId(?int $id): void
    {
        $this->id = $id;
    }

    public function getManufacturer(): ?string
    {
        return $this->manufacturer;
    }

    public function setManufacturer(?string $manufacturer): void
    {
        $this->manufacturer = $manufacturer;
    }

    public function getModel(): ?string
    {
        return $this->model;
    }

    public function setModel(?string $model): void
    {
        $this->model = $model;
    }

    public function getColor(): ?string
    {
        return $this->color;
    }

    public function setColor(?string $color): void
    {
        $this->color = $color;
    }

    public function getYear(): ?int
    {
        return $this->year;
    }

    public function setYear(?int $year): void
    {
        $this->year = $year;
    }

    public static function fromArray($array): Car
    {
        $car = new self();
        $car->fill($array);

        return $car;
    }

    public function fill($array): Car
    {
        if (isset($array['id']) && !$this->getId()) {
            $this->setId($array['id']);
        }
        if (isset($array['manufacturer'])) {
            $this->setManufacturer($array['manufacturer']);
        }
        if (isset($array['model'])) {
            $this->setModel($array['model']);
        }
        if (isset($array['color'])) {
            $this->setColor($array['color']);
        }
        if (isset($array['year'])) {
            $this->setYear($array['year']);
        }
        return $this;
    }

    public static function findAll(): array
    {
        $pdo = new \PDO(Config::get('db_dsn'), Config::get('db_user'), Config::get('db_pass'));
        $sql = 'SELECT * FROM car';
        $statement = $pdo->prepare($sql);
        $statement->execute();

        $cars = [];
        $carsArray = $statement->fetchAll(\PDO::FETCH_ASSOC);
        foreach ($carsArray as $car) {
            $cars[] = Car::fromArray($car);
        }

        return $cars;
    }

    public static function find($id) : ?Car
    {
        $pdo = new \PDO(Config::get('db_dsn'), Config::get('db_user'), Config::get('db_pass'));
        $sql = 'SELECT * FROM car WHERE id = :id';
        $statement = $pdo->prepare($sql);
        $statement->execute(['id' => $id]);

        $carArray = $statement->fetch(\PDO::FETCH_ASSOC);
        if (! $carArray) {
            return null;
        }

        return Car::fromArray($carArray);
    }

    public function save(): void
    {
        $pdo = new \PDO(Config::get('db_dsn'), Config::get('db_user'), Config::get('db_pass'));
        if (!$this->getId()) {
            $sql = "INSERT INTO car ( manufacturer, model, color, year) VALUES (:manufacturer, :model, :color, :year)";
            $statement = $pdo->prepare($sql);
            $statement->execute([
                'manufacturer' => $this->manufacturer,
                'model' => $this->model,
                'color' => $this->color,
                'year' => $this->year
            ]);
        } else {
            $sql = "UPDATE car SET manufacturer = :manufacturer, model = :model, color = :color, year = :year WHERE id = :id";
            $statement = $pdo->prepare($sql);
            $statement->execute([
                'manufacturer' => $this->manufacturer,
                'model' => $this->model,
                'color' => $this->color,
                'year' => $this->year,
                'id' => $this->id
            ]);
        }
    }

    public function delete(): void
    {
        $pdo = new \PDO(Config::get('db_dsn'), Config::get('db_user'), Config::get('db_pass'));
        $sql = 'DELETE FROM car WHERE id = :id';
        $statement = $pdo->prepare($sql);
        $statement->execute([
            'id' => $this->id
        ]);

        $this->setId(null);
        $this->setManufacturer(null);
        $this->setModel(null);
        $this->setColor(null);
        $this->setYear(null);
    }
}