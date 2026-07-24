<?php

$finder = PhpCsFixer\Finder::create()
  ->in(['web/app/themes/eldora-theme'])
  ->in(['web/app/custom-plugins'])
  ->exclude('node_modules')
  ->exclude('vendors')
  ->exclude('web/wp')
  ->exclude('build')
  ->name('*.php')
  ->name('*.twig')
;

$config = new PhpCsFixer\Config();
$config->setFinder($finder);

$config->setIndent("  ");

$rules = [];
$rules['@PSR12'] = TRUE;
$rules['statement_indentation'] = FALSE;
$rules['global_namespace_import'] = FALSE;
$rules['no_superfluous_phpdoc_tags'] = FALSE;
$rules['ordered_class_elements']['sort_algorithm'] = 'none';

$rules['fully_qualified_strict_types'] = [
  'import_symbols' => true,
  'leading_backslash_in_global_namespace' => false,
  'phpdoc_tags' => [],
];

$config->setRules($rules);
return $config;
