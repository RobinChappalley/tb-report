<?php

namespace App;

use Timber\Timber;

$context = Timber::context();

$context['is_hero_news'] = true;

$timber_post = Timber::get_post();
$context['post'] = $timber_post;

$current_post_type = $timber_post->post_type;

// Get categories based on post type
$taxonomy = ($current_post_type === 'news') ? 'post_categories' : 'category';
$context['categories'] = $timber_post->terms([ 'taxonomy' => $taxonomy ]);

// Build query args for related posts
$query_args = [
  'post_type' => $current_post_type,
  'posts_per_page' => 3,
  'orderby' => 'date',
  'order' => 'DESC',
  'post__not_in' => [$timber_post->ID],
  'post_status' => 'publish',
];

// Only show related posts if they share at least one category
if (!empty($context['categories']) && is_array($context['categories'])) {
  $category_ids = array_map(
    function ($term) {
      return $term->ID;
    },
    $context['categories']
  );

  if (!empty($category_ids)) {
    $query_args['tax_query'] = [
      [
        'taxonomy' => $taxonomy,
        'field' => 'term_id',
        'terms' => $category_ids,
        'operator' => 'IN',
      ],
    ];
  }
}

$context['related_news'] = Timber::get_posts($query_args);

// Set archive link
if ($current_post_type === 'news') {
  $context['news_archive_link'] = get_post_type_archive_link('news');
} else {
  $blog_page_id = get_option('page_for_posts');
  $context['news_archive_link'] = $blog_page_id ? get_permalink($blog_page_id) : home_url('/');
}

Timber::render('templates/single-news.twig', $context);
