<?php
spl_autoload_register(function(string $class): void {
    $paths = [
        __DIR__ . '/lib/' . $class . '.php',
        __DIR__ . '/lib/Encoder/' . $class . '.php',
    ];

    foreach ($paths as $file) {
        if (file_exists($file)) {
            require $file;
            return;
        }
    }
});