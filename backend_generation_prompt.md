# AI System Prompt: Database-Agnostic Backend for Food Delivery System

You are a Senior Backend Engineer. Your task is to generate a fully functional Node.js + Express backend written in TypeScript for the **KaleDash / ChowDash Food Delivery System**, and hook it up to the existing client mobile app, rider mobile app, and admin web app.

---

## 1. Core Architecture Goal: Pluggable Database Technology

To allow swapping the database technology at any time (e.g. from JSON file storage/In-Memory to MongoDB, PostgreSQL, or Firebase) without changing the core business logic or routes, you MUST implement the **Repository Pattern** and **Dependency Inversion**:

1. **Define Core Domain Entities & Interfaces** (`/src/core/domains` & `/src/core/repositories`): Create pure TypeScript interfaces for repositories (e.g. `IUserRepository`, `IRestaurantRepository`, `IOrderRepository`, `IRiderRepository`).
2. **Abstract Controller Dependencies**: Controllers and Express Route Handlers must interact with Repository Interfaces, *not* concrete implementations.
3. **Database Driver Switchboard**: Create a central Registry/Factory (or simple Dependency Injection container) where the active repository implementation can be swapped via a single environment variable change (e.g., `DATABASE_PROVIDER=inmemory` vs `DATABASE_PROVIDER=mongodb`).

---

## 2. Recommended Directory Structure

Generate the backend project inside a new folder named `backend/` in the workspace root:

```text
backend/
├── package.json
├── tsconfig.json
├── .env
├── src/
│   ├── index.ts                 # App entry point, HTTP server, and Socket.io setup
│   ├── config/
│   │   └── env.ts               # Env variables & validation
│   ├── core/
│   │   ├── entities/            # TypeScript Domain Models/Types
│   │   │   ├── User.ts
│   │   │   ├── Restaurant.ts
│   │   │   ├── Order.ts
│   │   │   └── Rider.ts
│   │   └── repositories/        # Repository Interfaces
│   │       ├── IUserRepository.ts
│   │       ├── IRestaurantRepository.ts
│   │       ├── IOrderRepository.ts
│   │       └── IRiderRepository.ts
│   ├── infrastructure/
│   │   ├── repositories/        # Repository Concrete Implementations
│   │   │   ├── json/            # Local JSON File storage (plugs into sample-restaurants.json)
│   │   │   │   ├── JsonUserRepository.ts
│   │   │   │   └── JsonRestaurantRepository.ts
│   │   │   ├── mongo/           # MongoDB (Mongoose) implementations (optional boilerplate)
│   │   │   └── prisma/          # PostgreSQL (Prisma) implementations (optional boilerplate)
│   │   ├── database/            # DB Connection setup
│   │   └── di/                  # Dependency Injection Container
│   │       └── container.ts     # Configures and exports active repositories based on .env
│   ├── interface/
│   │   ├── controllers/         # HTTP Controllers (interact only with repositories)
│   │   ├── middleware/          # Auth, Validation, Error Handling
│   │   └── routes/              # Express API Route Declarations
│   └── sockets/                 # Real-time WebSockets (Socket.io) handlers
```

---

## 3. Data Schemas & Repository Interfaces

Define the TypeScript models and interface methods. 

### User Interface & `IUserRepository`
Roles: `client`, `rider`, `admin`, `merchant`.
```typescript
export interface User {
  id: string;
  email: string;
  passwordHash: string;
  name: string;
  role: 'client' | 'rider' | 'admin' | 'merchant';
  phoneNumber?: string;
  createdAt: Date;
}

export interface IUserRepository {
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  create(user: Omit<User, 'id' | 'createdAt'>): Promise<User>;
  update(id: string, updates: Partial<User>): Promise<User>;
}
```

### Restaurant Interface & `IRestaurantRepository`
```typescript
export interface MenuItem {
  id: string;
  category: string;
  name: string;
  desc: string;
  price: number;
  image: string;
}

export interface Restaurant {
  id: string;
  name: string;
  cuisine: string[];
  image: string;
  rating: number;
  reviews: number;
  deliveryTime: string;
  deliveryFee: number;
  minOrder: number;
  promo?: string | null;
  featured: boolean;
  tags: string[];
  address: string;
  menu: MenuItem[];
  status: 'active' | 'inactive' | 'pending';
}

export interface IRestaurantRepository {
  findAll(): Promise<Restaurant[]>;
  findById(id: string): Promise<Restaurant | null>;
  create(restaurant: Omit<Restaurant, 'id'>): Promise<Restaurant>;
  update(id: string, updates: Partial<Restaurant>): Promise<Restaurant>;
  addMenuItem(restaurantId: string, item: Omit<MenuItem, 'id'>): Promise<MenuItem>;
  updateMenuItem(restaurantId: string, itemId: string, updates: Partial<MenuItem>): Promise<MenuItem>;
  deleteMenuItem(restaurantId: string, itemId: string): Promise<void>;
}
```

