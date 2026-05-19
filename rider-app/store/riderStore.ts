import { create } from 'zustand';
import api from '../utils/api';
import { getSocket, connectSocket, disconnectSocket, joinRidersRoom, updateLocation, updateOrderStatus } from '../utils/socket';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
  initializeSocketListeners: () => void;
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

  toggleOnline: async () => {
    const nextOnlineState = !get().isOnline;
    if (nextOnlineState) {
      set({ isOnline: true, status: 'searching' });
      
      try {
        // DEV HACK: Auto-login as the seeded rider for testing
        const res = await api.post('/auth/login', { email: 'rider@kaledash.com', password: 'Rider1234!' });
        const { token } = res.data;
        await AsyncStorage.setItem('auth_token', token);
        
        connectSocket(token);
        get().initializeSocketListeners();
        joinRidersRoom();
      } catch (err) {
        console.error('Failed to login rider:', err);
      }
    } else {
      set({ isOnline: false, status: 'offline', activeOrder: null });
      disconnectSocket();
    }
  },

  initializeSocketListeners: () => {
    const socket = getSocket();
    
    socket.off('order:new'); // prevent duplicate listeners
    socket.on('order:new', (order: any) => {
      // Map backend order to RiderOrder format
      const incomingOrder: RiderOrder = {
        id: order.id,
        restaurantName: order.restaurantName,
        restaurantAddress: order.deliveryAddress || '12 Ring Road, East Legon', // fallback
        restaurantLocation: { latitude: 5.6322, longitude: -0.1585 },
        customerName: order.customerName,
        customerAddress: order.deliveryAddress,
        customerLocation: order.deliveryCoordinates || { latitude: 5.6062, longitude: -0.1762 },
        deliveryNotes: 'Standard Delivery',
        paymentMethod: 'Cash on Delivery',
        items: order.items.map((i: any) => `${i.quantity}x ${i.name}`),
        totalPrice: order.total,
        estimatedEarnings: 8.50, // mock payout calculation
        pickupDistance: '1.2 km',
        dropoffDistance: '3.4 km',
        estimatedTime: '22 min',
      };
      
      if (get().status === 'searching') {
        set({
          status: 'order_alert',
          activeOrder: incomingOrder,
          alertTimer: 15,
        });
      }
    });
  },

  triggerMockOrderAlert: () => {
    set({
      status: 'order_alert',
      activeOrder: MOCK_ORDER,
      alertTimer: 15,
    });
  },

  acceptOrder: async () => {
    set({ status: 'heading_to_restaurant' });
    const order = get().activeOrder;
    if (order) {
      // Assign rider to order and update status to processing
      try {
        await api.put(`/orders/${order.id}`, { status: 'heading_to_restaurant', riderName: 'Kwame Asante', riderPhone: '+233 24 000 0001' });
        updateOrderStatus(order.id, 'heading_to_restaurant');
      } catch (err) { console.error('Failed to accept order on backend', err); }
    }
  },

  rejectOrder: () => {
    set({ status: 'searching', activeOrder: null });
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

  advanceStatus: async () => {
    const currentStatus = get().status;
    const order = get().activeOrder;
    
    let nextStatus: RiderStatus = currentStatus;
    switch (currentStatus) {
      case 'heading_to_restaurant': nextStatus = 'at_restaurant'; break;
      case 'at_restaurant': nextStatus = 'heading_to_customer'; break;
      case 'heading_to_customer': nextStatus = 'at_customer'; break;
      case 'at_customer': nextStatus = 'completed'; break;
      default: return;
    }

    set({ status: nextStatus });

    if (order && nextStatus !== 'completed') {
      try {
        await api.put(`/orders/${order.id}`, { status: nextStatus });
        updateOrderStatus(order.id, nextStatus);
      } catch (err) { console.error('Status update failed', err); }
    }

    if (nextStatus === 'completed') {
      if (order) {
        try {
          await api.put(`/orders/${order.id}`, { status: 'delivered' });
          updateOrderStatus(order.id, 'delivered');
        } catch (err) { console.error('Delivery complete failed', err); }
      }

      const reward = order ? order.estimatedEarnings : 0;
      set((state) => ({
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
        }
      }, 4000);
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
