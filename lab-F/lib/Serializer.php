<?php
class Serializer
{
    private array $encoders = [];

    public function __construct() {
        $this->encoders = [
            new CsvEncoder(),
            new SsvEncoder(),
            new TsvEncoder(),
            new JsonEncoder(),
            new YamlEncoder()
        ];
    }

    private function findEncoder(string $format): EncoderInterface {
        foreach ($this->encoders as $encoder) {
            if ($encoder->supports($format)) {
                return $encoder;
            }
        }
        throw new InvalidArgumentException("Unsupported format: $format");
    }

    public function convert(string $input, string $inputFormat, string $outputFormat): string {
        if (trim($input) === '') return '';

        $decoder = $this->findEncoder($inputFormat);
        $encoder = $this->findEncoder($outputFormat);

        $normalized = $decoder->decode($input);
        return $encoder->encode($normalized);
    }

}