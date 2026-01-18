# 🗺️ Codebase Structure & Navigation Guide

Complete map of the Fotherbys project architecture. Use this to understand how requests flow through the system and where to find specific code.

---

## � **Table of Contents**

1. [🚀 Quick Navigation Guide](#quick-navigation) - Jump to what you need
2. [📁 Directory Structure](#directory-structure) - Where everything lives
3. [🔄 Request Flow Architecture](#request-flow) - How requests travel
4. [🛠️ Key File Purposes](#key-files) - What each file does & why
5. [📚 Common Tasks Reference](#common-tasks) - Quick lookup for changes
6. [🔍 How to Trace Code](#trace-code) - Real-world examples
7. [🚀 Development Workflow](#development-workflow) - Adding new features
8. [📍 Complete Route Mappings](#routes) - All endpoints (reference)
9. [📊 Data Flow Diagram](#data-flow) - Visual architecture
10. [🎯 Architecture Principles](#principles) - Design patterns

---

## 🚀 Quick Navigation Guide {#quick-navigation}

**I want to...**

- Understand the overall architecture → [Request Flow Architecture](#request-flow)
- Find a specific file → [Directory Structure](#directory-structure)
- Add a new endpoint → [Development Workflow](#development-workflow)
- Debug an issue → [How to Trace Code](#trace-code)
- Learn how the system works → [Data Flow Diagram](#data-flow)
- Know where to make changes → [Common Tasks Reference](#common-tasks)
- Look up a specific endpoint → [Complete Route Mappings](#routes)
- Understand design patterns → [Architecture Principles](#principles)

---

## 📁 Directory Structure Overview {#directory-structure}

```
src/
├── server.ts                 # Entry point - initializes Fastify app & routes
├── config/
│   └── database.ts          # MongoDB connection setup
├── middleware/
│   └── auth.ts              # Authentication/authorization middleware
├── models/                  # Database schemas (Mongoose)
│   ├── Admin.ts
│   ├── Auction.ts
│   ├── Items.ts
│   └── SellersLead.ts
├── types/
│   └── index.ts             # TypeScript interfaces (IAdmin, IItem, IAuction, etc.)
├── controllers/             # Business logic & request handlers
│   ├── baseController.ts
│   ├── adminController.ts
│   ├── auctionController.ts
│   ├── itemController.ts
│   ├── sellerLeadController.ts
│   ├── publicController.ts
│   └── publicSellerController.ts
├── routes/                  # API endpoint definitions
│   ├── adminAuthRoutes.ts
│   ├── auctionRoutes.ts
│   ├── itemsRoutes.ts
│   ├── publicRoutes.ts
│   ├── publicSellerRoutes.ts
│   └── sellerLeadRoutes.ts
└── views/                   # EJS templates (HTML pages)
    ├── admin/              # Admin dashboard pages
    │   ├── dashboard.ejs
    │   ├── login.ejs
    │   ├── auctions.ejs
    │   ├── items.ejs
    │   ├── leads.ejs
    │   ├── auction-detail.ejs
    │   ├── item-detail.ejs
    │   ├── lead-detail.ejs
    │   ├── profile.ejs
    │   └── catalogue-preview.ejs
    └── public/             # Public-facing pages
        ├── home.ejs
        ├── auction.ejs
        ├── item.ejs
        ├── catalogue.ejs
        ├── qr-auction.ejs
        ├── qr-not-found.ejs
        ├── seller-dashboard.ejs
        ├── seller-login.ejs
        └── 404.ejs
```

---

## 🔄 Request Flow Architecture {#request-flow}

### **How a Request Travels Through the System:**

```
HTTP Request
    ↓
server.ts (registers routes)
    ↓
routes/*.ts (matches endpoint & middleware)
    ↓
middleware/auth.ts (checks authentication if needed)
    ↓
controllers/*.ts (handles business logic)
    ↓
models/*.ts (queries MongoDB)
    ↓
Database (MongoDB)
    ↓
Response back to Client (JSON or EJS view)
```

---

## �️ Key File Purposes {#key-files}

### **1. Entry Point**

**`src/server.ts`**

- Initializes Fastify server
- Connects to MongoDB
- Registers all route handlers
- Configures EJS view engine
- Sets up static files
- Listens on port 3000

```typescript
// All routes registered here
app.register(adminAuthRoutes);
app.register(auctionRoutes);
app.register(itemsRoutes);
// ... etc
```

---

### **2. Configuration**

**`src/config/database.ts`**

- MongoDB connection string setup
- Connection pooling settings
- Error handling for DB connections

---

### **3. Type Definitions**

**`src/types/index.ts`**

- Defines all TypeScript interfaces
- Ensures type safety across project
- Defines: `IAdmin`, `ISellerLead`, `IItem`, `IAuction`

Example:

```typescript
export interface IItem {
  title: string;
  description: string;
  category: string;
  estimateMin: number;
  estimateMax: number;
  artist?: string;
  periodDate?: string;
  dimensions?: string;
  condition?: string;
  lotRefNumber?: string;
  lotNumber?: number;
  status: "draft" | "published";
  // ... more fields
}
```

---

### **4. Database Models (Mongoose Schemas)**

**`src/models/Items.ts`**

- Defines MongoDB schema for items/lots
- Auto-generates `lotRefNumber` (LOT-timestamp-random)
- Methods for database operations

**`src/models/Auction.ts`**

- Defines auction schema
- References items through `auctionId`
- Status: draft → published → closed

**`src/models/SellersLead.ts`**

- Seller form submissions
- Status: draft → submitted → locked

**`src/models/Admin.ts`**

- Admin user accounts
- Password hashing (bcryptjs)

---

### **5. Middleware**

**`src/middleware/auth.ts`**

- Validates admin authentication
- Checks session/JWT token
- Protects admin-only routes

```typescript
// Usage in routes:
app.get("/admin/items", { preHandler: ensureAuthenticated }, listItems);
```

---

### **6. Controllers (Business Logic)**

Controllers handle the actual business logic and query the database.

#### **Admin Controllers**

**`adminController.ts`**

- Login/logout
- Dashboard rendering
- Profile management
- Password changes

**`auctionController.ts`**

- Create, read, update, delete auctions
- Publish/close auctions
- Assign items to auctions (single & bulk)
- Render auction admin pages

**`itemController.ts`**

- Create, read, update, delete items
- Search items
- Render items admin page
- Handle item status changes

**`sellerLeadController.ts`**

- Manage seller submissions
- Update lead status (draft → submitted → locked)
- Auto-link items when lead is locked
- Get items from lead
- Render leads admin pages

#### **Public Controllers**

**`publicController.ts`**

- View auction catalogue
- View single item details
- Handle item 404 errors
- Calculate auction status display

**`publicSellerController.ts`**

- Home page with published items/auctions
- Seller dashboard (track submissions)
- Filter orphaned items (deleted auction cleanup)
- Seller login

**`baseController.ts`**

- Shared helper functions
- `handleSuccess()` - format success responses
- `handleError()` - format error responses

---

### **Routes (Endpoint Definitions)**

Routes map HTTP requests to controllers.

**`adminAuthRoutes.ts`**

```typescript
POST /admin/login          → postLogin
GET  /admin/login          → getLogin
POST /admin/logout         → postLogout
```

**`auctionRoutes.ts`**

```typescript
GET    /api/auctions                           → listAuctions
POST   /api/auctions                           → createAuction
GET    /api/auctions/:id                       → getAuction
PUT    /api/auctions/:id                       → updateAuction
POST   /api/auctions/:id/publish               → publishAuction
POST   /api/auctions/:id/close                 → closeAuction
PUT    /api/auctions/:auctionId/items/:itemId  → assignItemToAuction
POST   /api/auctions/:auctionId/items/bulk-assign → bulkAssignItemsToAuction
DELETE /api/auctions/:auctionId/items/:itemId  → unassignItemFromAuction
GET    /admin/auctions                         → renderAuctionsPage
GET    /admin/auctions/:id                     → renderAuctionDetail
```

**`itemsRoutes.ts`**

```typescript
POST   /api/items                 → createItem
GET    /api/items                 → listItems
GET    /api/items/search          → searchItems
GET    /api/items/:id             → getItem
PUT    /api/items/:id             → updateItem
DELETE /api/items/:id             → deleteItem
GET    /admin/items               → renderItemsPage
GET    /admin/items/:id           → renderItemDetail
```

**`sellerLeadRoutes.ts`**

```typescript
POST   /api/leads                 → createLead
GET    /api/leads                 → listLead
GET    /api/leads/search          → searchLeads
GET    /api/leads/:id             → getLead
PATCH  /api/leads/:id             → updateLead (status only)
PUT    /api/leads/:id             → updateLeadFull (all fields)
DELETE /api/leads/:id             → DeleteLead
GET    /api/leads/:leadId/items   → getLeadItems
GET    /admin/leads               → renderLeadsPage
GET    /admin/leads/:id           → renderLeadDetail
```

**`publicRoutes.ts`**

```typescript
GET /catalogue                → getCatalogueList
GET /catalogue/:auctionId     → getAuctionCatalogue
GET /item/:itemId             → getItemDetail
```

**`publicSellerRoutes.ts`**

```typescript
GET  /                                  → getHome
GET  /seller/my-items                   → getSellerDashboard
GET  /seller/login                      → getSellerLogin
POST /api/public/submit-items           → submitSellerItems
POST /api/public/seller/login           → sellerLogin
PUT  /api/public/seller/:email          → updateSellerSubmission
GET  /api/public/seller/:email/items    → getSellerItems
```

---

### **Views (EJS Templates)**

#### **Admin Views** (`src/views/admin/`)

| File                    | Purpose                                         |
| ----------------------- | ----------------------------------------------- |
| `login.ejs`             | Admin login page                                |
| `dashboard.ejs`         | Admin home/stats                                |
| `auctions.ejs`          | List all auctions (with search/filter)          |
| `auction-detail.ejs`    | View auction details, assign items, bulk assign |
| `items.ejs`             | List all items (with search/filter)             |
| `item-detail.ejs`       | View/edit item details                          |
| `leads.ejs`             | List seller leads (with search/filter)          |
| `lead-detail.ejs`       | View lead, change status, load items from lead  |
| `profile.ejs`           | Admin profile & password change                 |
| `catalogue-preview.ejs` | Preview auction catalogue                       |

#### **Public Views** (`src/views/public/`)

| File                   | Purpose                                    |
| ---------------------- | ------------------------------------------ |
| `home.ejs`             | Landing page with published items/auctions |
| `auction.ejs`          | View single auction catalogue              |
| `item.ejs`             | View single item details                   |
| `catalogue.ejs`        | Browse all published auctions              |
| `qr-auction.ejs`       | QR-code access to auction (special view)   |
| `qr-not-found.ejs`     | QR code not found error                    |
| `seller-login.ejs`     | Seller email login                         |
| `seller-dashboard.ejs` | Seller tracks their submissions            |
| `404.ejs`              | Item/page not found error                  |

---

## 🔍 How to Trace Code - Examples {#trace-code}

### **Example 1: Admin Wants to Bulk Assign Items to Auction**

```
USER CLICKS "Bulk Assign" BUTTON
    ↓
auction-detail.ejs (frontend)
    ├── User enters: "LOT-1768363290323-TXBDASYPS, LOT-1768363290323-BPEGABQ83"
    └── bulkAssignItems() function sends POST request
    ↓
POST /api/auctions/{auctionId}/items/bulk-assign
    ↓
auctionRoutes.ts
    └── bulkAssignItemsToAuction middleware check
    ↓
auctionController.ts → bulkAssignItemsToAuction()
    ├── Validate auction exists & is draft
    ├── Trim & validate item IDs
    ├── Call: Items.updateMany()
    └── Call: assignLotNumber() for each item
    ↓
models/Items.ts
    └── Update items with auctionId & lotNumber
    ↓
MongoDB (items collection)
    └── Save updated items
    ↓
Response: JSON { success: true, modifiedCount: 2 }
    ↓
auction-detail.ejs
    └── Alert user: "2 items assigned!"
    └── location.reload()
```

**Key Files for This Feature:**

- Frontend: `src/views/admin/auction-detail.ejs` (lines 270-382)
- Route: `src/routes/auctionRoutes.ts` (line 36)
- Controller: `src/controllers/auctionController.ts` (line 427)
- Model: `src/models/Items.ts` (line 23)

---

### **Example 2: Admin Locks a Seller Lead**

```
ADMIN CLICKS "Verify & Lock" BUTTON
    ↓
lead-detail.ejs (frontend)
    └── updateStatus('locked') function
    ↓
PATCH /api/leads/{leadId}
    └── Body: { status: 'locked' }
    ↓
sellerLeadRoutes.ts
    └── updateLead middleware & auth check
    ↓
sellerLeadController.ts → updateLead()
    ├── Check if lead exists
    ├── Update status to 'locked'
    ├── NEW FIX: Find all items without sellerLeadId
    └── Link those items to this lead
    ↓
models/Items.ts
    └── Items.updateMany({ _id: ... }, { sellerLeadId: id })
    ↓
MongoDB (items collection)
    └── Items now have sellerLeadId set
    ↓
Response: JSON { success: true, lead: {...} }
    ↓
lead-detail.ejs
    └── location.reload()
    ↓
Admin clicks "Load Items"
    ├── GET /api/leads/{leadId}/items
    ├── sellerLeadController.ts → getLeadItems()
    ├── Items.find({ sellerLeadId: leadId })
    └── Returns items linked to lead ✅
```

**Key Files for This Feature:**

- Frontend: `src/views/admin/lead-detail.ejs` (lines 211-250)
- Route: `src/routes/sellerLeadRoutes.ts` (line 34)
- Controller: `src/controllers/sellerLeadController.ts` (line 125)
- Model: `src/models/Items.ts` & `SellersLead.ts`

---

### **Example 3: Public Home Page Shows Items**

```
USER VISITS: http://localhost:3000/
    ↓
GET / (root route)
    ↓
publicSellerRoutes.ts
    └── app.get("/", getHome)
    ↓
publicSellerController.ts → getHome()
    ├── Items.find({ status: 'published' })
    ├── Auction.find({ status: 'published' })
    ├── Enrich items with auction data
    ├── Filter out items with deleted auctions
    └── Pass data to view
    ↓
models/Items.ts & Auction.ts
    └── Query MongoDB
    ↓
MongoDB
    └── Returns matching documents
    ↓
home.ejs (view)
    ├── Loop through publishedItems
    ├── Display item cards with:
    │   ├── Title, description, estimate
    │   ├── Category badge
    │   ├── Auction status (active/ended/closed)
    │   └── Link to /item/{itemId}
    └── Render HTML
    ↓
BROWSER
    └── Displays home page with items ✅
```

**Key Files for This Feature:**

- Route: `src/routes/publicSellerRoutes.ts` (line 6)
- Controller: `src/controllers/publicSellerController.ts` (line 8)
- Models: `src/models/Items.ts`, `src/models/Auction.ts`
- View: `src/views/public/home.ejs` (lines 388-434)

---

## � Common Tasks Reference {#common-tasks}

| Task                     | Files to Look At                                                                     |
| ------------------------ | ------------------------------------------------------------------------------------ |
| Add new admin endpoint   | `routes/adminAuthRoutes.ts` + `controllers/adminController.ts` + `views/admin/*.ejs` |
| Create new API endpoint  | `routes/*.ts` + `controllers/*.ts`                                                   |
| Modify database schema   | `models/*.ts` + `types/index.ts`                                                     |
| Fix authentication       | `middleware/auth.ts` + `adminController.ts`                                          |
| Change styling           | `public/css/` + `views/**/*.ejs` (inline styles)                                     |
| Add validation logic     | `controllers/*.ts` (top of function)                                                 |
| Handle errors            | `baseController.ts` (handleError) + `controllers/*.ts`                               |
| Add date filtering       | `controllers/*.ts` (renderPage functions)                                            |
| Add search functionality | `routes/*.ts` (search endpoint) + `controllers/*.ts`                                 |

---

## 🚀 Development Workflow {#development-workflow}

### **To Add a New Admin Feature:**

1. **Define Types** → `src/types/index.ts`
2. **Create Model** → `src/models/YourModel.ts` (if new collection)
3. **Create Controller** → `src/controllers/yourController.ts`
4. **Add Routes** → `src/routes/yourRoutes.ts`
5. **Create Views** → `src/views/admin/yourPage.ejs`
6. **Register Routes** → `src/server.ts`

### **To Debug an Issue:**

1. Identify the request/endpoint
2. Find the route in `routes/*.ts`
3. Find the controller function
4. Check model queries
5. Verify MongoDB queries
6. Check view rendering
7. Check browser console for frontend errors

---

## 📊 Data Flow Diagram {#data-flow}

```
ADMIN PANEL (browser)
    │
    ├─→ POST /api/items ──→ itemController.createItem()
    │                         └─→ models/Items.ts
    │                             └─→ MongoDB
    │
    ├─→ PUT /api/auctions/:id ──→ auctionController.updateAuction()
    │                              └─→ models/Auction.ts
    │                                  └─→ MongoDB
    │
    └─→ GET /admin/items ──→ itemController.renderItemsPage()
                              └─→ models/Items.ts
                                  └─→ MongoDB
                                  └─→ views/admin/items.ejs

PUBLIC SITE (browser)
    │
    ├─→ GET / ──→ publicSellerController.getHome()
    │              └─→ models/Items.ts + Auction.ts
    │                  └─→ MongoDB
    │                  └─→ views/public/home.ejs
    │
    └─→ GET /item/:itemId ──→ publicController.getItemDetail()
                               └─→ models/Items.ts
                                   └─→ MongoDB
                                   └─→ views/public/item.ejs
```

---

## 🎯 Architecture Principles {#principles}

1. **Separation of Concerns**: Routes → Controllers → Models
2. **Type Safety**: Everything typed with TypeScript interfaces
3. **Middleware Pattern**: Authentication checked before business logic
4. **Error Handling**: Centralized in `baseController.ts`
5. **Database Agnostic**: Models abstract MongoDB operations
6. **View Rendering**: EJS templates for dynamic HTML
7. **REST API**: Consistent endpoint naming conventions

---

**Last Updated:** January 15, 2026  
**Use this guide to navigate the codebase efficiently! 🗺️**
