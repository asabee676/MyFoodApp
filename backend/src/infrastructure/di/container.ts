import { env } from '../../config/env';

import { IUserRepository } from '../../core/repositories/IUserRepository';
import { IRestaurantRepository } from '../../core/repositories/IRestaurantRepository';
import { IOrderRepository } from '../../core/repositories/IOrderRepository';
import { IRiderRepository } from '../../core/repositories/IRiderRepository';

// InMemory implementations
import { InMemoryUserRepository } from '../repositories/inmemory/InMemoryUserRepository';
import { InMemoryRestaurantRepository } from '../repositories/inmemory/InMemoryRestaurantRepository';
import { InMemoryOrderRepository } from '../repositories/inmemory/InMemoryOrderRepository';
import { InMemoryRiderRepository } from '../repositories/inmemory/InMemoryRiderRepository';

// MongoDB stubs
import { MongoUserRepository } from '../repositories/mongo/MongoUserRepository';
import { MongoRestaurantRepository } from '../repositories/mongo/MongoRestaurantRepository';
import { MongoOrderRepository } from '../repositories/mongo/MongoOrderRepository';

interface Container {
  userRepo: IUserRepository;
  restaurantRepo: IRestaurantRepository;
  orderRepo: IOrderRepository;
  riderRepo: IRiderRepository;
}

function buildContainer(): Container {
  const provider = env.DATABASE_PROVIDER;
  console.log(`[DI Container] Using database provider: ${provider}`);

  switch (provider) {
    case 'mongodb':
      return {
        userRepo: new MongoUserRepository(),
        restaurantRepo: new MongoRestaurantRepository(),
        orderRepo: new MongoOrderRepository(),
        // MongoDB rider repo stub — falls back to InMemory until implemented
        riderRepo: new InMemoryRiderRepository(),
      };

    case 'inmemory':
    default:
      return {
        userRepo: new InMemoryUserRepository(),
        restaurantRepo: new InMemoryRestaurantRepository(),
        orderRepo: new InMemoryOrderRepository(),
        riderRepo: new InMemoryRiderRepository(),
      };
  }
}

// Singleton container — created once on startup
export const container: Container = buildContainer();
