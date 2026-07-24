<?php

namespace App;

use Timber\Timber;

$context = Timber::context();

Timber::render('templates/single-jobs.twig', $context);
