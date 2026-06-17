<?php
declare(strict_types=1);

ini_set('display_errors', '0');
ini_set('log_errors', '1');
error_reporting(E_ALL);

const CAPTURE_DEFAULT_ALLOWED_CHANNELS = 'ads,organic';
const CAPTURE_DEFAULT_TIMEOUT_SECONDS = 10;
const CAPTURE_DEFAULT_MAX_BODY_BYTES = 32768;

function capture_load_external_env_file(): void
{
    $envFile = '/home/pameflorescrea.com/.capture.env';

    if (!is_readable($envFile)) {
        return;
    }

    $lines = file($envFile, FILE_IGNORE_NEW_LINES);

    if ($lines === false) {
        return;
    }

    foreach ($lines as $line) {
        $trimmedLine = trim($line);

        if ($trimmedLine === '' || str_starts_with($trimmedLine, '#')) {
            continue;
        }

        $separatorPosition = strpos($trimmedLine, '=');

        if ($separatorPosition === false) {
            continue;
        }

        $key = trim(substr($trimmedLine, 0, $separatorPosition));

        if (preg_match('/^CAPTURE_[A-Z0-9_]+$/', $key) !== 1) {
            continue;
        }

        $existingValue = getenv($key);

        if ($existingValue !== false && trim($existingValue) !== '') {
            continue;
        }

        $value = trim(substr($trimmedLine, $separatorPosition + 1));

        if (strlen($value) >= 2) {
            $firstCharacter = $value[0];
            $lastCharacter = $value[strlen($value) - 1];

            if (($firstCharacter === '"' && $lastCharacter === '"') || ($firstCharacter === "'" && $lastCharacter === "'")) {
                $value = substr($value, 1, -1);
            }
        }

        putenv($key . '=' . $value);
        $_ENV[$key] = $value;
        $_SERVER[$key] = $value;
    }
}

capture_load_external_env_file();

header('Content-Type: application/json');

function capture_env(string $key, string $default = ''): string
{
    $value = getenv($key);

    if ($value === false) {
        return $default;
    }

    $trimmedValue = trim($value);

    return $trimmedValue === '' ? $default : $trimmedValue;
}

function capture_env_bool(string $key, bool $default = false): bool
{
    $value = getenv($key);

    if ($value === false || trim($value) === '') {
        return $default;
    }

    return in_array(strtolower(trim($value)), ['1', 'true', 'yes', 'on'], true);
}

function capture_env_int(string $key, int $default, int $minimum, int $maximum): int
{
    $value = getenv($key);

    if ($value === false || trim($value) === '' || filter_var($value, FILTER_VALIDATE_INT) === false) {
        return $default;
    }

    return max($minimum, min($maximum, (int) $value));
}

function capture_csv(string $value): array
{
    $items = array_map('trim', explode(',', $value));

    return array_values(array_filter($items, static fn (string $item): bool => $item !== ''));
}

function capture_normalize_origin(string $origin): string
{
    $parts = parse_url($origin);

    if (!is_array($parts) || empty($parts['scheme']) || empty($parts['host'])) {
        return '';
    }

    $scheme = strtolower((string) $parts['scheme']);

    if (!in_array($scheme, ['http', 'https'], true)) {
        return '';
    }

    $host = strtolower((string) $parts['host']);
    $port = isset($parts['port']) ? ':' . (int) $parts['port'] : '';

    return $scheme . '://' . $host . $port;
}

function capture_same_origin(): string
{
    $host = $_SERVER['HTTP_HOST'] ?? '';

    if (!is_string($host) || trim($host) === '') {
        return '';
    }

    $isHttps = (
        (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== '' && $_SERVER['HTTPS'] !== 'off')
        || (isset($_SERVER['HTTP_X_FORWARDED_PROTO']) && $_SERVER['HTTP_X_FORWARDED_PROTO'] === 'https')
    );

    return ($isHttps ? 'https' : 'http') . '://' . strtolower(trim($host));
}

function capture_allowed_origins(): array
{
    $configuredOrigins = capture_csv(capture_env('CAPTURE_ALLOWED_ORIGINS'));

    if ($configuredOrigins === []) {
        $sameOrigin = capture_same_origin();

        return $sameOrigin === '' ? [] : [$sameOrigin];
    }

    return array_values(array_filter(
        array_map('capture_normalize_origin', $configuredOrigins),
        static fn (string $origin): bool => $origin !== ''
    ));
}

