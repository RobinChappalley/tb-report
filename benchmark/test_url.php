<?php

$numberOfJpg = 8;
$numberOfpng = 4;


$keyHex = "7365637265746b657931323334353637";
$saltHex = "73656372657473616c74313233343536";

$key = pack("H*", $keyHex);
$salt = pack("H*", $saltHex);


for ($i = 1; $i <= $numberOfJpg; $i++) {

// L'image d'origine (Wikipedia)
$imageUrl = "https://image.chapi.ch/wp-content/uploads/raw/image-test-$i.jpg";

// On encode l'URL de l'image
$encodedUrl = rtrim(strtr(base64_encode($imageUrl), '+/', '-_'), '=');

// On définit les paramètres de transformation (redimensionnement à 400x400)
$path = "/format:auto/" . $encodedUrl;

// On calcule la signature
$signature = rtrim(strtr(base64_encode(hash_hmac('sha256', $salt . $path, $key, true)), '+/', '-_'), '=');

// On assemble l'URL finale avec ton IP
echo "Ton URL signée est : \n";
echo "https://resize.chapi.ch/" . $signature . $path . "\n";
}
