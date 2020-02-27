import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm'

@Entity('point')
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

  @Column({ name: 'geohash4' })
  geohash4?: string

}