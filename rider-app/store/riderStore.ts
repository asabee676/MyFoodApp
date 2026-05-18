import { create } from 'zustand';

export type RiderStatus =
  | 'offline'
  | 'searching'
  | 'order_alert'
  | 'heading_to_restaurant'
  | 'at_restaurant'
  | 'heading_to_customer'
  | 'at_customer'
  | 'completed';

export interface RiderLocation {
  latitude: number;
  longitude: number;
  latitudeDelta?: number;
  longitudeDelta?: number;
}

export interface RiderOrder {
  id: string;
  restaurantName: string;
  restaurantAddress: string;
  restaurantLocation: RiderLocation;
  customerName: string;
  customerAddress: string;
  customerLocation: RiderLocation;
  deliveryNotes: string;
  paymentMethod: 'Prepaid' | 'Cash on Delivery';
  items: string[];
  totalPrice: number;
  estimatedEarnings: number;
  pickupDistance: string; // e.g. "1.5 km"
  dropoffDistance: string; // e.g. "4.2 km"
  estimatedTime: string; // e.g. "25 min"
}

interface RiderState {
  isOnline: boolean;
  status: RiderStatus;
  currentLocation: RiderLocation;
  activeOrder: RiderOrder | null;
  earnings: {
    today: number;
    total: number;
    tripsCompleted: number;
    acceptanceRate: number;
    rating: number;
  };
  bonusTarget: {
    current: number;
    target: number;
    amount: number;
  };
  alertTimer: number; // For the 15 seconds order alert count down
  
  // Actions
  toggleOnline: () => void;
  acceptOrder: () => void;
  rejectOrder: () => void;
  advanceStatus: () => void;
  setAlertTimer: (time: number) => void;
  decrementTimer: () => void;
  cashOut: () => void;
  triggerMockOrderAlert: () => void;
}

// Accra-based mockup coordinates
const ACCRA_RIDER_START: RiderLocation = {
  latitude: 5.6037,
  longitude: -0.1870,
};

const MOCK_ORDER: RiderOrder = {
  id: 'RIDER-9982',
  restaurantName: "Mama's Kitchen",
  restaurantAddress: '12 Ring Road, East Legon',
  restaurantLocation: { latitude: 5.6322, longitude: -0.1585 },
  customerName: 'Abel Amissah',
  customerAddress: 'Block C, Airport Residential Area',
  customerLocation: { latitude: 5.6062, longitude: -0.1762 },
  deliveryNotes: 'Please ring the doorbell. Second-floor apartment.',
  paymentMethod: 'Cash on Delivery',
  items: ['Jollof Rice + Chicken x2', 'Zobo Drink (Large) x2'],
  totalPrice: 22.00,
  estimatedEarnings: 8.50,
  pickupDistance: '1.2 km',
  dropoffDistance: '3.4 km',
  estimatedTime: '22 min',
};

export const useRiderStore = create<RiderState>((set, get) => ({
  isOnline: false,
  status: 'offline',
  currentLocation: ACCRA_RIDER_START,
  activeOrder: null,
  earnings: {
    today: 0,
    total: 1245.50,
    tripsCompleted: 142,
    acceptanceRate: 98,
    rating: 4.92,
  },
  bonusTarget: {
    current: 1,
    target: 3,
    amount: 10,
  },
  alertTimer: 15,

  toggleOnline: () => {
    const nextOnlineState = !get().isOnline;
    if (nextOnlineState) {
      set({ isOnline: true, status: 'searching' });
      // Simulate searching and finding an order after 4 seconds
      setTimeout(() => {
        if (get().status === 'searching') {
          get().triggerMockOrderAlert();
        }
      }, 4000);
    } else {
      set({ isOnline: false, status: 'offline', activeOrder: null });
    }
  },

  triggerMockOrderAlert: () => {
    set({
      status: 'order_alert',
      activeOrder: MOCK_ORDER,
      alertTimer: 15,
    });
  },

  acceptOrder: () => {
    set({ status: 'heading_to_restaurant' });
  },

  rejectOrder: () => {
    set({ status: 'searching', activeOrder: null });
    // Search again after a delay
    setTimeout(() => {
      if (get().status === 'searching') {
        get().triggerMockOrderAlert();
      }
    }, 6000);
  },

  setAlertTimer: (time) => set({ alertTimer: time }),
  
  decrementTimer: () => {
    const currentTimer = get().alertTimer;
    if (currentTimer > 0) {
      set({ alertTimer: currentTimer - 1 });
    } else if (get().status === 'order_alert') {
      get().rejectOrder(); // Auto-reject when timer hits 0
    }
  },

  advanceStatus: () => {
    const currentStatus = get().status;
    switch (currentStatus) {
      case 'heading_to_restaurant':
        set({ status: 'at_restaurant' });
        break;
      case 'at_restaurant':
        set({ status: 'heading_to_customer' });
        break;
      case 'heading_to_customer':
        set({ status: 'at_customer' });
        break;
      case 'at_customer':
        // Deliver completed! Update earnings
        const order = get().activeOrder;
        const reward = order ? order.estimatedEarnings : 0;
        set((state) => ({
          status: 'completed',
          earnings: {
            ...state.earnings,
            today: state.earnings.today + reward,
            total: state.earnings.total + reward,
            tripsCompleted: state.earnings.tripsCompleted + 1,
          },
          bonusTarget: {
            ...state.bonusTarget,
            current: Math.min(state.bonusTarget.current + 1, state.bonusTarget.target),
          }
        }));
        
        // Auto return to searching after 3 seconds of showing success state
        setTimeout(() => {
          if (get().status === 'completed') {
            set({ status: 'searching', activeOrder: null });
            // Simulate searching again
            setTimeout(() => {
              if (get().status === 'searching') {
                get().triggerMockOrderAlert();
              }
            }, 6000);
          }
        }, 4000);
        break;
      default:
        break;
    }
  },

  cashOut: () => {
    set((state) => ({
      earnings: {
        ...state.earnings,
        today: 0, // Reset today's cash out
        total: state.earnings.total - state.earnings.today,
      }
    }));
  }
}));
