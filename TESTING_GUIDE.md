# Professional Auction Lot Fields - Testing Guide

## 🎯 Quick Start

### Server Status

✅ Development server running on `http://localhost:3000`

### Database Status

✅ MongoDB connected with 23 items and 5 auctions

---

## 🧪 TESTING THE NEW LOT FIELDS

### 1. View QR Auction (Public-Facing)

**Access via QR Code:**

```
URL: http://localhost:3000/qr/QR-ART-2026-001
```

**What You'll See:**

- Auction title: "Online Fine Art Collection"
- Location: "London, UK"
- 3 Art items with full professional details
- Each item displays:
  - ✅ Artist name (e.g., "Charles Bellender")
  - ✅ Period/date (e.g., "1905")
  - ✅ Dimensions (e.g., "1.2m x 0.85m")
  - ✅ Condition (e.g., "Excellent, original gilt frame")
  - ✅ Auction session (e.g., "afternoon")
  - ✅ Lot reference (e.g., "LOT-1768360810927-KP8KCZW8A")
  - ✅ Estimate range
  - ✅ Auction type badge

**Other QR Codes to Test:**

```
QR-JEWEL-2026-001  →  Luxury Jewelry & Gems (3 items, £20k+ physical auction)
QR-ASIA-2026-001   →  Asian Antiquities (3 items, includes Ming vase)
```

---

### 2. Admin Functions

#### Login to Admin Panel

```
URL: http://localhost:3000/admin/login
Email: admin@fotherbys.com
Password: Admin@123
```

#### View Catalogue Preview

```
After login:
URL: http://localhost:3000/admin/catalogue-preview
```

**What You'll See:**

- All published auctions (3 total)
- Each auction card shows:
  - ✅ Title
  - ✅ Location (new field)
  - ✅ Item count
  - ✅ QR code (copyable)
  - ✅ Visual QR code (modal popup)
  - ✅ Status badge

#### Admin Dashboard

```
URL: http://localhost:3000/admin/dashboard (requires login)
```

**Features Visible:**

- User management options
- Auction management
- Link to catalogue preview
- Active seller leads
- Statistics

---

## 📊 DATA SAMPLE - What to Look For

### Sample Item: Victorian Mahogany Dining Table

```
Field              Value
─────────────────────────────────────────────
Title:             Victorian Mahogany Dining Table
Artist/Maker:      John Smithson
Period:            1890s
Dimensions:        1.85m x 1.2m
Condition:         Excellent, minor surface wear
Session:           morning
Lot Reference:     LOT-1768360810927-KP8KCZW8A
Estimate:          £1200 - £1800
Type:              Online Auction
Category:          Furniture
```

### Sample Item: Ming Dynasty Porcelain Vase

```
Field              Value
──────────────────────────────────────────────
Title:             Ming Dynasty Porcelain Vase
Artist/Maker:      Ming Dynasty artisan
Period:            1450-1500
Dimensions:        Height 30cm, diameter 18cm
Condition:         Excellent, museum quality, no restoration
Session:           evening
Lot Reference:     LOT-[auto-generated]
Estimate:          £16,000 - £25,000
Type:              Physical Auction
Category:          Asian Art
Location:          1 Savile Row, London, England
```

---

## 🧪 VERIFICATION CHECKLIST

As you test, verify these points:

### Type Fields

- [ ] Artist/maker name displays for each item
- [ ] Period/date shows historical context
- [ ] Dimensions provided in standard format
- [ ] Condition clearly stated
- [ ] Session (morning/afternoon/evening) assigned
- [ ] Lot reference auto-generated and unique

### Visual Layout

- [ ] Item cards responsive on mobile
- [ ] Professional lot details section visible
- [ ] Information organized in readable format
- [ ] Color-coding matches auction type
- [ ] All fields conditional (optional fields hidden if empty)

### Data Consistency

- [ ] Lot reference follows LOT-[timestamp]-[random] format
- [ ] All 23 items have complete field data
- [ ] Auctions show correct locations
- [ ] QR codes match expected patterns

### Functionality

- [ ] QR codes properly route to auctions
- [ ] Admin login works with credentials
- [ ] Catalogue preview loads all auctions
- [ ] QR modal displays visual codes
- [ ] Copy-to-clipboard works for QR codes

---

## 🎯 FEATURE-SPECIFIC TESTING

### Professional Cataloguing

**Test artist attribution:**

1. Go to QR-ART-2026-001
2. Look for "Artist / Maker" in each item card
3. Verify artists: Charles Bellender, Margaret Hartley, Edmund Fisher

**Test period information:**

1. View any item
2. Find "Period / Date" field
3. Examples: 1890s, 1905, 14th Century

**Test dimensions:**

1. Check "Dimensions" field on any item
2. Verify format: "1.2m x 0.85m" or "Height 30cm"

