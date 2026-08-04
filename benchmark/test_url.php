<?php

function buildImgproxyUrl(string $src, string $ops = '', string $imgproxyBase = '', string $keyHex = '', string $saltHex = ''): string
{
    if (!$src) {
        return '';
    }

    $originalSrc = $src;

    $imgproxyBase = $imgproxyBase ?: (getenv('IMGPROXYURL') ?: ($_ENV['IMGPROXYURL'] ?? $_SERVER['IMGPROXYURL'] ?? 'https://resize.chapi.ch'));
    $keyHex = $keyHex ?: (getenv('IMGPROXYKEY') ?: ($_ENV['IMGPROXYKEY'] ?? $_SERVER['IMGPROXYKEY'] ?? '7365637265746b657931323334353637'));
    $saltHex = $saltHex ?: (getenv('IMGPROXYSALT') ?: ($_ENV['IMGPROXYSALT'] ?? $_SERVER['IMGPROXYSALT'] ?? '73656372657473616c74313233343536'));

    if (strpos($src, '//') === false && preg_match('#^[a-z]+://#i', $src) === 0) {
        $src = 'https://www.eldora.ch' . $src;
    }

    error_log('imgproxy debug - source url before encoding: ' . $src);

    $encoded = rtrim(strtr(base64_encode($src), '+/', '-_'), '=');
    $ops = trim($ops, '/');
    $path = ($ops !== '' ? $ops . '/' : '') . $encoded;

    if (!$imgproxyBase) {
        return $originalSrc;
    }

    $imgproxyBase = rtrim($imgproxyBase, '/');

    if ($keyHex && $saltHex) {
        $binaryKey = @hex2bin($keyHex);
        $binarySalt = @hex2bin($saltHex);

        if ($binaryKey !== false && $binarySalt !== false) {
            $toSign = '/' . $path;
            $raw = hash_hmac('sha256', $binarySalt . $toSign, $binaryKey, true);
            $signature = rtrim(strtr(base64_encode($raw), '+/', '-_'), '=');

            return $imgproxyBase . '/' . $signature . '/' . $path;
        }
    }

    return $imgproxyBase . '/insecure/' . $path;
}

$outputFile = $argv[1] ?? __DIR__ . '/prdd-urls';

$imageUrl = 'https://www.eldora.ch/app/uploads/2025/08/Photo_de_garde-1-683x1024.jpg';
$ops = 'h:500/w:400';

$urls = [
    buildImgproxyUrl($imageUrl, $ops),
];

file_put_contents($outputFile, implode(PHP_EOL, $urls) . PHP_EOL);

echo "URLs écrites dans : {$outputFile}\n";
