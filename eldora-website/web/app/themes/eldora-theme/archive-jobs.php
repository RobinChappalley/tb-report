<?php

namespace App;

use Timber\Timber;

$context = Timber::context();

$context['jobs'] = Timber::get_posts(
  [
    'post_type' => 'jobs',
    'posts_per_page' => -1,
    'post_status' => 'publish'
  ]
);

Timber::render('templates/archive-jobs.twig', $context);
