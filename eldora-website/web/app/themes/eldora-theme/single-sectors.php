<?php

namespace App;

use Timber\Timber;

$context = Timber::context();

$context['is_hero_single'] = true;

Timber::render('templates/single-sectors.twig', $context);
