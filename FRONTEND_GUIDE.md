# 🎨 Frontend Developer Guide - Fotherbys Auction System

A complete guide for frontend developers to understand templates, styling, and API integration for the Fotherbys auction platform.

---

## 🚀 Quick Start (Frontend Track)

### Prerequisites

Before getting started, you need:

1. **Node.js** (v18+) - [Download](https://nodejs.org/)
2. **MongoDB** - Choose one:
   - **Local Installation**: [Download MongoDB Community](https://www.mongodb.com/try/download/community)
   - **MongoDB Atlas** (Cloud): Free tier at [atlas.mongodb.com](https://www.mongodb.com/cloud/atlas)
   - **Docker**: `docker run -d -p 27017:27017 --name mongodb mongo`

**Verify installations:**

```bash
node --version      # Should show v18+
npm --version       # Should show 8+
mongod --version    # Should show version info
```

### Setup Steps

```bash
# 1. Clone & install
git clone https://github.com/Nuel-09/An-Auction-system.git
cd An-Auction-system
npm install

# 2. Create .env file
cp .env.example .env

# Edit .env with MongoDB connection
# Default: MONGO_URI=mongodb://localhost:27017/fotherbys

# 3. Start MongoDB (if running locally)
mongod
# Keep this terminal open - MongoDB runs in background

# 4. In a new terminal, seed test data
npm run seed

# 5. Start dev server
npm run dev

# 6. Open browser
# Admin: http://localhost:3000/admin/login
# Public: http://localhost:3000/
```

**Default Admin Credentials:**

- Email: `admin@fotherbys.com`
- Password: `Admin@123`

---

## 📁 Frontend Structure

```
src/views/
├── admin/                    # Admin dashboard pages
│   ├── dashboard.ejs        # Main admin dashboard
│   ├── auctions.ejs         # List all auctions
│   ├── auction-detail.ejs   # Single auction editor
│   ├── items.ejs            # List all items
│   ├── item-detail.ejs      # Single item editor
│   ├── leads.ejs            # Seller leads list
│   ├── lead-detail.ejs      # Single lead details
│   ├── login.ejs            # Admin login page
│   ├── profile.ejs          # Admin profile
│   └── catalogue-preview.ejs # Catalogue preview
└── public/                   # Public-facing pages
    ├── home.ejs             # Home page
    ├── catalogue.ejs        # Browse auctions
    ├── auction.ejs          # Auction detail (public)
    ├── item.ejs             # Item detail (public)
    ├── qr-auction.ejs       # QR code auction access
    ├── qr-not-found.ejs     # QR error page
    ├── seller-login.ejs     # Seller login
    ├── seller-dashboard.ejs # Seller dashboard
    └── 404.ejs              # Not found page

public/css/
├── dashboard.css            # Admin styles
├── login.css                # Login page styles
└── images/                  # Static images
```

---

## 🎯 EJS Template Basics

### Template Structure

All templates extend a base layout. Common patterns:

```ejs
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><%= title %></title>
    <link rel="stylesheet" href="/css/dashboard.css">
</head>
<body>
    <nav class="navbar">
        <!-- Navigation content -->
    </nav>

    <main class="container">
        <!-- Page content -->
    </main>

    <script src="/js/script.js"></script>
</body>
</html>
```

### Variable Passing

Backend passes data to templates:

```typescript
// Backend (server.ts example)
res.render("admin/auctions", {
  title: "Auctions",
  auctions: auctionsList,
  currentUser: adminUser,
});
```

Access in template:

```ejs
<h1><%= title %></h1>
<p>Welcome, <%= currentUser.email %></p>
```

### Conditionals

```ejs
<% if (auctions.length > 0) { %>
    <table>
        <% auctions.forEach(auction => { %>
            <tr>
                <td><%= auction.title %></td>
                <td><%= auction.status %></td>
            </tr>
        <% }) %>
    </table>
<% } else { %>
    <p>No auctions found</p>
<% } %>
```

### Common Patterns

**Date formatting:**

```ejs
<!-- Format date to readable format -->
<%= new Date(auction.startDate).toLocaleDateString() %>
```

**Conditional CSS classes:**

```ejs
<div class="auction-card <%= auction.status === 'published' ? 'published' : 'draft' %>">
    <%= auction.title %>
</div>
```

**Include partials (reusable components):**

```ejs
<%- include('../partials/header') %>
<!-- Page content -->
<%- include('../partials/footer') %>
```

---

## 🎨 CSS Structure & Theming

### Dashboard CSS (`public/css/dashboard.css`)

**Sections:**

- **Variables**: Color scheme, spacing, typography
- **Layout**: Grid, flexbox, containers
- **Components**: Cards, buttons, forms, tables
- **Responsive**: Media queries for mobile

### Common Classes

```css
/* Layout */
.container       /* Main content wrapper */
/* Main content wrapper */
/* Main content wrapper */
/* Main content wrapper */
.grid            /* Grid layout */
.flex             /* Flexbox layout */
.navbar          /* Top navigation */
.sidebar         /* Side navigation */

/* Components */
.card            /* Info card */
.button          /* Button styles */
.form-group      /* Form field wrapper */
.table           /* Table styles */
.modal           /* Modal dialog */
.alert           /* Alert/notification */

/* Status indicators */
.status-draft       /* Draft status color */
.status-published   /* Published status color */
.status-closed      /* Closed status color */
.status-locked; /* Locked status color */
```

### Adding Styles

1. **For a new component**, add to `dashboard.css`:

```css
.auction-filter {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  padding: 1rem;
  background: #f5f5f5;
  border-radius: 8px;
}

.auction-filter input {
  flex: 1;
  padding: 0.5rem;
  border: 1px solid #ddd;
}
```

2. **Use in template**:

```ejs
<div class="auction-filter">
    <input type="text" placeholder="Search auctions...">
    <button>Filter</button>
</div>
```

### Theme Colors

Common colors used across the site:

```css
--primary: #2c3e50      /* Dark blue-gray */
--accent: #e74c3c       /* Red (important actions) */
--success: #27ae60      /* Green (published) */
--warning: #f39c12      /* Orange (draft) */
--info: #3498db         /* Blue (info) */
--light: #ecf0f1        /* Light gray */
--dark: #2c3e50         /* Dark text */
```

---

## 🔗 JavaScript & API Integration

### Making API Requests

**GET request:**

```javascript
fetch("/api/auctions")
  .then((res) => res.json())
  .then((data) => {
    console.log(data);
    displayAuctions(data);
  })
  .catch((err) => console.error(err));
```

**POST request (Create):**

```javascript
const auction = {
  title: "Winter Auction 2026",
  description: "Fine art and antiques",
  startDate: "2026-02-01T10:00:00Z",
  endDate: "2026-02-15T17:00:00Z",
};

fetch("/api/auctions", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify(auction),
})
  .then((res) => res.json())
  .then((data) => {
    if (data.success) {
      alert("Auction created!");
      location.reload();
    }
  })
  .catch((err) => console.error(err));
```

**PUT request (Update):**

```javascript
const updates = {
  title: "Updated Title",
  description: "Updated description",
};

fetch(`/api/auctions/${auctionId}`, {
  method: "PUT",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify(updates),
})
  .then((res) => res.json())
  .then((data) => {
    if (data.success) {
      alert("Auction updated!");
    }
  })
  .catch((err) => console.error(err));
```

**DELETE request:**

```javascript
fetch(`/api/items/${itemId}`, {
  method: "DELETE",
})
  .then((res) => res.json())
  .then((data) => {
    if (data.success) {
      alert("Item deleted!");
      location.reload();
    }
  })
  .catch((err) => console.error(err));
```

---

## 📋 Common Frontend Tasks

### 1. Adding a New Form Field

**Step 1: Add to template** (e.g., `admin/item-detail.ejs`):

```ejs
<div class="form-group">
    <label for="newField">New Field Name</label>
    <input
        type="text"
        id="newField"
        name="newField"
        value="<%= item.newField || '' %>"
        required
    >
</div>
```

**Step 2: Ensure backend accepts it** (backend will already handle it with MongoDB schema)

**Step 3: Submit form with existing handler:**

```javascript
document.querySelector("form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const formData = new FormData(e.target);
  const data = Object.fromEntries(formData);

  fetch(`/api/items/${itemId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  // ... handle response
});
```

### 2. Creating a New Table

```ejs
<table class="data-table">
    <thead>
        <tr>
            <th>Column 1</th>
            <th>Column 2</th>
            <th>Actions</th>
        </tr>
    </thead>
    <tbody>
        <% data.forEach(item => { %>
            <tr>
                <td><%= item.property1 %></td>
                <td><%= item.property2 %></td>
                <td>
                    <a href="/admin/items/<%= item._id %>">Edit</a>
                    <button onclick="deleteItem('<%= item._id %>')">Delete</button>
                </td>
            </tr>
        <% }) %>
    </tbody>
</table>
```

### 3. Implementing Search/Filter

```ejs
<form class="filter-form" method="GET">
    <input
        type="text"
        name="search"
        placeholder="Search items..."
        value="<%= search || '' %>"
    >
    <select name="status">
        <option value="">All Status</option>
        <option value="draft" <%= status === 'draft' ? 'selected' : '' %>>Draft</option>
        <option value="published" <%= status === 'published' ? 'selected' : '' %>>Published</option>
    </select>
    <button type="submit">Filter</button>
</form>
```

### 4. Form Validation

Client-side validation:

```javascript
function validateForm(formData) {
  if (!formData.title || formData.title.trim() === "") {
    alert("Title is required");
    return false;
  }

  if (formData.estimateMin > formData.estimateMax) {
    alert("Min estimate cannot exceed max estimate");
    return false;
  }

  return true;
}

document.querySelector("form").addEventListener("submit", (e) => {
  const formData = new FormData(e.target);
  const data = Object.fromEntries(formData);

  if (!validateForm(data)) {
    e.preventDefault();
  }
});
```

### 5. Adding Loading States

```javascript
const button = document.querySelector('button[type="submit"]');
const originalText = button.textContent;

fetch(url, { method: "POST", body: JSON.stringify(data) })
  .then((res) => res.json())
  .then((data) => {
    button.textContent = originalText;
    if (data.success) {
      alert("Success!");
    }
  })
  .catch((err) => {
    button.textContent = originalText;
    console.error(err);
  });

// Show loading
button.textContent = "Loading...";
button.disabled = true;
```

---

## 📊 API Endpoints for Frontend

### Auctions API

```javascript
// List all auctions
GET /api/auctions

// Get single auction
GET /api/auctions/:id

// Create auction
POST /api/auctions
Body: { title, description, startDate, endDate }

// Update auction
PUT /api/auctions/:id
Body: { title, description, status, etc }

// Publish auction
POST /api/auctions/:id/publish

// Close auction
POST /api/auctions/:id/close

// Bulk assign items to auction
POST /api/auctions/:id/items/bulk-assign
Body: { itemIds: ["id1", "id2", "id3"] }
```

### Items API

```javascript
// List all items (with filters)
GET /api/items?search=value&status=draft&category=art

// Get single item
GET /api/items/:id

// Create item
POST /api/items
Body: { title, description, category, estimateMin, estimateMax, artist, etc }

// Update item
PUT /api/items/:id
Body: { title, description, etc }

// Delete item
DELETE /api/items/:id

// Search items
GET /api/items/search?q=search_term
```

### Seller Leads API

```javascript
// List all leads
GET /api/leads

// Create lead
POST /api/leads
Body: { email, items: [{}, {}] }

// Update lead status
PATCH /api/leads/:id
Body: { status: "draft" | "submitted" | "locked" }

// Get lead items
GET /api/leads/:leadId/items
```

### Public API

```javascript
// Get home page data
GET /

// Get catalogue
GET /catalogue

// Get item detail (public)
GET /item/:itemId

// Submit items (seller)
POST /api/public/submit-items
Body: { email, items: [{title, description}, ...] }
```

---

## 🎭 Template Navigation Guide

### Admin Section Flow

```
/admin/login
    ↓
/admin/dashboard (main hub)
    ├── → /admin/auctions (list all)
    │       ├── → /admin/auction/:id (edit)
    │       │       ├── → Bulk assign items
    │       │       └── → Publish/Close
    │       └── → Create new
    │
    ├── → /admin/items (list all)
    │       ├── → /admin/item/:id (edit)
    │       │       └── → Update fields
    │       └── → Create new
    │
    └── → /admin/leads (seller leads)
            ├── → /admin/lead/:id (details)
            │       └── → Update status
            └── → View items per lead
```

### Public Section Flow

```
/ (home page)
    ├── /catalogue (browse auctions)
    │       └── /auction/:id (auction detail)
    │
    ├── /item/:itemId (item detail)
    │
    └── /seller/login (seller login)
            └── /seller/dashboard (seller submissions)
```

---

## 💡 Best Practices

### 1. **Always Check Response Status**

```javascript
fetch("/api/auctions")
  .then((res) => {
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    return res.json();
  })
  .catch((err) => console.error("Failed:", err));
```

### 2. **Use Consistent Naming**

```javascript
// Good
const getUserAuctions = () => { ... }
const handleFormSubmit = (e) => { ... }
const displaySuccessMessage = (msg) => { ... }

// Avoid
const getAuct = () => { ... }
const handleClick = (e) => { ... }
const showMsg = (m) => { ... }
```

### 3. **Handle Errors Gracefully**

```javascript
fetch("/api/auctions")
  .then((res) => res.json())
  .then((data) => displayAuctions(data))
  .catch((err) => {
    console.error("Error loading auctions:", err);
    displayError("Failed to load auctions. Please try again.");
  });
```

### 4. **Keep Templates Clean**

- Minimize business logic in templates
- Use backend to prepare data
- Keep template code readable and simple

### 5. **Use Semantic HTML**

```ejs
<!-- Good -->
<header>...</header>
<nav>...</nav>
<main>
    <article>...</article>
</main>
<footer>...</footer>

<!-- Avoid -->
<div class="header">...</div>
<div class="nav">...</div>
```

---

## 🧪 Testing Frontend Changes

### Manual Testing Checklist

- [ ] Form submissions work
- [ ] Filters return correct results
- [ ] Pagination works (if implemented)
- [ ] Responsive on mobile
- [ ] Error messages display
- [ ] Success messages display
- [ ] Navigation works
- [ ] Styling is consistent

### Browser DevTools Tips

```javascript
// In console, test API calls
fetch("/api/auctions")
  .then((r) => r.json())
  .then((d) => console.log(d));

// Check current page data
console.log(document.body.innerHTML);

// Monitor network requests
// Open DevTools → Network tab
```

---

## 🚀 Performance Tips

1. **Lazy load images:**

```ejs
<img src="/images/item.jpg" loading="lazy" alt="Item">
```

2. **Minimize API calls:**

```javascript
// Bad: Multiple calls
fetch('/api/auctions').then(auctions => ...)
fetch('/api/items').then(items => ...)

// Better: Single endpoint returns combined data
fetch('/api/dashboard').then(data => {
    auctions = data.auctions;
    items = data.items;
})
```

3. **Debounce search inputs:**

```javascript
let searchTimeout;
inputField.addEventListener("input", (e) => {
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    searchItems(e.target.value);
  }, 300);
});
```

---

## 📝 Common Patterns in Existing Code

### Status Badge Pattern

```ejs
<span class="badge <%= 'status-' + item.status %>">
    <%= item.status.charAt(0).toUpperCase() + item.status.slice(1) %>