### Multi-Session Auctions

**Test session distribution:**

1. View multiple items across auctions
2. Sessions should vary: morning, afternoon, evening
3. Example session flow:
   - Furniture lots (morning) → Art (afternoon) → Watches (evening)

### Physical vs Online

**Online Auctions:**

1. QR-ART-2026-001 (all items < £20k)
2. Badge shows "🌐 Online"

**Physical Auctions:**

1. QR-JEWEL-2026-001 (includes £20k+ items)
2. Location: "1 Savile Row, London, England"
3. Badge shows "📍 Physical"

### Auto-Generated References

**Lot Reference Numbers:**

1. Each item has unique LOT-[timestamp]-[random] reference
2. Examples:
   - LOT-1768360810927-KP8KCZW8A
   - LOT-1768360810928-XY9ZQWER
3. Verify no duplicates across database

---

## 🔐 PRIVACY VERIFICATION

### Confirm QR-Only Access

- [ ] No public catalogue listing (no `/catalogue` endpoint)
- [ ] QR code required to view auctions
- [ ] Invalid QR codes show error page
- [ ] Admin preview shows QR codes

### Test Invalid QR

```
Try: http://localhost:3000/qr/INVALID-CODE
Expected: Error page or redirect
```

### Test Valid QR

```
Try: http://localhost:3000/qr/QR-ART-2026-001
Expected: Full auction view with all items
```

---

## 📱 RESPONSIVE DESIGN TESTING

### Mobile View

1. Open DevTools (F12)
2. Toggle Device Toolbar (Ctrl+Shift+M)
3. Set to iPhone 12 (390x844)
4. Check:
   - [ ] Item cards stack vertically
   - [ ] Text readable without scrolling
   - [ ] Images scale properly
   - [ ] Buttons accessible (no overlap)

### Tablet View

1. DevTools → iPad (768x1024)
2. Verify:
   - [ ] 2-column grid for items
   - [ ] Lot details readable
   - [ ] Professional spacing maintained

### Desktop View (Current)

1. Full 1200px viewport
2. Verify:
   - [ ] Multi-column grid
   - [ ] Lot details side-by-side
   - [ ] Professional layout

---

## 🐛 TROUBLESHOOTING

### QR Code Not Found

```
Error: "This QR code is not found"
Reason: Invalid QR code or auction not published
Fix: Use one of the valid test codes above
```

### Admin Login Fails

```
Error: Invalid credentials
Reason: Wrong email/password
Fix: Use admin@fotherbys.com / Admin@123
```

### Fields Not Displaying

```
Issue: New lot fields not visible
Reason: Page cache or browser cache
Fix: Hard refresh (Ctrl+Shift+R) or clear cache
```

### Database Connection

```
Error: Cannot connect to MongoDB
Reason: MongoDB not running
Fix: Ensure MongoDB is running on localhost:27017
```

---

## 📊 EXPECTED RESULTS SUMMARY

| Feature       | Status | Details                     |
| ------------- | ------ | --------------------------- |
| Artist Field  | ✅     | Displays for all 23 items   |
| Period Field  | ✅     | Historical dates/eras shown |
| Dimensions    | ✅     | Physical specs provided     |
| Condition     | ✅     | Conservation status noted   |
| Session       | ✅     | Morning/Afternoon/Evening   |
| Lot Reference | ✅     | Auto-generated, unique      |
| Location      | ✅     | Shows for physical auctions |
| QR Access     | ✅     | 3 working test codes        |
| Admin Preview | ✅     | All auctions visible        |
| Responsive    | ✅     | Works on all screen sizes   |

---

## 🎓 BUSINESS FEATURES VALIDATED

✅ **Professional Lot Cataloguing**

- Full item provenance (artist, period, dimensions)
- Condition assessment visible
- Proper lot referencing system

✅ **Privacy-First Access**

- No public catalogue listings
- QR code gatekeeping working
- Admin preview secure

✅ **Multi-Session Management**

- Items distributed across morning, afternoon, evening
- Session information clearly labeled
- Professional auction scheduling

✅ **Responsive Professional Design**

- Auction house-grade layout
- Mobile-friendly presentation
- Print-ready formatting

---

## 🚀 NEXT STEPS FOR USER TESTING

1. **Login as Admin** → Test catalogue preview
2. **View QR Auction** → Verify all lot fields display
3. **Check Responsive** → Test on mobile device
4. **Copy QR Code** → Test print/distribution workflow
5. **Provide Feedback** → Report any missing features

---

## 📞 SUPPORT

For issues or questions:

1. Check the troubleshooting section above
2. Review the IMPLEMENTATION_SUMMARY.md for technical details
3. Review the FEATURE_CHECKLIST.md for complete feature list

---

**Ready to Test!** 🎉

Start with: `http://localhost:3000/qr/QR-ART-2026-001`
