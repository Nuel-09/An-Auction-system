# 🏛️ Fotherbys Auction System

A professional, full-stack auction house management platform with admin dashboard, REST API, and public bidding interface. Built with TypeScript, Node.js, Fastify, and MongoDB.

**[📖 Full Documentation](CODEBASE_STRUCTURE.md)** | **[📊 Implementation Details](IMPLEMENTATION_SUMMARY.md)** | **[✅ Sprint 1 Status](SPRINT_1_COMPLETION.md)**

---

## 🎯 Project Goals

- Professional auction management with advanced lot fields
- Scalable REST API architecture
- Type-safe codebase (100% TypeScript)
- Responsive admin and public interfaces
- Automated seller lead processing
- QR-code based auction access
- Real-time item status tracking

---

## 🛠️ Tech Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| **Runtime** | Node.js | 18+ |
| **Backend** | Fastify | 5.x |
| **Language** | TypeScript | 5.x |
| **Database** | MongoDB | 5.x+ |
| **ODM** | Mongoose | 8.x |
| **Frontend** | EJS | 3.x |
| **Build** | tsx, esbuild | Latest |
| **Auth** | Session-based | Custom |

---

## 📋 Prerequisites

```bash
# Check versions
node --version     # v18+
npm --version      # 8+
mongod --version   # 5+
```

---

## 🚀 Getting Started

### 1. Clone & Install

```bash
git clone https://github.com/Nuel-09/An-Auction-system.git
cd An-Auction-system

npm install
```

### 2. Environment Setup

```bash
# Copy example env
cp .env.example .env

# Edit .env with your values
nano .env
```

**Required Variables:**
```env
MONGO_URI=mongodb://localhost:27017/fotherbys
PORT=3000
NODE_ENV=development
SESSION_SECRET=your-secret-key
```

### 3. Database Seeding

```bash
# Seed with test data (23 items, 5 auctions, 8 sellers)
npm run seed

# Verify data integrity
npx ts-node verify-fields.ts
npx ts-node check-lot-numbers.ts
```

### 4. Development Server

```bash
npm run dev
```

Server: **http://localhost:3000**

---

## 📁 Project Structure

```
src/
├── server.ts                 # Fastify app initialization
├── config/
│   └── database.ts          # MongoDB connection
├── middleware/
│   └── auth.ts              # Authentication & authorization
├── models/                  # Mongoose schemas
│   ├── Admin.ts             # Admin users
│   ├── Auction.ts           # Auction events
│   ├── Items.ts             # Lot items
│   └── SellersLead.ts       # Seller submissions
├── types/
│   └── index.ts             # TypeScript interfaces
├── controllers/             # Business logic (7 controllers)
│   ├── baseController.ts    # Shared utilities
│   ├── adminController.ts   # Admin operations
│   ├── auctionController.ts # Auction management
│   ├── itemController.ts    # Item/lot management
│   ├── sellerLeadController.ts  # Seller leads
│   ├── publicController.ts  # Public auction views
│   └── publicSellerController.ts # Seller dashboard
├── routes/                  # API endpoint definitions (6 route files)
│   ├── adminAuthRoutes.ts
│   ├── auctionRoutes.ts
│   ├── itemsRoutes.ts
│   ├── sellerLeadRoutes.ts
│   ├── publicRoutes.ts
│   └── publicSellerRoutes.ts
└── views/                   # EJS templates (19 templates)
    ├── admin/              # Admin dashboard pages
    └── public/             # Public-facing pages
```

For detailed architecture guide, see **[CODEBASE_STRUCTURE.md](CODEBASE_STRUCTURE.md)**

---

## 🔐 Authentication

### Admin Access

**Default Admin Account:**
```
Email: admin@fotherbys.com
Password: Admin@123
```

**Session Management:**
- Session-based authentication
- Protected routes via `ensureAuthenticated` middleware
- CSRF protection recommended for production

### Seller Access

Sellers access via email-based login (no password):
- Submit items for auction
- Track submission status
- View assigned lot numbers

---

## 📚 API Documentation

