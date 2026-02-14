<?php

return [
    'consumer_key'    => env('PESAPAL_CONSUMER_KEY'),
    'consumer_secret' => env('PESAPAL_CONSUMER_SECRET'),
    'env'             => env('PESAPAL_ENV', 'production'),
    'base_url'        => env('PESAPAL_ENV') === 'production'
                            ? 'https://pay.pesapal.com/v3'
                            : 'https://cybqa.pesapal.com/pesapalv3',
    'ipn_url'         => env('PESAPAL_IPN_URL'),
    'callback_url'    => env('PESAPAL_CALLBACK_URL'),
];