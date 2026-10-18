<?php
if (!defined('ABSPATH')) exit;

/* ---------------------------------------------------------------------
   [ajalisco_jobs] — renders the role grid + detail/apply modal.
   Drop this shortcode into any page, including an Elementor "Shortcode"
   widget on the Careers page.
------------------------------------------------------------------------ */
function ajx_careers_enqueue_assets() {
    wp_register_style('ajx-careers', AJX_CAREERS_URL . 'assets/careers.css', [], AJX_CAREERS_VERSION);
    wp_register_script('ajx-careers', AJX_CAREERS_URL . 'assets/careers.js', [], AJX_CAREERS_VERSION, true);
    wp_enqueue_style('ajx-careers');
    wp_enqueue_script('ajx-careers');
    wp_localize_script('ajx-careers', 'ajxCareers', [
        'ajaxUrl' => admin_url('admin-ajax.php'),
        'nonce' => wp_create_nonce('ajx_careers_apply'),
        'jobs' => ajx_careers_get_jobs_for_js(),
    ]);
}
add_action('wp_enqueue_scripts', 'ajx_careers_enqueue_assets');

function ajx_careers_get_jobs_for_js() {
    $posts = get_posts([
        'post_type' => 'ajx_job',
        'post_status' => 'publish',
        'numberposts' => -1,
        'orderby' => 'menu_order',
        'order' => 'ASC',
    ]);

    $jobs = [];
    foreach ($posts as $post) {
        $lines = function ($meta_key) use ($post) {
            $raw = get_post_meta($post->ID, $meta_key, true);
            return array_values(array_filter(array_map('trim', explode("\n", (string) $raw))));
        };
        $jobs[] = [
            'id' => $post->ID,
            'title' => $post->post_title,
            'type' => get_post_meta($post->ID, 'ajx_type', true),
            'location' => get_post_meta($post->ID, 'ajx_location', true),
            'summary' => get_post_meta($post->ID, 'ajx_summary', true),
            'responsibilities' => $lines('ajx_responsibilities'),
            'requirements' => $lines('ajx_requirements'),
        ];
    }
    return $jobs;
}

function ajx_careers_render_shortcode($atts) {
    $atts = shortcode_atts(['view_all_url' => ''], $atts, 'ajalisco_jobs');
    ob_start();
    ?>
    <div class="ajx-careers" data-view-all-url="<?php echo esc_attr($atts['view_all_url']); ?>">
      <div class="ajx-jobs-wrap">
        <div class="ajx-jobs" data-ajx-jobs aria-live="polite"></div>
        <button class="ajx-jobs__nav ajx-jobs__nav--prev" type="button" data-jobs-nav="-1" aria-label="Previous roles">‹</button>
        <button class="ajx-jobs__nav ajx-jobs__nav--next" type="button" data-jobs-nav="1" aria-label="Next roles">›</button>
      </div>

      <dialog class="ajx-modal" id="ajxJobModal" aria-labelledby="ajxJobModalTitle">
        <div class="ajx-modal__inner" data-ajx-job-body></div>
      </dialog>

      <div class="ajx-toast" data-ajx-toast role="status" aria-live="polite"></div>
    </div>
    <?php
    return ob_get_clean();
}
add_shortcode('ajalisco_jobs', 'ajx_careers_render_shortcode');
