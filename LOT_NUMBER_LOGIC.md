# Lot Number Logic Implementation - Codebase

## ✅ What Was Added to the Production Codebase

The lot number assignment logic is **NOW in the actual controllers**, not just the seed script.

### 1. **auctionController.ts** - New Helper Function & Updated Functions

#### NEW: `assignLotNumber()` Helper Function

```typescript
const assignLotNumber = async (auctionId: string, itemId: string) => {
  // Finds the highest lot number in the auction
  // Assigns the next sequential number to the item
  // Returns the assigned lot number
};
```

This function:

- Queries the auction for the item with the highest `lotNumber`
- Calculates the next number (currentMax + 1)
- Assigns it to the new item
- Supports adding items to auctions at any time

#### UPDATED: `assignItemToAuction()`

- Now calls `assignLotNumber()` after assigning the item
- Returns the assigned lot number in the response
- When an admin assigns a single item to an auction via API, it gets a lot number automatically

#### UPDATED: `bulkAssignItemsToAuction()`

- Now loops through all itemIds and assigns lot numbers to each
- Items are assigned sequentially: 1, 2, 3, etc.
- When multiple items are bulk-assigned to an auction, they all get lot numbers

#### UPDATED: `unassignItemFromAuction()`

- Now clears the `lotNumber` field when an item is removed from an auction
- Ensures consistency: unassigned items don't have lot numbers

### 2. **How It Works in Production**

**Scenario 1: Admin adds item to auction via UI/API**

```
Admin assigns Item A to Auction X
  ↓
assignItemToAuction() called
  ↓
Item A gets auctionId = X
  ↓
assignLotNumber() called
  ↓
Query: Find highest lotNumber where auctionId = X
  → Returns: 0 (no items yet) OR 5 (if 5 items exist)
  ↓
Next lot number = 6
  ↓
Item A gets lotNumber = 6
  ↓
Item A displays as "LOT 6" in QR auction view
```

**Scenario 2: Admin bulk-assigns 3 items to empty auction**

```
Admin assigns Items [A, B, C] to Auction Y
  ↓
bulkAssignItemsToAuction() called
  ↓
Update all 3 items with auctionId = Y
  ↓
Loop through each item:
  - Item A: highestLot = 0 → assign lotNumber = 1
  - Item B: highestLot = 1 → assign lotNumber = 2
  - Item C: highestLot = 2 → assign lotNumber = 3
  ↓
All 3 items displayed as LOT 1, LOT 2, LOT 3
```

**Scenario 3: Admin removes item from auction**

```
Admin unassigns Item A from Auction X
  ↓
unassignItemFromAuction() called
  ↓
Item A's auctionId = undefined
Item A's lotNumber = undefined
  ↓
Item A no longer shows lot number
```

### 3. **Key Implementation Details**

**Model Layer** (`src/models/Items.ts`):

```typescript
lotNumber: {
  type: Number;
} // Defined but not auto-assigned
```

**Controller Layer** (`src/controllers/auctionController.ts`):

```typescript
// Assigns lot numbers when items are added/removed from auctions
assignLotNumber(); // NEW helper
assignItemToAuction(); // UPDATED
bulkAssignItemsToAuction(); // UPDATED
unassignItemFromAuction(); // UPDATED
```

**View Layer** (`src/views/public/qr-auction.ejs`):

```html
<% if (item.lotNumber) { %>
<span class="lot-number">LOT <%= item.lotNumber %></span>
<% } %>
```

### 4. **What This Means**

✅ **Before**: Lot numbers only assigned during initial seeding
✅ **After**: Lot numbers assigned automatically whenever items are added to auctions

**Real-world scenario**:

1. Admin creates new item "Victorian Chair"
2. Admin assigns it to "Spring Auction 2026"
3. If auction already has 3 items, the chair gets **LOT 4** automatically
4. If admin later removes it, lot number is cleared
5. If admin re-assigns it, it gets the next available number

### 5. **Files Modified**

- `src/controllers/auctionController.ts` - Added helper + updated 3 functions
- No changes needed to: models, types, views, routes (all already compatible)

### 6. **Testing**

To test this in production:

1. Create an auction (draft)
2. Add items individually or in bulk
3. Each item should get sequential lot numbers
4. View via QR code - should see "LOT 1", "LOT 2", etc.
5. Unassign and reassign - lot numbers should update correctly

---

**Status**: ✅ COMPLETE - Lot number logic is now in the production codebase
