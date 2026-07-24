<?php

// Restrict natif heading block to only H2 and H3 levels

function define_editor_heading_levels($args, $block_type)
{
  if ('core/heading' !== $block_type) {
    return $args;
  }

  $args['attributes']['levelOptions']['default'] = [ 2, 3, 4, 5, 6 ];

  return $args;
}
add_filter('register_block_type_args', 'define_editor_heading_levels', 10, 2);
