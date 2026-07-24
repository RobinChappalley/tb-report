<?php

namespace App;

use Timber\Timber;

$context = Timber::context();

$context['publications'] = Timber::get_posts(
  [
    'post_type' => 'publications',
    'posts_per_page' => -1,
    'post_status' => 'publish'
  ]
);

$context['items'] = $context['publications'];
$context['context_prefix'] = 'publications';
Timber::render('templates/archive-publications-presses.twig', $context);
