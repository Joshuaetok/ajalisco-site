<?php
if (!defined('ABSPATH')) exit;

/* ---------------------------------------------------------------------
   Custom post type: "Job Posting" (ajx_job)
------------------------------------------------------------------------ */
function ajx_careers_register_cpt() {
    register_post_type('ajx_job', [
        'labels' => [
            'name' => 'Job Postings',
            'singular_name' => 'Job Posting',
            'add_new_item' => 'Add New Job Posting',
            'edit_item' => 'Edit Job Posting',
            'all_items' => 'All Job Postings',
            'menu_name' => 'Job Postings',
        ],
        'public' => true,
        'show_in_menu' => true,
        'menu_icon' => 'dashicons-businessperson',
        'supports' => ['title', 'page-attributes'],
        'has_archive' => false,
        'rewrite' => ['slug' => 'careers'],
        'show_in_rest' => false,
        'capability_type' => 'post',
    ]);
}
add_action('init', 'ajx_careers_register_cpt');

/* ---------------------------------------------------------------------
   Meta box: role type, location, summary, responsibilities, requirements
   (Deliberately no salary field.)
------------------------------------------------------------------------ */
function ajx_careers_meta_fields() {
    return [
        'ajx_type' => ['label' => 'Employment Type', 'type' => 'text', 'placeholder' => 'e.g. Full-time, Business Partnership'],
        'ajx_location' => ['label' => 'Location', 'type' => 'text', 'placeholder' => 'e.g. Umuahia, Abia State'],
        'ajx_summary' => ['label' => 'Short Summary', 'type' => 'textarea', 'placeholder' => 'One or two sentences shown on the role card.'],
        'ajx_responsibilities' => ['label' => 'Responsibilities', 'type' => 'list', 'placeholder' => "One responsibility per line."],
        'ajx_requirements' => ['label' => 'What We\'re Looking For', 'type' => 'list', 'placeholder' => "One requirement per line."],
    ];
}

function ajx_careers_add_meta_box() {
    add_meta_box('ajx_job_details', 'Job Details', 'ajx_careers_render_meta_box', 'ajx_job', 'normal', 'high');
}
add_action('add_meta_boxes', 'ajx_careers_add_meta_box');

function ajx_careers_render_meta_box($post) {
    wp_nonce_field('ajx_careers_save_job', 'ajx_careers_nonce');
    $fields = ajx_careers_meta_fields();
    echo '<p style="color:#666;margin-top:0;">No salary field is shown on the front end — leave pay details out of these fields.</p>';
    foreach ($fields as $key => $field) {
        $value = get_post_meta($post->ID, $key, true);
        echo '<p><label for="' . esc_attr($key) . '"><strong>' . esc_html($field['label']) . '</strong></label><br>';
        if ($field['type'] === 'text') {
            printf(
                '<input type="text" style="width:100%%" id="%1$s" name="%1$s" value="%2$s" placeholder="%3$s">',
                esc_attr($key), esc_attr($value), esc_attr($field['placeholder'])
            );
        } else {
            printf(
                '<textarea style="width:100%%" rows="%4$d" id="%1$s" name="%1$s" placeholder="%3$s">%2$s</textarea>',
                esc_attr($key), esc_textarea($value), esc_attr($field['placeholder']), $field['type'] === 'list' ? 5 : 3
            );
        }
        echo '</p>';
    }
}

function ajx_careers_save_meta($post_id) {
    if (!isset($_POST['ajx_careers_nonce']) || !wp_verify_nonce($_POST['ajx_careers_nonce'], 'ajx_careers_save_job')) return;
    if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) return;
    if (!current_user_can('edit_post', $post_id)) return;

    foreach (ajx_careers_meta_fields() as $key => $field) {
        if (!isset($_POST[$key])) continue;
        if ($field['type'] === 'text') {
            update_post_meta($post_id, $key, sanitize_text_field(wp_unslash($_POST[$key])));
        } else {
            update_post_meta($post_id, $key, sanitize_textarea_field(wp_unslash($_POST[$key])));
        }
    }
}
add_action('save_post_ajx_job', 'ajx_careers_save_meta');

/* ---------------------------------------------------------------------
   Admin list columns
------------------------------------------------------------------------ */
add_filter('manage_ajx_job_posts_columns', function ($columns) {
    $columns['ajx_type'] = 'Type';
    $columns['ajx_location'] = 'Location';
    return $columns;
});
add_action('manage_ajx_job_posts_custom_column', function ($column, $post_id) {
    if ($column === 'ajx_type') echo esc_html(get_post_meta($post_id, 'ajx_type', true));
    if ($column === 'ajx_location') echo esc_html(get_post_meta($post_id, 'ajx_location', true));
}, 10, 2);

