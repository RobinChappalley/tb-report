<?php

$outputFile = $argv[1] ?? __DIR__ . '/prdd-urls';

$numberOfJpg = 8;
$numberOfpng = 4;
$numberOfImages = $numberOfJpg + $numberOfpng;

$keyHex = "7365637265746b657931323334353637";
$saltHex = "73656372657473616c74313233343536";

$key = pack("H*", $keyHex);
$salt = pack("H*", $saltHex);

$urls = [];


$parameters = "/h:400/w:400";
    $timestamp = time();
    // L'image d'origine (Wikipedia)
    $imageUrl = "https://content-staging.luxurytribune.com/app/uploads/2026/04/Baccarat-Crystal-Crypt-©-Emanuelle-Luciani-©-Southway-Studio-1.jpg";
    // On encode l'URL de l'image
    $encodedUrl = rtrim(strtr(base64_encode($imageUrl), '+/', '-_'), '=');

    // On définit les paramètres de transformation (redimensionnement à 400x400)
    $path = "/" . $encodedUrl;

    // On calcule la signature
    $signature = rtrim(strtr(base64_encode(hash_hmac('sha256', $salt . $path, $key, true)), '+/', '-_'), '=');

    $urls[] = "https://resize.chapi.ch/" . $signature . $parameters . $path;


file_put_contents($outputFile, implode(PHP_EOL, $urls) . PHP_EOL);

echo "URLs écrites dans : {$outputFile}\n";
