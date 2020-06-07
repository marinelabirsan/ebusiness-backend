import bcrypt from "bcryptjs";
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  OneToOne,
  BeforeInsert,
} from "typeorm";
import { Profile } from "../../profile/models/profile";
import { Address } from "../../profile/models/address";

export interface UserDTO {
  id: string;
  email: string;
  password?: string;
  role: string;
}

@Entity("users")
export class User implements UserDTO {
  constructor(email: string, password: string, role: string) {
    this.email = email;
    this.password = password;
    this.role = role;
  }

  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ unique: true })
  email!: string;

  @Column()
  password!: string;

  @Column()
  role!: string;

  @OneToMany(() => Address, (address) => address.user)
  addresses!: Address[];

  @OneToOne(() => Profile)
  profile!: Profile;

  @BeforeInsert()
  setPassword(): void {
    this.password = bcrypt.hashSync(this.password, 20);
  }

  verifyPassword(password: string): boolean {
    return bcrypt.compareSync(password, this.password);
  }
}