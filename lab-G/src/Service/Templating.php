<?php
namespace src\Service;

use src\Exception\ConfigException;
use src\Exception\FrameworkException;

class Templating
{
    public function render(string $template, ?array $params = []): string
    {
        ob_start();
        extract($params);
        $template = str_replace('/', DIRECTORY_SEPARATOR, $template);
        $path = __DIR__
            . DIRECTORY_SEPARATOR . '..'
            . DIRECTORY_SEPARATOR . '..'
            . DIRECTORY_SEPARATOR . 'templates'
            . DIRECTORY_SEPARATOR . $template;

        require $path;
        $html = ob_get_clean();

        return $html;
    }
}
