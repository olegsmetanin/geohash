import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm'

@Entity('points')
export class Point {

  @PrimaryGeneratedColumn()
  id: number

  @Column({ name: 'lat' })
  lat?: number

  @Column({ name: 'lng' })
  lng?: number

  @Column({ name: 'address' })
  address?: string

  @Column({ name: 'geohash' })
  geohash?: string

}