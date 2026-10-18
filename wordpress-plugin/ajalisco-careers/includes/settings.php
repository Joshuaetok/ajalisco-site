<?php
if (!defined('ABSPATH')) exit;

/* ---------------------------------------------------------------------
   Settings → Job Postings → Settings: where applications get emailed.
------------------------------------------------------------------------ */
function ajx_careers_add_settings_page() {
    add_submenu_page(
        'edit.php?post_type=ajx_job',
        'Careers Settings',
        'Settings',
        'manage_options',
        'ajx-careers-settings',
        'ajx_careers_render_settings_page'
    );
}
add_action('admin_menu', 'ajx_careers_add_settings_page');

function ajx_careers_register_settings() {
    register_setting('ajx_careers_settings', 'ajx_careers_receiving_email', [
        'type' => 'string',
        'sanitize_callback' => 'ajx_careers_sanitize_email_setting',
        'default' => '',
    ]);

    add_settings_section('ajx_careers_main', '', null, 'ajx-careers-settings');

    add_settings_field(
        'ajx_careers_receiving_email',
        'Receiving Email',
        'ajx_careers_render_email_field',
        'ajx-careers-settings',
        'ajx_careers_main'
    );
}
add_action('admin_init', 'ajx_careers_register_settings');

function ajx_careers_sanitize_email_setting($value) {
    $value = sanitize_text_field($value);
    if ($value !== '' && !is_email($value)) {
        add_settings_error(
            'ajx_careers_receiving_email',
            'ajx_careers_invalid_email',
            'That doesn\'t look like a valid email address — the previous value was kept.'
        );
        return get_option('ajx_careers_receiving_email', '');
    }
    return sanitize_email($value);
}

function ajx_careers_render_email_field() {
    $value = get_option('ajx_careers_receiving_email', '');
    printf(
        '<input type="email" name="ajx_careers_receiving_email" value="%s" class="regular-text" placeholder="%s">',
        esc_attr($value),
        esc_attr(get_option('admin_email'))
    );
    echo '<p class="description">Job applications submitted through the <code>[ajalisco_jobs]</code> form are emailed to this address. Leave blank to use the site\'s admin email (' . esc_html(get_option('admin_email')) . ').</p>';
}

function ajx_careers_receiving_email() {
    $email = get_option('ajx_careers_receiving_email', '');
    return $email !== '' ? $email : get_option('admin_email');
}

function ajx_careers_render_settings_page() {
    if (!current_user_can('manage_options')) return;
    ?>
    <div class="wrap">
        <h1>Careers Settings</h1>
        <form action="options.php" method="post">
            <?php
            settings_fields('ajx_careers_settings');
            do_settings_sections('ajx-careers-settings');
            submit_button('Save Settings');
            ?>
        </form>
    </div>
    <?php
}
