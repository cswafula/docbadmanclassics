# Doc Badman Classics — E-Commerce Platform

A full-stack e-commerce platform for an art gallery, transport museum, and coffee shop based in Kisumu, Kenya. Features painting sales with PesaPal payment integration, order management, and a beautiful colonial sage-themed interface.

---

## 🎨 Features

### Customer-Facing
- **Art Gallery** — Browse and purchase original artworks with advanced filtering
- **Horizontal Scroll Carousel** — Swipeable collection showcase on homepage
- **Sold Artwork Display** — View sold pieces with distinctive red badges
- **Shopping Cart** — Full cart management with quantity controls
- **PesaPal Integration** — Secure M-Pesa and card payments
- **Delivery Regions** — Dynamic shipping costs by region
- **Order Tracking** — Real-time order status updates via email
- **Video Tours** — Embedded museum, gallery, and café tour videos
- **Responsive Design** — Mobile-first with touch-optimized interactions

### Admin Dashboard
- **Painting Management** — CRUD operations with multi-image upload
- **Order Management** — View, filter, and update order statuses
- **Delivery Regions** — Manage shipping zones and costs
- **User Management** — Create and manage admin accounts
- **Live Statistics** — Real-time revenue, orders, and inventory tracking
- **Email Notifications** — Automated order confirmations and status updates
- **Pagination** — Efficient data browsing across all admin views

---

## 🛠 Tech Stack

### Backend
- **Laravel 12** — PHP framework
- **MySQL** — Database
- **PesaPal API** — Payment gateway
- **Laravel Sanctum** — API authentication
- **Laravel Queue** — Background email processing
- **SMTP** — Email delivery (SSL, port 465)

### Frontend
- **React 18** — UI library
- **Vite** — Build tool
- **Zustand** — State management
- **Axios** — HTTP client
- **CSS Variables** — Theming system
- **Intersection Observer API** — Scroll animations

### Infrastructure
- **cPanel Hosting** — Shared hosting deployment
- **PHP 8.3** — Server runtime
- **Composer** — Dependency management
- **NPM** — Package management

---

## 📦 Installation (Local Development)

### Prerequisites
- PHP 8.2+
- Composer
- Node.js 18+
- MySQL 8.0+
- Laravel Herd (optional but recommended)

### Backend Setup

```bash
# Clone repository
git clone <repository-url>
cd doc-badman-classics

# Install dependencies
composer install

# Copy environment file
cp .env.example .env

# Generate application key
php artisan key:generate

# Configure database in .env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=doc_badman_art_gallery
DB_USERNAME=root
DB_PASSWORD=

# Configure PesaPal credentials
PESAPAL_CONSUMER_KEY=your_consumer_key
PESAPAL_CONSUMER_SECRET=your_consumer_secret
PESAPAL_ENVIRONMENT=sandbox

# Configure mail settings
MAIL_MAILER=smtp
MAIL_HOST=your_smtp_host
MAIL_PORT=465
MAIL_USERNAME=your_email
MAIL_PASSWORD=your_password
MAIL_ENCRYPTION=ssl
MAIL_FROM_ADDRESS=admin@docbadmanclassics.org

# Run migrations
php artisan migrate

# Create storage symlink
php artisan storage:link

# Create queue table
php artisan queue:table
php artisan migrate

# Start development server
php artisan serve

# Start queue worker (separate terminal)
php artisan queue:work
```

### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Create environment file
echo 'VITE_API_URL=http://127.0.0.1:8000' > .env

# Start development server
npm run dev
```

Visit `http://localhost:5173`

---

## 🚀 Deployment (cPanel)

### File Structure on Server
```
/home/agxqglvr/
├── public_html/                    # Public web root
│   ├── index.html                  # React app
│   ├── assets/                     # React build files
│   ├── storage/                    # Uploaded images
│   │   ├── paintings/
│   │   └── video-thumbnails/
│   ├── videos/                     # Tour videos
│   ├── index.php                   # Laravel entry point
│   └── .htaccess                   # Routing rules
└── doc-badman-classics/            # Laravel app (private)
    ├── app/
    ├── vendor/
    ├── storage/
    ├── .env
    └── ...
```

### Deployment Steps

**1. Build Frontend**
```bash
cd frontend
npm run build
```

**2. Update API URLs** (before building)
```js
// frontend/.env.production
VITE_API_URL=https://docbadmanclassics.org
```

**3. Upload Files**
- Upload `frontend/dist/index.html` → `/home/agxqglvr/public_html/`
- Upload `frontend/dist/assets/` → `/home/agxqglvr/public_html/assets/`
- Upload Laravel files → `/home/agxqglvr/doc-badman-classics/`
- Include `vendor/` folder in Laravel upload

**4. Configure Environment**
```env
# /home/agxqglvr/doc-badman-classics/.env
APP_URL=https://docbadmanclassics.org
DB_DATABASE=agxqglvr_docbadman_db
DB_USERNAME=agxqglvr_docbadman_user
DB_PASSWORD=your_password

PESAPAL_ENVIRONMENT=production
PESAPAL_BASE_URL=https://pay.pesapal.com/v3
```

**5. Setup Public Folder**
Copy Laravel's `public/` contents to `public_html/`:
- `index.php`
- `.htaccess`
- Update paths in `index.php` to point to `../doc-badman-classics/`

