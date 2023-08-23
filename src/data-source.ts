import "reflect-metadata"
import { DataSource } from "typeorm"
import { SnakeNamingStrategy } from "typeorm-naming-strategies"

export const AppDataSource = new DataSource({
    type: "postgres",
    host: "localhost",
    port: 5430,
    username: "pix_user",
    password: "pixservice123",
    database: "pix_reaction_db",
    namingStrategy: new SnakeNamingStrategy(),
    synchronize: false,
    logging: false,
    entities: ["src/entity/**/*.ts"],
    migrations: ["src/migration/**/*.ts"],
    subscribers: [],
})