function capture_origin_allowed(string $requestOrigin, array $allowedOrigins): bool
{
    if ($requestOrigin === '') {
        return true;
    }

    $normalizedOrigin = capture_normalize_origin($requestOrigin);

    return $normalizedOrigin !== '' && in_array($normalizedOrigin, $allowedOrigins, true);
}

function capture_apply_cors(string $requestOrigin): void
{
    if ($requestOrigin === '') {
        return;
    }

    header('Access-Control-Allow-Origin: ' . capture_normalize_origin($requestOrigin));
    header('Vary: Origin');
    header('Access-Control-Allow-Headers: Content-Type');
    header('Access-Control-Allow-Methods: POST, OPTIONS');
}

function respond_json(int $statusCode, array $body): void
{
    http_response_code($statusCode);
    echo json_encode($body, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
    exit;
}

function read_payload_string(array $payload, string $field): string
{
    return isset($payload[$field]) && is_string($payload[$field]) ? trim($payload[$field]) : '';
}

function read_nested_string(array $payload, string $field): string
{
    return isset($payload[$field]) && is_string($payload[$field]) ? trim($payload[$field]) : '';
}

function is_field_name_literal(string $value, string $flatField, string $nestedField): bool
{
    return $value === $flatField || $value === $nestedField;
}

function truncate_for_log(string $value, int $maxLength = 1200): string
{
    if (strlen($value) <= $maxLength) {
        return $value;
    }

    return substr($value, 0, $maxLength) . '... [truncated]';
}

function capture_site_id(): string
{
    return capture_env('CAPTURE_SITE_ID', 'unknown-site');
}

function capture_log_pii(): bool
{
    return capture_env_bool('CAPTURE_LOG_PII', false);
}

function capture_log_event(string $eventType, array $context = []): void
{
    $baseContext = [
        'event' => $eventType,
        'site_id' => capture_site_id(),
        'dry_run' => capture_env_bool('CAPTURE_DRY_RUN', false),
    ];

    $encodedContext = json_encode(
        array_merge($baseContext, redact_for_log($context)),
        JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE
    );

    if ($encodedContext === false) {
        $encodedContext = '{"event":"log_encode_failed"}';
    }

    error_log('[capture.php] ' . truncate_for_log($encodedContext));
}

function redact_for_log(mixed $value): mixed
{
    if (capture_log_pii()) {
        return $value;
    }

    if (is_array($value)) {
        $redacted = [];

        foreach ($value as $key => $item) {
            $keyString = is_string($key) ? strtolower($key) : (string) $key;

            if (is_sensitive_log_key($keyString)) {
                $redacted[$key] = '[redacted]';
                continue;
            }

            $redacted[$key] = redact_for_log($item);
        }

        return $redacted;
    }

    return $value;
}

function is_sensitive_log_key(string $key): bool
{
    $sensitiveExactKeys = [
        'email',
        'name',
        'first_name',
        'last_name',
        'phone',
        'whatsapp',
        'ip',
        'visitor_ip',
        'city',
        'state',
        'region',
        'country',
        'country_name',
        'visitor_city',
        'visitor_region',
        'visitor_country',
        'visitor_country_code',
        'visitor_timezone',
        'visitor_currency',
        'visitor_country_calling_code',
        'timezone',
        'currency',
        'meta',
        'visitor',
        'custom_fields',
        'custom_values',
    ];

    return in_array($key, $sensitiveExactKeys, true)
        || str_contains($key, 'email')
        || str_contains($key, 'phone')
        || str_contains($key, 'whatsapp')
        || str_contains($key, 'visitor')
        || str_contains($key, 'geo');
}

function build_log_payload_snapshot(array $payload): array
{
    $allowedFields = [
        'email',
        'name',
        'first_name',
        'list',
        'lists',
        'traffic_channel',
        'capture_route',
        'capture_list_slug',
        'confirmation_path',
        'source',
        'page_url',
        'funnel_type',
        'theme',
        'landing_slug',
        'event_name',
        'ip',
        'city',
        'state',
        'country',
        'timezone',
        'visitor_ip',
        'visitor_city',
        'visitor_region',
        'visitor_country',
        'visitor_country_code',
        'visitor_timezone',
        'visitor_currency',
        'visitor_country_calling_code',
    ];

    $snapshot = [];

    foreach ($allowedFields as $field) {
        if (array_key_exists($field, $payload)) {
            $snapshot[$field] = $payload[$field];
        }
    }

    foreach (['custom_values', 'custom_fields', 'visitor', 'meta'] as $field) {
        if (isset($payload[$field]) && is_array($payload[$field])) {
            $snapshot[$field] = $payload[$field];
        }
    }

    return $snapshot;
}

function capture_webhook_for_channel(string $trafficChannel): string
{
    $specificWebhook = '';

    if ($trafficChannel === 'ads') {
        $specificWebhook = capture_env('CAPTURE_ADS_WEBHOOK_URL');
    } elseif ($trafficChannel === 'organic') {
        $specificWebhook = capture_env('CAPTURE_ORGANIC_WEBHOOK_URL');
    }

    return $specificWebhook !== '' ? $specificWebhook : capture_env('CAPTURE_WEBHOOK_URL');
}

function capture_list_for_channel(string $trafficChannel, array $payload): string
{
    $serverListSlug = '';

    if ($trafficChannel === 'ads') {
        $serverListSlug = capture_env('CAPTURE_DEFAULT_LIST_SLUG');
    } elseif ($trafficChannel === 'organic') {
        $serverListSlug = capture_env('CAPTURE_ORGANIC_LIST_SLUG');
    }

    if ($serverListSlug !== '') {
        return $serverListSlug;
    }

    $payloadCaptureList = read_payload_string($payload, 'capture_list_slug');

    if ($payloadCaptureList !== '') {
        return $payloadCaptureList;
    }

    return read_payload_string($payload, 'list');
}

$requestMethod = $_SERVER['REQUEST_METHOD'] ?? 'GET';
$requestOrigin = isset($_SERVER['HTTP_ORIGIN']) && is_string($_SERVER['HTTP_ORIGIN'])
    ? trim($_SERVER['HTTP_ORIGIN'])
    : '';
$allowedOrigins = capture_allowed_origins();

if (!capture_origin_allowed($requestOrigin, $allowedOrigins)) {
    capture_log_event('origin_blocked', [
        'origin' => $requestOrigin,
        'status' => 403,
    ]);

    respond_json(403, [
        'ok' => false,
        'error' => 'origin_not_allowed',
    ]);
}

capture_apply_cors($requestOrigin);

if ($requestMethod === 'OPTIONS') {
    http_response_code(204);
    exit;
}

if ($requestMethod !== 'POST') {
    header('Allow: POST, OPTIONS');
    respond_json(405, [
        'ok' => false,
        'error' => 'method_not_allowed',
    ]);
}

$maxBodyBytes = capture_env_int('CAPTURE_MAX_BODY_BYTES', CAPTURE_DEFAULT_MAX_BODY_BYTES, 1024, 1048576);
$contentLength = isset($_SERVER['CONTENT_LENGTH']) ? (int) $_SERVER['CONTENT_LENGTH'] : 0;

if ($contentLength > $maxBodyBytes) {
    capture_log_event('payload_too_large', [
        'status' => 413,
        'content_length' => $contentLength,
        'max_body_bytes' => $maxBodyBytes,
    ]);

    respond_json(413, [
        'ok' => false,
        'error' => 'payload_too_large',
    ]);
}

$rawInput = file_get_contents('php://input');

if ($rawInput === false) {
    capture_log_event('payload_read_failed', ['status' => 400]);
    respond_json(400, [
        'ok' => false,
        'error' => 'invalid_request_body',
    ]);
}

if (strlen($rawInput) > $maxBodyBytes) {
    capture_log_event('payload_too_large', [
        'status' => 413,
        'body_bytes' => strlen($rawInput),
        'max_body_bytes' => $maxBodyBytes,
    ]);

    respond_json(413, [
        'ok' => false,
        'error' => 'payload_too_large',
    ]);
}

$payload = json_decode($rawInput, true);

if (!is_array($payload) || json_last_error() !== JSON_ERROR_NONE) {
    capture_log_event('invalid_json_payload', [
        'status' => 400,
        'json_error' => json_last_error_msg(),
    ]);

    respond_json(400, [
        'ok' => false,
        'error' => 'invalid_json_payload',
    ]);
}

capture_log_event('payload_received', [
    'status' => 'received',
    'payload' => build_log_payload_snapshot($payload),
]);

$name = read_payload_string($payload, 'name');
$firstName = read_payload_string($payload, 'first_name');
$email = read_payload_string($payload, 'email');

if ($name === '' && $firstName === '') {
    respond_json(422, [
        'ok' => false,
        'error' => 'name_required',
    ]);
}

if ($email === '') {
    respond_json(422, [
        'ok' => false,
        'error' => 'email_required',
    ]);
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    respond_json(422, [
        'ok' => false,
        'error' => 'email_invalid',
    ]);
}

$payload['email'] = $email;

$allowedChannels = capture_csv(capture_env('CAPTURE_ALLOWED_CHANNELS', CAPTURE_DEFAULT_ALLOWED_CHANNELS));
$allowedChannels = $allowedChannels === [] ? capture_csv(CAPTURE_DEFAULT_ALLOWED_CHANNELS) : $allowedChannels;
$trafficChannel = strtolower(read_payload_string($payload, 'traffic_channel'));

if ($trafficChannel === '') {
    respond_json(422, [
        'ok' => false,
        'error' => 'traffic_channel_required',
    ]);
}

if (!in_array($trafficChannel, $allowedChannels, true)) {
    capture_log_event('traffic_channel_invalid', [
        'status' => 422,
        'traffic_channel' => $trafficChannel,
    ]);

    respond_json(422, [
        'ok' => false,
        'error' => 'traffic_channel_invalid',
    ]);
}

$captureRoute = $trafficChannel;
$captureListSlug = capture_list_for_channel($trafficChannel, $payload);
$webhookUrl = capture_webhook_for_channel($trafficChannel);
$isDryRun = capture_env_bool('CAPTURE_DRY_RUN', false);

$payload['traffic_channel'] = $trafficChannel;
$payload['capture_route'] = $captureRoute;

if ($captureListSlug !== '') {
    $payload['capture_list_slug'] = $captureListSlug;
    $payload['list'] = $captureListSlug;
}

if (empty($payload['submitted_at']) || !is_string($payload['submitted_at'])) {
    $payload['submitted_at'] = gmdate('c');
}

if (empty($payload['page_url']) || !is_string($payload['page_url'])) {
    $payload['page_url'] = $_SERVER['HTTP_REFERER'] ?? '';
}

$visitor = isset($payload['visitor']) && is_array($payload['visitor']) ? $payload['visitor'] : [];
$visitorFieldMap = [
    'visitor_ip' => 'ip',
    'visitor_city' => 'city',
    'visitor_region' => 'region',
    'visitor_country' => 'country',
    'visitor_country_code' => 'country_code',
    'visitor_timezone' => 'timezone',
    'visitor_currency' => 'currency',
    'visitor_country_calling_code' => 'country_calling_code',
];
$normalizedVisitor = [];

foreach ($visitorFieldMap as $flatField => $nestedField) {
    $value = read_payload_string($payload, $flatField);

    if (is_field_name_literal($value, $flatField, $nestedField)) {
        $value = '';
    }

    if ($value === '') {
        $value = read_nested_string($visitor, $nestedField);
    }

    if (is_field_name_literal($value, $flatField, $nestedField)) {
        $value = '';
    }

    if ($value === '' && $nestedField === 'country') {
        $value = read_nested_string($visitor, 'country_name');
    }

    if (is_field_name_literal($value, $flatField, $nestedField)) {
        $value = '';
    }

    $payload[$flatField] = $value;
    $normalizedVisitor[$nestedField] = $value;
}

$payload['visitor'] = array_merge($visitor, $normalizedVisitor);

$standardFieldMap = [
    'ip' => $payload['visitor_ip'],
    'city' => $payload['visitor_city'],
    'state' => $payload['visitor_region'],
    'country' => $payload['visitor_country_code'] !== '' ? $payload['visitor_country_code'] : $payload['visitor_country'],
    'timezone' => $payload['visitor_timezone'],
];

foreach ($standardFieldMap as $field => $value) {
    if (read_payload_string($payload, $field) === '' && $value !== '') {
        $payload[$field] = $value;
    }
}

$attributionFields = [
    'traffic_channel',
    'capture_route',
    'capture_list_slug',
    'confirmation_path',
    'source',
    'page_url',
    'funnel_type',
    'theme',
    'landing_slug',
];
$customValueFields = array_merge(array_keys($visitorFieldMap), $attributionFields);
$visitorCustomValues = [];

foreach ($customValueFields as $field) {
    if (read_payload_string($payload, $field) !== '') {
        $visitorCustomValues[$field] = $payload[$field];
    }
}

if ($visitorCustomValues !== []) {
    $existingCustomValues = isset($payload['custom_values']) && is_array($payload['custom_values'])
        ? $payload['custom_values']
        : [];
    $existingCustomFields = isset($payload['custom_fields']) && is_array($payload['custom_fields'])
        ? $payload['custom_fields']
        : [];

    $payload['custom_values'] = array_merge($existingCustomValues, $visitorCustomValues);
    $payload['custom_fields'] = array_merge($existingCustomFields, $visitorCustomValues);
}

capture_log_event('capture_routed', [
    'status' => 'ready',
    'traffic_channel' => $trafficChannel,
    'capture_route' => $captureRoute,
    'list' => $captureListSlug,
    'has_webhook' => $webhookUrl !== '',
]);

if ($isDryRun) {
    capture_log_event('dry_run_complete', [
        'status' => 200,
        'traffic_channel' => $trafficChannel,
        'list' => $captureListSlug,
    ]);

    respond_json(200, [
        'ok' => true,
        'dry_run' => true,
        'channel' => $trafficChannel,
        'list' => $captureListSlug,
    ]);
}

if ($webhookUrl === '') {
    capture_log_event('webhook_missing', [
        'status' => 500,
        'traffic_channel' => $trafficChannel,
    ]);

    respond_json(500, [
        'ok' => false,
        'error' => 'capture_not_configured',
    ]);
}

$encodedPayload = json_encode($payload, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);

if ($encodedPayload === false) {
    capture_log_event('payload_encode_failed', [
        'status' => 500,
        'json_error' => json_last_error_msg(),
    ]);

    respond_json(500, [
        'ok' => false,
        'error' => 'payload_encode_failed',
    ]);
}

if (!function_exists('curl_init')) {
    capture_log_event('curl_missing', ['status' => 500]);

    respond_json(500, [
        'ok' => false,
        'error' => 'curl_missing',
    ]);
}

$curl = curl_init($webhookUrl);

if ($curl === false) {
    capture_log_event('curl_init_failed', ['status' => 500]);

    respond_json(500, [
        'ok' => false,
        'error' => 'request_init_failed',
    ]);
}

$timeoutSeconds = capture_env_int('CAPTURE_TIMEOUT_SECONDS', CAPTURE_DEFAULT_TIMEOUT_SECONDS, 1, 60);

curl_setopt_array($curl, [
    CURLOPT_POST => true,
    CURLOPT_POSTFIELDS => $encodedPayload,
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_HEADER => false,
    CURLOPT_TIMEOUT => $timeoutSeconds,
    CURLOPT_HTTPHEADER => [
        'Accept: application/json',
        'Content-Type: application/json',
    ],
]);

$upstreamResponse = curl_exec($curl);
$curlError = curl_error($curl);
$upstreamStatus = (int) curl_getinfo($curl, CURLINFO_RESPONSE_CODE);
curl_close($curl);

if ($upstreamResponse === false) {
    capture_log_event('upstream_curl_error', [
        'status' => 502,
        'traffic_channel' => $trafficChannel,
        'upstream_status' => $upstreamStatus,
        'curl_error' => $curlError,
    ]);

    respond_json(502, [
        'ok' => false,
        'error' => 'upstream_error',
        'upstream_status' => $upstreamStatus,
    ]);
}

if ($upstreamStatus < 200 || $upstreamStatus >= 300) {
    capture_log_event('upstream_http_error', [
        'status' => 502,
        'traffic_channel' => $trafficChannel,
        'upstream_status' => $upstreamStatus,
        'upstream_response' => capture_log_pii() && is_string($upstreamResponse)
            ? truncate_for_log($upstreamResponse)
            : '[redacted]',
    ]);

    respond_json(502, [
        'ok' => false,
        'error' => 'upstream_error',
        'upstream_status' => $upstreamStatus,
    ]);
}

capture_log_event('upstream_success', [
    'status' => 200,
    'traffic_channel' => $trafficChannel,
    'upstream_status' => $upstreamStatus,
]);

respond_json(200, [
    'ok' => true,
    'upstream_status' => $upstreamStatus,
]);
