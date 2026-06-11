<?php

$outputFile = $argv[1] ?? __DIR__ . '/images-urls';

$numberOfJpg = 8;
$numberOfpng = 4;
$numberOfImages = $numberOfJpg + $numberOfpng;

$keyHex = "7365637265746b657931323334353637";
$saltHex = "73656372657473616c74313233343536";

$key = pack("H*", $keyHex);
$salt = pack("H*", $saltHex);

$urls = [];

for ($i = 1; $i <= $numberOfImages; $i++) {
    if ($i <= $numberOfJpg) {
        $format = "jpg";
    } else {
        $format = "png";
    }

    $timestamp = time();
    // L'image d'origine (Wikipedia)
    $imageUrl = "https://image.chapi.ch/wp-content/uploads/raw/v-$timestamp/image-test-$i.$format";

    // On encode l'URL de l'image
    $encodedUrl = rtrim(strtr(base64_encode($imageUrl), '+/', '-_'), '=');

    // On définit les paramètres de transformation (redimensionnement à 400x400)
    $path = "/" . $encodedUrl;

    // On calcule la signature
    $signature = rtrim(strtr(base64_encode(hash_hmac('sha256', $salt . $path, $key, true)), '+/', '-_'), '=');

    $urls[] = "https://resize.chapi.ch/" . $signature . $path;
}

file_put_contents($outputFile, implode(PHP_EOL, $urls) . PHP_EOL);

echo "URLs écrites dans : {$outputFile}\n";
