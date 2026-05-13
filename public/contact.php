<?php
/**
 * Crushfilms contact intake.
 *
 * Lives next to the static export in public_html/. The contact form posts
 * here; we sanitize, send via the host's mail() transport, and redirect to
 * /contact/thanks/. On failure we render a minimal HTML page with a mailto
 * fallback so the user is never stuck.
 *
 * Deploy note: this file is copied verbatim into out/ by `next build`
 * because anything inside Next's `public/` directory is treated as a
 * static asset. No server-side rendering is involved.
 */

declare(strict_types=1);

$RECIPIENT = 'mward@merrickrobertmedia.com';
$FROM      = 'noreply@merrickrobertmedia.com'; // must be on the hosting domain
$THANKS    = '/contact/thanks/';

// --- 1. method guard ------------------------------------------------------

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    http_response_code(405);
    header('Allow: POST');
    exit('Method Not Allowed');
}

// --- 2. honeypot ----------------------------------------------------------
// The visible form has a hidden `website` field. Real users leave it empty;
// bots fill every input. If it's non-empty, pretend we accepted it.

if (!empty($_POST['website'] ?? '')) {
    header("Location: $THANKS", true, 303);
    exit;
}

// --- 3. collect + sanitize ------------------------------------------------

function clean(string $s): string {
    // Strip CR/LF so submitted values can't inject extra mail headers.
    $s = str_replace(["\r", "\n", "%0A", "%0D"], ' ', $s);
    return trim($s);
}

$name    = clean((string)($_POST['name']    ?? ''));
$email   = clean((string)($_POST['email']   ?? ''));
$company = clean((string)($_POST['company'] ?? ''));
$budget  = clean((string)($_POST['budget']  ?? ''));
$brief   = trim((string)($_POST['brief']    ?? '')); // newlines OK in body
$service = $_POST['service'] ?? [];
if (!is_array($service)) $service = [$service];
$service = array_values(array_filter(array_map('clean', array_map('strval', $service))));

// Collect any additional fields posted by tailored intake forms (e.g. the
// per-package /faith/inquire/<slug>/ pages). We render them in a generic
// "Additional details" section so the PHP doesn't need to know each form's
// schema up front. Known fields above are skipped.
$KNOWN_FIELDS = ['name','email','company','budget','brief','service','website'];
$extras = [];
foreach ($_POST as $key => $val) {
    if (in_array($key, $KNOWN_FIELDS, true)) continue;
    if (is_array($val)) {
        $val = implode(', ', array_map('strval', $val));
    } else {
        $val = (string)$val;
    }
    // Allow newlines for textarea answers but strip header-injection chars
    // from the field name; values get rendered as a plain text body.
    $val = str_replace(["\r"], '', $val);
    if (trim($val) === '') continue;
    $extras[clean((string)$key)] = $val;
}

// --- 4. validate ----------------------------------------------------------

$errors = [];
if ($name === '')                                $errors[] = 'name';
if (!filter_var($email, FILTER_VALIDATE_EMAIL))  $errors[] = 'email';
if ($brief === '')                               $errors[] = 'brief';

if ($errors) {
    fail('Some required fields were missing or invalid: ' . implode(', ', $errors));
}

// --- 5. compose -----------------------------------------------------------

// Per-package inquiry submissions tag the subject with the package name so
// the inbox makes the intent obvious at a glance.
$package = isset($extras['package']) ? clean($extras['package']) : '';
$subject = $package !== ''
    ? "Faith inquiry — {$package} — {$name}"
    : ("New brief from {$name}" . ($company !== '' ? " ({$company})" : ''));

$body  = "New brief submitted via crushfilms.com\n";
$body .= str_repeat('-', 56) . "\n\n";
$body .= "Name:     {$name}\n";
$body .= "Email:    {$email}\n";
if ($company !== '') $body .= "Company:  {$company}\n";
if ($budget  !== '') $body .= "Budget:   {$budget}\n";
if ($service)        $body .= "Services: " . implode(', ', $service) . "\n";
$body .= "\nBrief:\n{$brief}\n\n";
if ($extras) {
    $body .= "Additional details:\n";
    foreach ($extras as $key => $val) {
        $label = ucwords(str_replace('_', ' ', $key));
        // Indent multi-line answers so they read clearly.
        $lines = explode("\n", $val);
        $first = array_shift($lines);
        $body .= sprintf("  %-22s %s\n", $label . ':', $first);
        foreach ($lines as $line) {
            $body .= str_repeat(' ', 25) . $line . "\n";
        }
    }
    $body .= "\n";
}
$body .= str_repeat('-', 56) . "\n";
$body .= "Submitted: " . gmdate('c') . "\n";
$body .= "IP:        " . ($_SERVER['REMOTE_ADDR']     ?? '-') . "\n";
$body .= "UA:        " . clean((string)($_SERVER['HTTP_USER_AGENT'] ?? '-')) . "\n";

$headers   = [];
$headers[] = "From: Crushfilms <{$FROM}>";
$headers[] = "Reply-To: {$name} <{$email}>";
$headers[] = "X-Mailer: crushfilms-contact/1.0";
$headers[] = "Content-Type: text/plain; charset=UTF-8";

// --- 6. send + redirect ---------------------------------------------------

$ok = @mail($RECIPIENT, $subject, $body, implode("\r\n", $headers));

if (!$ok) {
    fail('We couldn\'t send that brief from the server.');
}

header("Location: $THANKS", true, 303);
exit;

// --- helpers --------------------------------------------------------------

function fail(string $message): void {
    http_response_code(500);
    header('Content-Type: text/html; charset=UTF-8');
    $msg = htmlspecialchars($message, ENT_QUOTES, 'UTF-8');
    echo <<<HTML
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Couldn't send — Crushfilms</title>
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <style>
    body { background:#050505; color:#e5e5e5; font-family:-apple-system,system-ui,sans-serif; padding:6rem 1.5rem; max-width:40rem; margin:0 auto; line-height:1.5 }
    h1   { font-size:2rem; letter-spacing:-0.025em; color:#fafafa; margin:0 0 1rem }
    a    { color:#ff3b1f }
  </style>
</head>
<body>
  <h1>That didn't go through.</h1>
  <p>{$msg}</p>
  <p>Email <a href="mailto:mward@merrickrobertmedia.com">mward@merrickrobertmedia.com</a> directly and we'll pick it up from there.</p>
  <p><a href="/contact/">← Back to the form</a></p>
</body>
</html>
HTML;
    exit;
}