</span>
```

### Edit/Delete Actions

```ejs
<div class="actions">
    <a href="/admin/item/<%= item._id %>" class="btn-edit">Edit</a>
    <button onclick="deleteItem('<%= item._id %>')" class="btn-delete">Delete</button>
</div>
```

### Date Picker

```ejs
<input type="datetime-local" name="startDate"
       value="<%= new Date(auction.startDate).toISOString().slice(0, 16) %>">
```

---

## 🗄️ MongoDB Setup & Troubleshooting

### Installation Options

**Option 1: Local MongoDB (Windows)**
1. Download from [mongodb.com/try/download/community](https://www.mongodb.com/try/download/community)
2. Run the installer
3. Choose "Install as a Service"
4. Open PowerShell and run: `mongod`
5. MongoDB starts on port 27017

**Option 2: MongoDB Atlas (Cloud)**
1. Go to [atlas.mongodb.com](https://www.mongodb.com/cloud/atlas)
2. Sign up (free tier available)
3. Create a cluster
4. Get connection string: `mongodb+srv://username:password@cluster.mongodb.net/fotherbys`
5. Update `.env`: `MONGO_URI=your-connection-string`

**Option 3: Docker**
```bash
# Install Docker first
docker run -d -p 27017:27017 --name mongodb mongo

# Verify it's running
docker ps
```

