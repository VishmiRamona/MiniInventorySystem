# BookStore API Endpoints

## Base URL
```
https://localhost:7274/api
```

---

## Category APIs

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| GET | /api/Category | Get all categories |
| POST | /api/Category | Create a new category |

### Sample Request Body (POST)
```json
{
  "categoryName": "Fiction",
  "description": "Novels and storybooks"
}
```

---

## Supplier APIs

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| GET | /api/Supplier | Get all suppliers |
| POST | /api/Supplier | Create a new supplier |

### Sample Request Body (POST)
```json
{
  "supplierName": "Penguin Random House",
  "contactNumber": "077-1111111",
  "email": "orders@penguin.lk",
  "address": "Colombo 01"
}
```

---

## Item APIs

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| GET | /api/Item | Get all items |
| POST | /api/Item | Create a new item |

### Sample Request Body (POST)
```json
{
  "itemCode": "FIC001",
  "barcode": "9780141182801",
  "itemName": "1984 by George Orwell",
  "categoryId": 1,
  "supplierId": 1,
  "costPrice": 800.00,
  "sellingPrice": 1200.00,
  "reorderLevel": 5
}
```

---

## Stock APIs

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| POST | /api/Stock/in | Record stock in (add stock) |
| POST | /api/Stock/out | Record stock out (remove stock) |
| GET | /api/Stock/balance | Get stock balance report |
| GET | /api/Stock/low-stock | Get low stock items |

### Sample Request Body (POST Stock In)
```json
{
  "itemId": 1,
  "supplierId": 1,
  "quantity": 50,
  "costPrice": 800.00
}
```

### Sample Request Body (POST Stock Out)
```json
{
  "itemId": 1,
  "quantity": 3,
  "reason": "Sale"
}
```

### Sample Response (GET Stock Balance)
```json
{
  "success": true,
  "message": "Balance report retrieved successfully.",
  "data": [
    {
      "itemId": 1,
      "itemCode": "FIC001",
      "itemName": "1984 by George Orwell",
      "totalStockIn": 50,
      "totalStockOut": 4,
      "currentBalance": 46,
      "stockStatus": "Good Stock"
    }
  ]
}
```

---

## User APIs

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| GET | /api/User | Get all users |
| POST | /api/User | Create a new user |

### Sample Request Body (POST)
```json
{
  "username": "staff2",
  "email": "staff2@bookstore.com",
  "password": "staff123",
  "role": "Staff"
}
```

---

## Common Response Format

All APIs return responses in this format:

```json
{
  "success": true,
  "message": "Operation completed successfully.",
  "data": { ... },
  "errors": null
}
```

| Field | Type | Description |
| :--- | :--- | :--- |
| success | boolean | Indicates if the request was successful |
| message | string | A human-readable message |
| data | object/array | The response data (if any) |
| errors | array | Any error messages (if any) |