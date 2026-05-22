<?php
    /** @var $car ?\src\Model\Car */
?>

<div class="form-group">
    <label for="manufacturer">Manufacturer</label>
    <input type="text" id="manufacturer" name="car[manufacturer]" value="<?= $car ? $car->getManufacturer() : '' ?>">
</div>

<div class="form-group">
    <label for="model">Model</label>
    <input type="text" id="model" name="car[model]" value="<?= $car ? $car->getModel() : '' ?>">
</div>

<div class="form-group">
    <label for="color">Color</label>
    <input type="text" id="color" name="car[color]" value="<?= $car ? $car->getColor() : '' ?>">
</div>

<div class="form-group">
    <label for="year">Year</label>
    <input type="number" id="year" name="car[year]" value="<?= $car ? $car->getYear() : '' ?>">
</div>

<?php if ($car && $car->getId()): ?>
    <input type="hidden" name="car[id]" value="<?= $car->getId() ?>">
<?php endif; ?>

<div class="form-group">
    <label></label>
    <input type="submit" value="Submit">
</div>
