import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { Post } from './post.entity';

@Injectable()
export class AppService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Post) private readonly postRepository: Repository<Post>
  ) {}

  async create(data: any): Promise<User>{
    return this.userRepository.save(data)
  }

  async findOneByEmail(email: string): Promise<User | undefined> {
    return this.userRepository.findOne({ where: { email } });
  }

  async createPost(post: { title: string; content: string; user: User }): Promise<Post> {
    const newPost = this.postRepository.create(post);
    return this.postRepository.save(newPost);
  }

  async findPostsByUser(userId: number): Promise<Post[]> {
    return this.postRepository.find({
      where: { user: { id: userId } },
      select: ['id', 'title', 'content'],
      relations: ['user'],
    });
  }
}