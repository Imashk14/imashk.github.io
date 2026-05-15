<?php

interface EncoderInterface
{
    public function supports();
    public function encode($data);
    public function decode($data);
}