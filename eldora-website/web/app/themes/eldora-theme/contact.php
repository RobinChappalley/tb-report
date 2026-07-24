<?php

/* Template Name: Contact */

namespace App;

use Timber\Timber;

$context = Timber::context();
$context['is_contact'] = true;

Timber::render('templates/contact.twig', $context);
