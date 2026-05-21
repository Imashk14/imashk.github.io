<?php

class YamlEncoder implements EncoderInterface
{
    public function supports(string $format): bool
    {
        return $format === 'yaml';
    }

    public function decode(string $data): array
    {
        if (!extension_loaded('yaml')) {
            throw new RuntimeException("YAML extension not loaded.");
        }
        $decoded = yaml_parse($data);
        return is_array($decoded) ? $decoded : [];
    }

    public function encode(array $data): string
    {
        if (!extension_loaded('yaml')) {
            throw new RuntimeException("YAML extension not loaded.");
        }
        return yaml_emit($data);
    }
}