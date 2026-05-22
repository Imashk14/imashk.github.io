<?php

/** @var \src\Model\Car[] $cars */
/** @var \src\Service\Router $router */

$title = 'Car List';
$bodyClass = 'index';

ob_start(); ?>
    <h1>Cars List</h1>

    <a href="<?= $router->generatePath('car-create') ?>">Create new</a>

    <ul class="index-list">
        <?php foreach ($cars as $car): ?>
            <li>
                <h3><?= $car->getManufacturer() ?></h3>
                <p><strong>Model:</strong> <?= $car->getModel() ?></p>
                <p><strong>Color:</strong> <?= $car->getColor() ?></p>
                <p><strong>Year:</strong> <?= $car->getYear() ?></p>
                <ul class="action-list">
                    <li><a href="<?= $router->generatePath('car-show', ['id' => $car->getId()]) ?>">Details</a></li>
                    <li><a href="<?= $router->generatePath('car-edit', ['id' => $car->getId()]) ?>">Edit</a></li>
                </ul>
            </li>
        <?php endforeach; ?>
    </ul>

<?php $main = ob_get_clean();

include __DIR__ . DIRECTORY_SEPARATOR . '..' . DIRECTORY_SEPARATOR . 'base.html.php';
