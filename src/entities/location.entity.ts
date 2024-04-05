import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity("locations")
export class Location {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({
    length: 100,
  })
  street: string;

  @Column({
    length: 50,
  })
  city: string;

  @Column("text")
  zip_code: string;

  @Column()
  county: string;

  @Column()
  country: string;

  @Column("float")
  latitude: number;

  @Column("float")
  longitude: number;

  @Column("text")
  time_zone: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