### Order Interface & `IOrderRepository`
```typescript
export interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

export interface Order {
  id: string;
  customerId: string;
  customerName: string;
  customerPhone?: string;
  restaurantId: string;
  restaurantName: string;
  items: OrderItem[];
  total: number;
  status: 'pending' | 'processing' | 'heading_to_restaurant' | 'at_restaurant' | 'heading_to_customer' | 'at_customer' | 'delivered' | 'cancelled';
  deliveryAddress: string;
  deliveryCoordinates?: { latitude: number; longitude: number };
  riderId?: string | null;
  riderName?: string | null;
  riderPhone?: string | null;
  date: Date;
  estimatedTime?: string;
}

export interface IOrderRepository {
  create(order: Omit<Order, 'id' | 'date'>): Promise<Order>;
  findById(id: string): Promise<Order | null>;
  findByCustomerId(customerId: string): Promise<Order[]>;
  findByRiderId(riderId: string): Promise<Order[]>;
  findByRestaurantId(restaurantId: string): Promise<Order[]>;
  findAll(): Promise<Order[]>;
  update(id: string, updates: Partial<Order>): Promise<Order>;
}
```

---

## 4. REST APIs and Socket.io Events

### REST Routes:
- **Authentication**: `POST /api/auth/signup`, `POST /api/auth/login`, `GET /api/auth/profile`
- **Restaurants**: `GET /api/restaurants` (public), `GET /api/restaurants/:id` (public), `POST /api/restaurants` (admin), `PUT /api/restaurants/:id` (admin/merchant), `DELETE /api/restaurants/:id` (admin)
- **Menu Editor**: `POST /api/restaurants/:id/menu` (merchant/admin), `PUT /api/restaurants/:id/menu/:itemId` (merchant/admin), `DELETE /api/restaurants/:id/menu/:itemId` (merchant/admin)
- **Orders**:
  - `POST /api/orders` (client - creates order, sets to pending)
  - `GET /api/orders/client` (client order history)
  - `GET /api/orders/rider` (rider active/history orders)
  - `GET /api/orders/merchant/:restaurantId` (merchant orders)
  - `PUT /api/orders/:id` (update status, assign rider)
- **Admin Stats**: `GET /api/admin/stats` (admin-only)

### WebSocket (Socket.io) Real-time Flows:
1. **Real-time Order Alerts**: When a client places an order (`POST /api/orders`), emit a socket event to nearby riders / online riders: `order:new` with the order payload.
2. **Order Acceptance**: When a rider accepts an order, emit `order:updated` to the client so their tracking screen updates from `pending` to `heading_to_restaurant`.
3. **Rider Location Updates**: While a rider is active, they emit `rider:location_update` `{ orderId, latitude, longitude }` over WebSockets every 5-10 seconds. The backend broadcasts this to the client tracking the order via `order:location_updated` `{ latitude, longitude }`.
4. **Order Milestones**: When the rider marks status changes (`at_restaurant` -> `heading_to_customer` -> `delivered`), the backend broadcasts `order:status_updated` to the client.

---

## 5. Hooking up the Applications (Frontend Changes)

Help step-by-step to transition from mock data to real API endpoints:

### A. Client App (Root Folder)
1. **API Client**: Create `utils/api.ts` using Axios / Fetch, configuration with `BASE_URL` (usually pointing to local IP like `http://192.168.x.x:5000` or `http://localhost:5000`).
2. **Authentication**:
   - Update `app/signup.tsx` and `app/login.tsx` to call API endpoints, save the returned JWT token using Expo's SecureStore or AsyncStorage, and update auth states.
3. **Restaurant List**:
   - Fetch real restaurants from `GET /api/restaurants` inside `app/(tabs)/index.tsx`.
4. **Ordering & Cart**:
   - In `app/cart.tsx`, update the checkout logic to call `POST /api/orders`, then navigate to the tracking / orders history page.
5. **Real-time Tracking**:
   - In `app/(tabs)/orders.tsx`, use Socket.io-client to listen for `order:status_updated` and `order:location_updated` to dynamically render the rider's position on the MapView.

### B. Rider App (`./rider-app`)
1. **Rider Store**:
   - Update `/store/riderStore.ts`. Instead of mock timeouts in `toggleOnline`, make an API call to update status and initialize socket listeners.
2. **Location Streaming**:
   - In `app/delivery.tsx`, read rider coordinates (using `expo-location` which is already in dependencies) and emit `rider:location_update` events via the socket client.
3. **Status Transitions**:
   - Update `advanceStatus` to make `PUT /api/orders/:id` calls to update the order status through: `heading_to_restaurant` -> `at_restaurant` -> `heading_to_customer` -> `at_customer` -> `completed`/`delivered`.

### C. Admin App (`./admin-app`)
1. **API Client & Auth**:
   - Configure a base Axios client pointing to `/api`.
   - Update `Login` / `Auth` routes to handle admin or merchant JWTs.
   - Hook up `src/pages/Restaurants.tsx` and `src/pages/MenuEditor.tsx` to call real endpoints `GET /api/restaurants`, `POST /api/restaurants`, `PUT /api/restaurants/:id/menu` instead of using the local mock arrays.
2. **Live Orders**:
   - Hook up `src/pages/Orders.tsx` to fetch orders from `GET /api/orders` and optionally subscribe to socket room for new order notifications.
