<?php

/**
 * @file
 * Disable & Remove the Comments content type menu links.
 */

add_action('admin_menu', 'remove_comment_menu');

/**
 * Remove the Comments link on the admin sidebar.
 *
 * @see https://stackoverflow.com/questions/17393887/how-to-remove-posts-from-admin-sidebar-in-wordpress
 */
function remove_comment_menu(): void
{
  remove_menu_page('edit-comments.php');
}

add_action('init', 'remove_comment_support', 100);
function remove_comment_support(): void
{
  remove_post_type_support('post', 'comments');
  remove_post_type_support('page', 'comments');
}

add_action('wp_before_admin_bar_render', 'remove_comment_admin_bar');

/**
 * Remove the Comments "add new" link on the admin top bar.
 *
 * @see https://wordpress.stackexchange.com/questions/76642/remove-admin-bar-new-post-link-media-sub-menu
 */
function remove_comment_admin_bar(): void
{
  global $wp_admin_bar;
  $wp_admin_bar->remove_menu('comments');
}
