<?php

$context = [];
$context['theme'] = [
  'link' => get_template_directory_uri(),
];

if ($attributes['type'] === 'link') {
  $context['link'] = isset($attributes['link']) ? $attributes['link'] : null;
  $context['is_blank'] = isset($attributes['isBlank']) && $attributes['isBlank'] ? true : false;
} else {
  $context['link'] = isset($attributes['file']) ? $attributes['file'] : null;
  $context['is_download'] = true;
  $context['is_blank'] = true;
}

$context['size'] = 'medium';
$context['type'] = 'secondary';
$context['text'] = isset($attributes['label']) ? $attributes['label'] : null;
$context['icon_left'] = isset($attributes['iconLeft']) ? $attributes['iconLeft'] : null;
$context['icon_right'] = isset($attributes['iconRight']) ? $attributes['iconRight'] : null;


// if no text or no link (link or file)
if (empty($context['link']) || empty($context['text'])) {
  return null;
}

Timber::render(get_template_directory() . '/views/partials/button.twig', $context);
