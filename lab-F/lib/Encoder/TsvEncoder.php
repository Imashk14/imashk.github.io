<?php

class TsvEncoder implements EncoderInterface
{
    public function supports(string $format): bool
    {
        return $format === "tsv";
    }

    public function decode(string $data): array
    {
        $lines = explode("\n", trim($data));
        if (empty($lines) || empty($lines[0])) return [];
        $headers = str_getcsv(array_shift($lines), "\t", "\"", "");
        $result = [];

        foreach ($lines as $line) {
            if (trim($line) === '') continue;
            $row = str_getcsv($line, "\t", "\"", "");
            if (count($headers) === count($row)) {
                $result[] = array_combine($headers, $row);
            } else {
                $result[] = $row;
            }
        }
        return $result;
    }

    public function encode(array $data): string
    {
        if (empty($data)) return '';
        $output = fopen('php://temp', 'r+');
        $first = reset($data);

        if (is_array($first) && !array_is_list($first)) {
            fputcsv($output, array_keys($first), "\t", "\"", "");
        }

        foreach ($data as $row) {
            $normalizedRow = array_map(fn($field) => is_scalar($field) || is_null($field) ? $field : json_encode($field), (array)$row);
            fputcsv($output, $normalizedRow, "\t", "\"", "");
        }

        rewind($output);
        $result = stream_get_contents($output);
        fclose($output);
        return trim($result);
    }
}