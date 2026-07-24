<?php

/**
 * The template for the 404 page
 */

namespace App;

use Timber\Timber;

$context = Timber::context();
$context['is_404'] = is_404();

Timber::render('templates/404.twig', $context);
