<?php

/**
 * @file
 * Enable File Modification for Loco and Language Pack.
 *
 * By default, file modification is disallowed by WordPress config.
 * This in turn honours the `DISALLOW_FILE_MODS` configuration.
 *
 * @see https://localise.biz/wordpress/plugin/manual/filesystem#mods
 */

add_filter(
  'file_mod_allowed',
  fn (bool $file_mod_allowed, string $context) => $context === 'download_language_pack' ? true : $file_mod_allowed,
  10,
  2
);
