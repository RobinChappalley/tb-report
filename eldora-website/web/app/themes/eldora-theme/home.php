<?php

/**
 * Template for the blog posts index page (Actualités)
 * Used when a static page is set as the front page
 */

namespace App;

require_once __DIR__ . '/src/BlogArchive.php';

$archive = new BlogArchive('actualites');
$archive->render();