**6. Run Setup Script**
Create temporary `/home/agxqglvr/public_html/run-setup.php` and run via browser, then delete.

**7. Setup Cron Job**
```bash
* * * * * cd /home/agxqglvr/doc-badman-classics && php artisan queue:work --stop-when-empty --tries=3 >> /home/agxqglvr/doc-badman-classics/storage/logs/queue.log 2>&1
```

---

## ⚙️ Configuration

### PesaPal Setup
1. Register at [PesaPal](https://www.pesapal.com)
2. Get Consumer Key and Secret
3. Configure IPN URL: `https://docbadmanclassics.org/api/v1/pesapal/ipn`
4. Configure Callback URL: `https://docbadmanclassics.org/order-confirmation`

### Email Configuration
Emails are queued and processed via cron job:
- Order confirmations sent after payment
- Status updates (shipped, delivered, cancelled)
- Retries failed emails 3 times

### Storage Configuration
Images stored in `storage/app/public/paintings/` with symlink to `public/storage/`.

On production, direct storage used:
```php
'public_direct' => [
    'driver' => 'local',
    'root'   => '/home/agxqglvr/public_html/storage',
    'url'    => env('APP_URL') . '/storage',
],
```

---

## 🎯 Usage

### Creating Admin User
```bash
php artisan tinker
```
```php
use App\Models\User;
use Illuminate\Support\Facades\Hash;

User::create([
    'name' => 'Admin',
    'email' => 'admin@docbadmanclassics.org',
    'password' => Hash::make('your_password'),
]);
```

### Adding Paintings
1. Login to `/admin`
2. Navigate to **Paintings**
3. Click **Add New Painting**
4. Upload images, fill details
5. Toggle **Featured** to show on homepage

### Managing Orders
- **Pending** — New orders awaiting payment
- **Paid** — Payment confirmed
- **Shipped** — Order dispatched (email sent)
- **Delivered** — Order completed (email sent)
- **Cancelled** — Order cancelled (email sent)

### Adding Delivery Regions
1. Navigate to **Delivery Regions**
2. Add region name and cost in KES
3. Toggle **Active** to show at checkout

---

## 📁 Project Structure

```
doc-badman-classics/
├── app/
│   ├── Http/Controllers/Api/
│   │   ├── Admin/
│   │   │   ├── AdminPaintingController.php
│   │   │   ├── AdminOrderController.php
│   │   │   ├── AdminDeliveryRegionController.php
│   │   │   └── AdminUserController.php
│   │   ├── PaintingController.php
│   │   ├── OrderController.php
│   │   └── PesaPalController.php
│   ├── Mail/
│   │   ├── OrderConfirmed.php
│   │   ├── OrderShipped.php
│   │   ├── OrderDelivered.php
│   │   └── OrderCancelled.php
│   ├── Models/
│   │   ├── Painting.php
│   │   ├── Order.php
│   │   ├── OrderItem.php
│   │   └── DeliveryRegion.php
│   └── Services/
│       └── PesaPalService.php
├── config/
│   ├── pesapal.php
│   └── filesystems.php
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Header.jsx
│   │   │   ├── Footer.jsx
│   │   │   └── admin/
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── Gallery.jsx
│   │   │   ├── Painting.jsx
│   │   │   ├── Cart.jsx
│   │   │   ├── Checkout.jsx
│   │   │   ├── About.jsx
│   │   │   ├── Donate.jsx
│   │   │   └── admin/
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── store/
│   │   │   └── authStore.js
│   │   └── App.jsx
│   └── package.json
└── routes/
    └── api.php
```

---

## 🎨 Design System

### Color Palette
```css
--black:    #1e2d1f;  /* Deep forest green */
--cream:    #f2f0e6;  /* Warm sage cream */
--accent:   #b8963e;  /* Antique gold */
--gray-500: #7a7868;  /* Medium gray */
```

### Typography
- **Display:** Cormorant Garamond (serif)
- **Body:** Jost (sans-serif)

---

## 🔐 Security

- **CORS** configured for `https://docbadmanclassics.org`
- **Sanctum** API authentication
- **CSRF** protection on all forms
- **SQL Injection** prevention via Eloquent ORM
- **File Upload** validation (type, size limits)
- **Password** hashing with bcrypt
- **Environment** variables for sensitive data

---

## 🐛 Troubleshooting

### Images Not Loading
```bash
php artisan storage:link
```
Ensure `storage/app/public` symlinked to `public/storage`

### Queue Not Processing
Check cron job is running:
```bash
tail -f storage/logs/queue.log
```

### Payment IPN Not Working
Verify PesaPal IPN URL is registered and publicly accessible

### 413 Upload Error
Increase PHP limits:
```ini
upload_max_filesize = 200M
post_max_size = 210M
```

---

## 📧 Contact

- **Website:** https://docbadmanclassics.org
- **Email:** admin@docbadmanclassics.org
- **Donations:** donations@docbadmanclassics.org
- **Location:** Tom Mboya Road, Milimani, Kisumu, Kenya
- **Phone:** +254 110 096 130

---

## 📄 License

Proprietary — All rights reserved © 2025 Doc Badman Classics

---

## 🙏 Acknowledgments

- **Founder:** Dr. Kevin Rombosia
- **Development:** Built with Laravel & React
- **Payment Gateway:** PesaPal
- **Hosting:** cPanel
- **Design:** Colonial Sage Theme
