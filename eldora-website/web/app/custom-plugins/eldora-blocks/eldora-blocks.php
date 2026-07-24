<?php

/**
 * Plugin Name:       Eldora Blocks
 * Description:       Blocs Gutenberg pour Eldora.
 * Requires PHP:      8.2
 * Version:           0.0.0
 * Author:            Antistatique
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       eldora
 *
 * @package CreateBlock
*/

if (! defined('ABSPATH')) {
  exit; // Exit if accessed directly.
}

function eldora_blocks_init()
{
  register_block_type(__DIR__ . '/image-metrics/build');
  register_block_type(__DIR__ . '/image-metrics-number/build');
  register_block_type(__DIR__ . '/full-screen-image/build');
  register_block_type(__DIR__ . '/text-image-grid/build');
  register_block_type(__DIR__ . '/image-carousel-static/build');
  register_block_type(__DIR__ . '/gradient-container/build');
  register_block_type(__DIR__ . '/numbered-cards-container/build');
  register_block_type(__DIR__ . '/numbered-card/build');
  register_block_type(__DIR__ . '/actions-container/build');
  register_block_type(__DIR__ . '/action/build');
  register_block_type(__DIR__ . '/two-columns/build');
  register_block_type(__DIR__ . '/two-columns-column/build');
  register_block_type(__DIR__ . '/accordion/build');
  register_block_type(__DIR__ . '/testimonial/build');
  register_block_type(__DIR__ . '/testimonials-slider/build');
  register_block_type(__DIR__ . '/media/build');
  register_block_type(__DIR__ . '/pole-card/build');
  register_block_type(__DIR__ . '/pole-card-container/build');
  register_block_type(__DIR__ . '/headings-description-card/build');
  register_block_type(__DIR__ . '/headings-description-card-container/build');
  register_block_type(__DIR__ . '/image-text-card/build');
  register_block_type(__DIR__ . '/image-text-card-container/build');
  register_block_type(__DIR__ . '/news-card-container/build');
  register_block_type(__DIR__ . '/parent-card/build');
  register_block_type(__DIR__ . '/parent-card-container/build');
  register_block_type(__DIR__ . '/intro-title/build');
  register_block_type(__DIR__ . '/intro-title-container/build');
  register_block_type(__DIR__ . '/social-post-cards/build');
  register_block_type(__DIR__ . '/commitment-card/build');
  register_block_type(__DIR__ . '/commitment-card-container/build');
}
add_action('init', 'eldora_blocks_init');