### Common MongoDB Errors

**Error: "connect ECONNREFUSED 127.0.0.1:27017"**
```
Solution:
1. Check MongoDB is running: mongod should be in a terminal
2. If using Atlas, verify connection string in .env
3. If local, try: net start MongoDB (Windows)
```

**Error: "Error: ENOENT: no such file or directory, open 'C:\data\db'"**
```
Solution (Windows):
1. Create folders: mkdir C:\data\db
2. Run: mongod --dbpath C:\data\db
3. Or use custom path: mongod --dbpath "C:\path\to\your\db"
```

**Error: "MongoServerError: connect ECONNREFUSED"**
```
Solution:
1. Restart MongoDB: mongod
2. Check firewall settings
3. Verify MONGO_URI in .env matches your setup
```

### Verify MongoDB Connection

```bash
# Test if MongoDB is running
mongosh
# If successful, you'll see: >

# Inside mongosh shell
show dbs              # List databases
use fotherbys         # Switch to fotherbys db
db.auctions.find()    # Check if data exists
exit                  # Exit shell
```

### After Seeding

```bash
# Verify seed worked
npm run seed

# Check if data was created
mongosh
> use fotherbys
> db.items.countDocuments()     # Should show 23
> db.auctions.countDocuments()  # Should show 5
> db.sellers_leads.countDocuments()  # Should show 8
```

