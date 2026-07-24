<?php

/**
 * Template Name: Recettes
 * Template for the recipes page
 * Displays posts from the "Recettes" category with seasonal filters
 */

namespace App;

require_once __DIR__ . '/src/BlogArchive.php';

$archive = new BlogArchive('recettes', 'templates/archive-recettes.twig');
$archive->render();
