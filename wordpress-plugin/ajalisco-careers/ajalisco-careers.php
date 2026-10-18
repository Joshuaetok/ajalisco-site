<?php
/**
 * Plugin Name: Ajalisco Careers
 * Plugin URI: https://ajaliscogroup.com
 * Description: Manage job postings as a custom post type ("Job Postings") and show them on the front end as a modern card grid with a role-detail and application form. Applications (with an optional résumé/CV attachment) are emailed to the address configured under Job Postings → Settings. Place the [ajalisco_jobs] shortcode on any page — including inside an Elementor Shortcode widget.
 * Version: 1.0.0
 * Author: Ajalisco Production Industries Limited
 * Text Domain: ajalisco-careers
 */

if (!defined('ABSPATH')) exit;

define('AJX_CAREERS_VERSION', '1.0.0');
define('AJX_CAREERS_FILE', __FILE__);
define('AJX_CAREERS_PATH', plugin_dir_path(__FILE__));
define('AJX_CAREERS_URL', plugin_dir_url(__FILE__));

require_once AJX_CAREERS_PATH . 'includes/cpt.php';
require_once AJX_CAREERS_PATH . 'includes/settings.php';
require_once AJX_CAREERS_PATH . 'includes/ajax.php';
require_once AJX_CAREERS_PATH . 'includes/shortcode.php';

function ajx_careers_activate() {
    ajx_careers_register_cpt();
    flush_rewrite_rules();
    ajx_careers_seed_jobs();
}
register_activation_hook(__FILE__, 'ajx_careers_activate');

function ajx_careers_deactivate() {
    flush_rewrite_rules();
}
register_deactivation_hook(__FILE__, 'ajx_careers_deactivate');
