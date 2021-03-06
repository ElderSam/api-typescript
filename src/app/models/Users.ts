import { Entity, PrimaryGeneratedColumn, Column, BeforeInsert, BeforeUpdate, getRepository, Repository } from 'typeorm';
import bcrypt from 'bcryptjs';
import { UserToInsert } from './../utils/UserInterface';

let repository: Repository<User>;

@Entity('users')
export default class User {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column()
    email: string;

    @Column()
    password: string;

    @Column()
    idade: string;

    @Column()
    peso: string;

    @Column()
    etnia: string;

    @BeforeInsert()
    hashPassword1() {
        this.password = User.hashPass(this.password);
    }

    @BeforeUpdate()
    hashPassword2() {
        console.log('password: ', this.password)

        if(this.password)
            this.password = User.hashPass(this.password);
    }

    static hashPass(password: string) {
        return bcrypt.hashSync(password, 8); // encrypts the password
    }

    static async list() {
        repository = getRepository(User);

        return await repository.createQueryBuilder("users")
            .select([
                "id",
                "name",
                "email",
                "idade",
                "peso",
                "etinia"
            ]) // without password
            .getRawMany();
    }

    static async findbyColumnValue(column: string, value: string) {
        repository = getRepository(User);

        return await repository.createQueryBuilder("users")
            .where(`LOWER(${column}) = LOWER(:value)`, { value })
            .getOne();
    }

    static async insert(user: UserToInsert) {
        repository = getRepository(User);

        const auxUser = repository.create(user); // save on Database
        return await repository.save(auxUser);
    }

    static async update(id: string, user: object) {
        repository = getRepository(User);

        repository.createQueryBuilder("users")
            .update(User)
            .set(user)
            .where("id = :id", { id })
            .execute();
    }

    static async delete(id: string) {
        repository = getRepository(User);

        return await repository.delete(id)
    }
}