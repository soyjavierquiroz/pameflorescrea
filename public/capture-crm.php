<?php
// Deploy this file and capture.php in one release directory; activate/roll back the directory atomically.
if (realpath($_SERVER['SCRIPT_FILENAME'] ?? '') === __FILE__) {
    http_response_code(404);
    return;
}

// Pure normalization: no environment, requests, logging or network side effects.
function capture_crm_fields(): array
{
    return ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term',
        'fbclid', 'gclid', 'ttclid', 'referrer_source', 'referrer_domain', 'referrer_origin', 'landing_path'];
}

function capture_crm_string(mixed $value): string
{
    return is_string($value) ? trim(substr(trim($value), 0, 512)) : '';
}

function capture_apply_crm(array $payload): array
{
    $values = [];
    foreach (capture_crm_fields() as $field) {
        $value = capture_crm_string($payload[$field] ?? null);
        if ($value === '' && (str_starts_with($field, 'utm_') || in_array($field, ['fbclid', 'gclid', 'ttclid'], true))) {
            $group = str_starts_with($field, 'utm_') ? 'utms' : 'click_ids';
            $nested = isset($payload[$group]) && is_array($payload[$group]) ? $payload[$group] : [];
            $value = capture_crm_string($nested[$field] ?? null);
        }
        if ($field === 'referrer_origin' && $value !== '') {
            $parts = parse_url($value);
            if (!is_array($parts) || !in_array(strtolower($parts['scheme'] ?? ''), ['http', 'https'], true)
                || !isset($parts['host']) || isset($parts['user']) || isset($parts['pass'])) {
                $value = '';
            } else {
                $value = strtolower($parts['scheme'] . '://' . $parts['host']) . (isset($parts['port']) ? ':' . $parts['port'] : '');
                $host = strtolower(rtrim($parts['host'], '.'));
                if ($host === 'pameflorescrea.com' || str_ends_with($host, '.pameflorescrea.com')) $value = '';
            }
        }
        if ($field === 'referrer_domain' && $value !== '') {
            $value = strtolower($value);
            if (!preg_match('/^(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z]{2,63}$/D', $value)
                || $value === 'pameflorescrea.com' || str_ends_with($value, '.pameflorescrea.com')) $value = '';
        }
        if ($field === 'referrer_source' && $value !== '' && !preg_match('/^[a-z0-9.-]+$/D', $value)) $value = '';
        if ($field === 'landing_path' && $value !== '') {
            $value = explode('#', explode('?', $value, 2)[0], 2)[0];
            if (!str_starts_with($value, '/') || str_starts_with($value, '//')) $value = '';
        }
        unset($payload[$field]);
        foreach (['custom_fields', 'custom_values'] as $custom) {
            if (isset($payload[$custom]) && is_array($payload[$custom])) unset($payload[$custom][$field]);
        }
        if ($value !== '') {
            $payload[$field] = $value;
            $values[$field] = $value;
        }
    }
    if ($values !== []) {
        foreach (['custom_fields', 'custom_values'] as $custom) {
            $existing = isset($payload[$custom]) && is_array($payload[$custom]) ? $payload[$custom] : [];
            $payload[$custom] = array_merge($existing, $values);
        }
    }
    return $payload;
}
