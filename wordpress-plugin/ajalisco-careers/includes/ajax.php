<?php
if (!defined('ABSPATH')) exit;

/* ---------------------------------------------------------------------
   Handles the application form submitted by assets/careers.js.
   Nothing is stored in the database — the application (and the résumé,
   if one was attached) is emailed straight to the configured receiving
   address, then any temporary upload is deleted.
------------------------------------------------------------------------ */
function ajx_careers_handle_application() {
    check_ajax_referer('ajx_careers_apply', 'nonce');

    // Honeypot: real visitors never fill this hidden field in.
    if (!empty($_POST['ajx_hp'])) {
        wp_send_json_success(['message' => 'Thanks! Your application has been received.']);
    }

    $job_id = isset($_POST['job_id']) ? absint($_POST['job_id']) : 0;
    $job = $job_id ? get_post($job_id) : null;
    if (!$job || $job->post_type !== 'ajx_job' || $job->post_status !== 'publish') {
        wp_send_json_error(['message' => 'This role could not be found — please refresh the page and try again.']);
    }

    $name = isset($_POST['name']) ? sanitize_text_field(wp_unslash($_POST['name'])) : '';
    $email = isset($_POST['email']) ? sanitize_email(wp_unslash($_POST['email'])) : '';
    $phone = isset($_POST['phone']) ? sanitize_text_field(wp_unslash($_POST['phone'])) : '';
    $message = isset($_POST['message']) ? sanitize_textarea_field(wp_unslash($_POST['message'])) : '';

    $name = mb_substr($name, 0, 200);
    $phone = mb_substr($phone, 0, 50);
    $message = mb_substr($message, 0, 4000);

    if ($name === '' || $phone === '' || !is_email($email)) {
        wp_send_json_error(['message' => 'Please fill in your name, a valid email and a phone number.']);
    }

    $attachments = [];
    $temp_file = null;
    if (!empty($_FILES['resume']) && !empty($_FILES['resume']['name'])) {
        $result = ajx_careers_handle_resume_upload();
        if (is_wp_error($result)) {
            wp_send_json_error(['message' => $result->get_error_message()]);
        }
        $temp_file = $result;
        $attachments[] = $temp_file;
    }

    $to = ajx_careers_receiving_email();
    $subject = sprintf('New Job Application — %s', $job->post_title);
    $body = "A new application was submitted on the Careers page.\n\n"
        . "Position: {$job->post_title}\n"
        . "Name: {$name}\n"
        . "Email: {$email}\n"
        . "Phone: {$phone}\n"
        . "Message:\n" . ($message !== '' ? $message : '-') . "\n"
        . ($temp_file ? "\n(Résumé/CV attached.)\n" : '');
    $headers = ['Content-Type: text/plain; charset=UTF-8', "Reply-To: {$name} <{$email}>"];

    $sent = wp_mail($to, $subject, $body, $headers, $attachments);

    if ($temp_file && file_exists($temp_file)) {
        @unlink($temp_file);
    }

    if (!$sent) {
        wp_send_json_error(['message' => 'Sorry, something went wrong sending your application. Please try again or reach us directly.']);
    }

    wp_send_json_success(['message' => "Thanks! Your application for {$job->post_title} has been sent."]);
}
add_action('wp_ajax_ajx_submit_application', 'ajx_careers_handle_application');
add_action('wp_ajax_nopriv_ajx_submit_application', 'ajx_careers_handle_application');

/**
 * Validates and moves the uploaded résumé using WordPress's own upload
 * handler (which checks the real file type, not just the extension),
 * then returns the absolute path to the moved file on success.
 *
 * @return string|WP_Error
 */
function ajx_careers_handle_resume_upload() {
    $file = $_FILES['resume'];

    $max_bytes = 5 * 1024 * 1024;
    if ($file['size'] > $max_bytes) {
        return new WP_Error('ajx_file_too_large', 'That résumé is over 5MB — please choose a smaller file.');
    }

    $allowed = [
        'pdf' => 'application/pdf',
        'doc' => 'application/msword',
        'docx' => 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ];

    require_once ABSPATH . 'wp-admin/includes/file.php';
    $overrides = [
        'test_form' => false,
        'mimes' => $allowed,
    ];
    $moved = wp_handle_upload($file, $overrides);

    if (isset($moved['error'])) {
        return new WP_Error('ajx_upload_failed', 'Your résumé could not be uploaded (' . $moved['error'] . '). You can still submit without it.');
    }

    return $moved['file'];
}
