<?php
$laravelRoot = '/home/agxqglvr/doc-badman-classics';
require $laravelRoot . '/vendor/autoload.php';
$app    = require_once $laravelRoot . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);

$commands = [
    'migrate --force',
    'cache:clear',
    'config:cache',
    'route:cache',
    'view:clear',
    'storage:link',
];

foreach ($commands as $cmd) {
    $parts  = explode(' ', $cmd);
    $input  = new Symfony\Component\Console\Input\ArrayInput(array_merge(
        ['command' => $parts[0]],
        in_array('--force', $parts) ? ['--force' => true] : []
    ));
    $output = new Symfony\Component\Console\Output\BufferedOutput();
    $kernel->handle($input, $output);
    echo "<pre><strong>{$cmd}</strong>:\n" . htmlspecialchars($output->fetch()) . "</pre>";
}