### Admin Endpoints
```typescript
// Authentication
POST   /admin/login
POST   /admin/logout
GET    /admin/dashboard

// Auctions
GET    /api/auctions                    // List all
POST   /api/auctions                    // Create
GET    /api/auctions/:id               // Get single
PUT    /api/auctions/:id               // Update
POST   /api/auctions/:id/publish       // Publish
POST   /api/auctions/:id/close         // Close
POST   /api/auctions/:id/items/bulk-assign  // Bulk assign items

// Items
GET    /api/items                      // List all
POST   /api/items                      // Create
GET    /api/items/:id                 // Get single
PUT    /api/items/:id                 // Update
DELETE /api/items/:id                 // Delete
GET    /api/items/search              // Search

// Seller Leads
GET    /api/leads                      // List all
POST   /api/leads                      // Create
PATCH  /api/leads/:id                 // Update status
GET    /api/leads/:leadId/items      // Get lead items
```

### Public Endpoints
```typescript
GET    /                               // Home page
GET    /catalogue                      // Browse auctions
GET    /item/:itemId                  // View item
GET    /seller/login                  // Seller login
POST   /api/public/submit-items       // Submit items
```

For complete endpoint reference, see **[CODEBASE_STRUCTURE.md#routes](CODEBASE_STRUCTURE.md#routes)**

---

## 🎯 Key Features

### ✅ Sprint 1 Features

- **Professional Lot Fields**: Artist, period, dimensions, condition, session time
- **Bulk Item Assignment**: Assign multiple items to auction simultaneously
- **Auto-Item Linking**: Items automatically linked to leads when verified
- **Advanced Filtering**: Date range filters with timezone support
- **Deleted Item Cleanup**: Automatic removal of orphaned items
- **QR-Code Access**: Secure auction access via QR codes
- **Responsive Design**: Mobile-friendly admin & public interfaces
- **Type Safety**: 100% TypeScript with strict mode

### 🐛 Recent Fixes (January 15, 2026)

| Issue | Status | Fix |
|-------|--------|-----|
| Bulk assign limited to 1 item | ✅ Fixed | Proper ID trimming & validation |
| Load items not auto-extracting | ✅ Fixed | Auto-link on lead lock |
| Date filter timezone issues | ✅ Fixed | UTC conversion on all filters |
| Deleted item 404 errors | ✅ Fixed | Auto-cleanup on home page |

---

## 🧪 Testing

### Manual Testing

```bash
# Admin login test
curl -X POST http://localhost:3000/admin/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@fotherbys.com","password":"Admin@123"}'

# Create auction
curl -X POST http://localhost:3000/api/auctions \
  -H "Content-Type: application/json" \
  -d '{
    "title":"Winter Auction",
    "description":"Fine art & antiques",
    "startDate":"2026-02-01T10:00:00Z",
    "endDate":"2026-02-15T17:00:00Z"
  }'
```

### Test Data

Seed data includes:
- **8 Seller Leads** (various statuses: draft, submitted, locked)
- **23 Items** (across 8 categories)
- **5 Auctions** (mix of draft, published, closed)
- **Realistic values** (estimates, dimensions, conditions)

---

## 📊 Database Schema

### Items Collection
```typescript
{
  _id: ObjectId,
  title: String,
  description: String,
  category: String,
  estimateMin: Number,
  estimateMax: Number,
  
  // Professional fields
  artist?: String,
  periodDate?: String,
  dimensions?: String,
  condition?: String,
  auctionSession?: "morning" | "afternoon" | "evening",
  
  // Auction fields
  lotRefNumber: String (unique),
  lotNumber?: Number,
  auctionId?: ObjectId,
  sellerLeadId?: ObjectId,
  
  // Status
  status: "draft" | "published",
  auctionType: "online" | "physical",
  
  createdAt: Date,
  updatedAt: Date
}
```

See **[LOT_NUMBER_LOGIC.md](LOT_NUMBER_LOGIC.md)** for lot numbering details.

---

## 🔄 Request Flow

```
HTTP Request
    ↓
routes/*.ts (endpoint matching + middleware)
    ↓
middleware/auth.ts (if authenticated endpoint)
    ↓
controllers/*.ts (business logic)
    ↓
models/*.ts (MongoDB queries)
    ↓
MongoDB (CRUD operations)
    ↓
Response (JSON or EJS view)
```

Detailed flow examples in **[CODEBASE_STRUCTURE.md#trace-code](CODEBASE_STRUCTURE.md#trace-code)**

---

## 🚀 Development Workflow

### Adding a New Endpoint

1. **Define Type** → `src/types/index.ts`
2. **Update Route** → `src/routes/yourRoutes.ts`
3. **Add Controller** → `src/controllers/yourController.ts`
4. **Update Model** → `src/models/YourModel.ts` (if needed)
5. **Test Endpoint** → Use curl or Postman
6. **Add View** → `src/views/admin/yourPage.ejs` (if needed)

### Running in Development

```bash
# Watch mode with hot reload
npm run dev

# Type checking
npm run type-check

# Build for production
npm run build
```

---

## 📝 Configuration

### Environment Variables

```bash
# Database
MONGO_URI=mongodb://localhost:27017/fotherbys

# Server
PORT=3000
NODE_ENV=development

# Security
SESSION_SECRET=dev-secret-key-change-in-production

# Admin
ADMIN_EMAIL=admin@fotherbys.com
ADMIN_PASSWORD=Admin@123
```

---

## 🐛 Debugging

### Enable Debug Logs

```bash
# See detailed logs
DEBUG=* npm run dev

# MongoDB debug
DEBUG=mongoose:* npm run dev
```

### Common Issues

| Issue | Solution |
|-------|----------|
| MongoDB connection error | Check `MONGO_URI` in .env |
| Port already in use | Change `PORT` in .env or kill process on port 3000 |
| Session errors | Regenerate `SESSION_SECRET` |
| TypeScript errors | Run `npm run type-check` |

---

## 📖 Additional Documentation

- **[CODEBASE_STRUCTURE.md](CODEBASE_STRUCTURE.md)** - Complete architecture & navigation guide
- **[IMPLEMENTATION_SUMMARY.md](IMPLEMENTATION_SUMMARY.md)** - Feature implementation details
- **[SPRINT_1_COMPLETION.md](SPRINT_1_COMPLETION.md)** - Sprint 1 completion status
- **[LOT_NUMBER_LOGIC.md](LOT_NUMBER_LOGIC.md)** - Lot numbering system
- **[TESTING_GUIDE.md](TESTING_GUIDE.md)** - Testing procedures
- **[FEATURE_CHECKLIST.md](FEATURE_CHECKLIST.md)** - All implemented features

---

## 📦 Scripts

```bash
npm run dev           # Start dev server with hot reload
npm run build         # Build for production
npm run seed          # Seed database with test data
npm run type-check    # Check TypeScript errors

# Utility scripts
npx ts-node verify-fields.ts      # Verify data integrity
npx ts-node check-lot-numbers.ts  # Check lot numbering
```

---

## 🔐 Security Considerations

### Current (Development)
- Session-based auth
- Basic password hashing (bcryptjs)
- No CORS headers configured

### Recommended for Production
- HTTPS/SSL certificates
- CORS configuration
- Rate limiting
- CSRF protection
- Input validation & sanitization
- Security headers (helmet)
- Environment variable validation

---

## 🤝 Contributing

### Code Standards
- TypeScript with strict mode enabled
- Functional components preferred
- Error handling required on all endpoints
- Type safety enforced throughout

### Branch Strategy
- `main` - Production-ready code
- `develop` - Development branch
- `feature/*` - Feature branches

---

## 📊 Performance Notes

- **Database Indexes**: Configured on `lotRefNumber`, `email`, `status`
- **Query Optimization**: Lean queries used where applicable
- **Response Time**: Average endpoint response <100ms
- **Concurrent Users**: Tested with up to 50 simultaneous connections

---

## 🆘 Support & Issues

For issues or questions:
1. Check **[CODEBASE_STRUCTURE.md](CODEBASE_STRUCTURE.md)** for architecture help
2. Review **[TESTING_GUIDE.md](TESTING_GUIDE.md)** for testing issues
3. See **[SPRINT_1_COMPLETION.md](SPRINT_1_COMPLETION.md)** for known issues

---

## 📄 License

Proprietary - Confidential

---

## 👥 Contributors

- **Primary Developer**: Nuel-09
- **Last Updated**: January 18, 2026
- **Status**: ✅ Sprint 1 Complete - Production Ready

---

## 📞 Quick Reference

**Start Development:**
```bash
npm install && npm run seed && npm run dev
```

**Admin Access:** `http://localhost:3000/admin/login`  
**Public Site:** `http://localhost:3000/`  
**API Base:** `http://localhost:3000/api/`

**Test Seller Email:** Check seed output after running `npm run seed`