/* ---------------------------------------------------------------------
   One-time seed of the five roles already live on the GitHub Pages
   preview, so the admin has real starting content to edit.
------------------------------------------------------------------------ */
function ajx_careers_seed_jobs() {
    if (get_option('ajx_careers_seeded')) return;

    $jobs = [
        ['title' => 'Franchise Partner', 'type' => 'Business Partnership', 'location' => 'Nationwide, Nigeria',
            'summary' => "Bring Ajalisco's water and bread products to your community by owning and running a franchise outlet backed by our production, training and brand support.",
            'responsibilities' => "Set up and manage a retail or distribution outlet under the Ajalisco brand\nMaintain agreed stock levels of Ajalisco water and Jalix bread products\nUphold Ajalisco's quality, hygiene and customer service standards\nReport sales performance and inventory to the partnerships team",
            'requirements' => "Registered business, or willingness to register one\nSuitable retail or storage space in your target location\nCapital to meet the franchise's minimum stock order\nStrong local market knowledge and customer network"],
        ['title' => 'Baker', 'type' => 'Full-time', 'location' => 'Umuahia, Abia State',
            'summary' => "Produce Jalix bread to our quality and hygiene standards across every daily bake, from mixing through to the final bake.",
            'responsibilities' => "Prepare and bake dough according to Ajalisco's recipes and standards\nMonitor oven temperatures and bake times for consistent quality\nFollow food safety and hygiene procedures at every stage\nWork with the mixing and packaging teams to meet daily production targets",
            'requirements' => "Prior experience baking bread in a commercial or industrial setting\nComfortable with early shifts and a fast-paced production floor\nAttention to detail and consistency\nBasic literacy for reading recipes and production logs"],
        ['title' => 'Bakery Assistant', 'type' => 'Full-time', 'location' => 'Umuahia, Abia State',
            'summary' => "Support the bakery team with preparation, packaging and general production tasks that keep the line running smoothly.",
            'responsibilities' => "Assist bakers with ingredient preparation and dough handling\nPack finished bread into Jalix bags, ready for dispatch\nKeep the production area clean and organised throughout shifts\nSupport loading and unloading of ingredients and finished goods as needed",
            'requirements' => "No prior bakery experience required — training provided\nWilling to work on your feet in a hands-on production role\nReliable, punctual and able to work as part of a team\nComfortable with early shifts"],
        ['title' => 'Mixer Operator', 'type' => 'Full-time', 'location' => 'Umuahia, Abia State',
            'summary' => "Operate and maintain our dough mixing equipment, ensuring every batch meets Ajalisco's consistency and quality standards.",
            'responsibilities' => "Measure and combine ingredients according to standard recipes\nOperate industrial mixers safely and correctly\nMonitor dough consistency and flag issues early\nCarry out basic cleaning and maintenance checks on mixing equipment",
            'requirements' => "Experience operating industrial mixing or food-production equipment is an advantage\nComfortable following precise measurements and recipes\nBasic mechanical aptitude for routine equipment checks\nPhysically able to lift and handle ingredient sacks"],
        ['title' => 'Loader', 'type' => 'Full-time', 'location' => 'Umuahia, Abia State',
            'summary' => "Handle the loading, unloading and safe movement of finished water and bread products between production, storage and distribution vehicles.",
            'responsibilities' => "Load and unload delivery vehicles safely and efficiently\nMove finished goods between production, storage and dispatch areas\nCheck outgoing loads against delivery notes for accuracy\nKeep loading bays and storage areas tidy and hazard-free",
            'requirements' => "Physically fit and comfortable with manual handling\nReliable and punctual, able to work early or flexible shifts\nBasic literacy for checking delivery notes and stock sheets\nTeamwork and safety-conscious attitude"],
    ];

    foreach ($jobs as $i => $job) {
        $post_id = wp_insert_post([
            'post_type' => 'ajx_job',
            'post_title' => $job['title'],
            'post_status' => 'publish',
            'menu_order' => $i,
        ]);
        if ($post_id && !is_wp_error($post_id)) {
            update_post_meta($post_id, 'ajx_type', $job['type']);
            update_post_meta($post_id, 'ajx_location', $job['location']);
            update_post_meta($post_id, 'ajx_summary', $job['summary']);
            update_post_meta($post_id, 'ajx_responsibilities', $job['responsibilities']);
            update_post_meta($post_id, 'ajx_requirements', $job['requirements']);
        }
    }

    update_option('ajx_careers_seeded', 1);
}