---

## 🆘 Debugging Tips

### Check browser console for errors

```
F12 → Console tab → Look for red errors
```

### Check network requests

```
F12 → Network tab → Filter by Fetch/XHR → Click request to see details
```

### Inspect element

```
F12 → Elements tab → Right-click element → Inspect
```

### Add debug logs

```javascript
console.log("Current data:", data);
console.log("Form submission:", formData);
console.log("API response:", response);
```

### Check Backend Logs

```bash
# Terminal running npm run dev shows:
[server.ts] Connected to MongoDB
[auctionController.ts] Fetching auctions...
[error] Failed to connect to database
```

### MongoDB Connection Issues

Check the full setup section above for installation and troubleshooting.

---

## 📚 Additional Resources

- **[README.md](README.md)** - Full project overview
- **[CODEBASE_STRUCTURE.md](CODEBASE_STRUCTURE.md)** - Backend architecture
- **[IMPLEMENTATION_SUMMARY.md](IMPLEMENTATION_SUMMARY.md)** - Recent changes
- **[TESTING_GUIDE.md](TESTING_GUIDE.md)** - Testing procedures

---

## 🤝 Getting Help

**For API questions:**

- Check CODEBASE_STRUCTURE.md routes section
- Run `curl http://localhost:3000/api/auctions` to test endpoint

**For template questions:**

- Look at similar templates in `src/views/`
- Check existing form patterns

**For styling questions:**

- Review `public/css/dashboard.css`
- Use browser DevTools to inspect elements

---

## 📞 Quick Reference

**Start Development:**

```bash
npm run dev
```

**Admin Dashboard:** `http://localhost:3000/admin/login`  
**Public Site:** `http://localhost:3000/`  
**API Testing:** Use Postman or curl

**Default Admin:**

- Email: `admin@fotherbys.com`
- Password: `Admin@123`

---

**Last Updated:** January 18, 2026  
**For:** Frontend Developers & UI/UX Contributors
