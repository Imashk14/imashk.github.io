<?php

/** @var \src\Model\Car $car */
/** @var \src\Service\Router $router */

$title = "{$car->getManufacturer()} {$car->getModel()} ({$car->getId()})";
$bodyClass = 'show';

ob_start(); ?>
    <h1><?= $car->getManufacturer() ?> <?= $car->getModel() ?></h1>
    <article>
        <p><strong>Color:</strong> <?= $car->getColor() ?></p>
        <p><strong>Year:</strong> <?= $car->getYear() ?></p>
    </article>

    <ul class="action-list">
        <li> <a href="<?= $router->generatePath('car-index') ?>">Back to list</a></li>
        <li><a href="<?= $router->generatePath('car-edit', ['id'=> $car->getId()]) ?>">Edit</a></li>
    </ul>
<?php $main = ob_get_clean();

include __DIR__ . DIRECTORY_SEPARATOR . '..' . DIRECTORY_SEPARATOR . 'base.html.php';
