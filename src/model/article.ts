import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Article {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    article!: string;

    @Column()
    description!: string;

    @Column()
    url!: string;
}
