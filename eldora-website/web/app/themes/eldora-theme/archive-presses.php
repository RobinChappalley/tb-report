<?php

namespace App;

use Timber\Timber;

$context = Timber::context();

$context['presses'] = Timber::get_posts(
  [
    'post_type' => 'presses',
    'posts_per_page' => -1,
    'post_status' => 'publish'
  ]
);

$context['items'] = $context['presses'];
$context['context_prefix'] = 'presses';
Timber::render('templates/archive-publications-presses.twig', $context);
