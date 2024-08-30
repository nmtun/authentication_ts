import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';

@Entity('posts')
export class Post {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column('text')
  content: string;

  @ManyToOne(() => User, user => user.posts, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' }) 
  user: User;
}
