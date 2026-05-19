import { User } from '../../../core/entities/User';
import { IUserRepository } from '../../../core/repositories/IUserRepository';

/**
 * MongoDB implementation stub.
 * Replace method bodies with Mongoose/MongoDB logic when ready.
 * Set DATABASE_PROVIDER=mongodb in .env to activate.
 */
export class MongoUserRepository implements IUserRepository {
  async findById(_id: string): Promise<User | null> {
    throw new Error('MongoUserRepository.findById: not yet implemented. Install mongoose and add your schema.');
  }
  async findByEmail(_email: string): Promise<User | null> {
    throw new Error('MongoUserRepository.findByEmail: not yet implemented.');
  }
  async create(_data: Omit<User, 'id' | 'createdAt'>): Promise<User> {
    throw new Error('MongoUserRepository.create: not yet implemented.');
  }
  async update(_id: string, _updates: Partial<User>): Promise<User> {
    throw new Error('MongoUserRepository.update: not yet implemented.');
  }
  async findAll(): Promise<User[]> {
    throw new Error('MongoUserRepository.findAll: not yet implemented.');
  }
}
