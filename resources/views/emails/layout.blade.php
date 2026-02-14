<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>{{ $subject ?? 'Doc Badman Classics' }}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { background: #f2f0e6; font-family: Georgia, 'Times New Roman', serif; color: #1e2d1f; }
    .wrapper { max-width: 600px; margin: 40px auto; background: #fff; border: 1px solid #ddd8ca; }
    .header { background: #1e2d1f; padding: 36px 40px; text-align: center; }
    .header .eyebrow { font-family: Arial, sans-serif; font-size: 10px; letter-spacing: 3px; text-transform: uppercase; color: #b8963e; margin-bottom: 8px; }
    .header h1 { font-size: 20px; font-weight: 400; letter-spacing: 3px; text-transform: uppercase; color: #f2f0e6; }
    .hero { background: #f2f0e6; padding: 32px 40px; border-bottom: 1px solid #ddd8ca; }
    .hero h2 { font-size: 22px; font-weight: 400; color: #1e2d1f; margin-bottom: 8px; line-height: 1.4; }
    .hero p { font-family: Arial, sans-serif; font-size: 13px; color: #5a6e5b; line-height: 1.8; }
    .body { padding: 36px 40px; }
    .section-label { font-family: Arial, sans-serif; font-size: 9px; letter-spacing: 2.5px; text-transform: uppercase; color: #9e9e9e; margin-bottom: 14px; margin-top: 28px; }
    .info-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #f0ede4; font-family: Arial, sans-serif; font-size: 13px; }
    .info-row .label { color: #9e9e9e; }
    .info-row .value { color: #1e2d1f; font-weight: 500; text-align: right; }
    .item-row { padding: 12px 0; border-bottom: 1px solid #f0ede4; display: flex; justify-content: space-between; align-items: center; }
    .item-title { font-size: 15px; color: #1e2d1f; margin-bottom: 3px; }
    .item-meta { font-family: Arial, sans-serif; font-size: 11px; color: #9e9e9e; }
    .item-price { font-family: Arial, sans-serif; font-size: 13px; color: #1e2d1f; font-weight: 500; white-space: nowrap; }
    .total-row { display: flex; justify-content: space-between; padding: 16px 0; }
    .total-row .total-label { font-family: Arial, sans-serif; font-size: 13px; color: #5a6e5b; }
    .total-row .total-value { font-family: Arial, sans-serif; font-size: 13px; color: #5a6e5b; }
    .total-row.final .total-label { font-size: 14px; font-weight: 600; color: #1e2d1f; }
    .total-row.final .total-value { font-size: 18px; color: #1e2d1f; }
    .notice { background: #f2f0e6; border-left: 3px solid #b8963e; padding: 16px 20px; margin-top: 28px; font-family: Arial, sans-serif; font-size: 13px; color: #5a6e5b; line-height: 1.8; }
    .footer { background: #1e2d1f; padding: 28px 40px; text-align: center; }
    .footer p { font-family: Arial, sans-serif; font-size: 11px; color: #5a7a5c; line-height: 2; }
    .footer a { color: #b8963e; text-decoration: none; }
    .order-badge { display: inline-block; background: #1e2d1f; color: #b8963e; font-family: Arial, sans-serif; font-size: 11px; letter-spacing: 2px; text-transform: uppercase; padding: 6px 16px; margin-bottom: 20px; }
  </style>
</head>
<body>
  <div class="wrapper">

    {{-- Header --}}
    <div class="header">
      <p class="eyebrow">Transport Museum · Art Gallery · Coffee Shop</p>
      <h1>Doc Badman Classics</h1>
    </div>

    {{-- Content --}}
    @yield('content')

    {{-- Footer --}}
    <div class="footer">
      <p>
        Doc Badman Classics &nbsp;·&nbsp; Kisumu, Kenya<br>
        <a href="mailto:admin@docbadmanclassics.org">admin@docbadmanclassics.org</a><br><br>
        You received this email because you placed an order with us.
      </p>
    </div>

  </div>
</body>
</html>