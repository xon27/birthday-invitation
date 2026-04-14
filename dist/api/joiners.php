<?php
/**
 * Joiners API for Hostinger static-data strategy.
 * GET: return list of joiners (JSON array of { id, name, lastname }).
 * POST: body JSON array of { name, lastname }[]; appends to file, returns 200.
 * DELETE: query param id=xxx; removes that joiner, returns 200.
 */

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
  http_response_code(204);
  exit;
}

$dataDir = __DIR__ . '/../data';
$dataFile = $dataDir . '/joiners.json';

function ensureDataFile($path, $dir) {
  if (!is_dir($dir)) {
    mkdir($dir, 0755, true);
  }
  if (!file_exists($path)) {
    file_put_contents($path, '[]', LOCK_EX);
  }
}

function readJoiners($path) {
  ensureDataFile($path, dirname($path));
  $raw = file_get_contents($path);
  $list = $raw !== false ? json_decode($raw, true) : null;
  return is_array($list) ? $list : [];
}

function saveJoiners($path, $list) {
  ensureDataFile($path, dirname($path));
  file_put_contents($path, json_encode($list, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE), LOCK_EX);
}

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
  $list = readJoiners($dataFile);
  usort($list, function ($a, $b) {
    return strcmp($a['name'] ?? '', $b['name'] ?? '');
  });
  echo json_encode($list);
  exit;
}

if ($method === 'POST') {
  $body = file_get_contents('php://input');
  $input = json_decode($body, true);
  if (!is_array($input)) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid JSON array']);
    exit;
  }
  $list = readJoiners($dataFile);
  foreach ($input as $row) {
    $name = isset($row['name']) ? (string) $row['name'] : '';
    $lastname = isset($row['lastname']) ? (string) $row['lastname'] : '';
    $list[] = [
      'id' => uniqid('j', true),
      'name' => $name,
      'lastname' => $lastname,
    ];
  }
  saveJoiners($dataFile, $list);
  echo json_encode(['ok' => true]);
  exit;
}

if ($method === 'DELETE') {
  $id = isset($_GET['id']) ? trim((string) $_GET['id']) : '';
  if ($id === '') {
    http_response_code(400);
    echo json_encode(['error' => 'Missing id']);
    exit;
  }
  $list = readJoiners($dataFile);
  $before = count($list);
  $list = array_values(array_filter($list, function ($row) use ($id) {
    return ($row['id'] ?? '') !== $id;
  }));
  if (count($list) < $before) {
    saveJoiners($dataFile, $list);
  }
  echo json_encode(['ok' => true]);
  exit;
}

http_response_code(405);
echo json_encode(['error' => 'Method not allowed']);
