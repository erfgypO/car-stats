import {decimal, integer, pgTable, serial, text, timestamp} from "drizzle-orm/pg-core";
import {relations} from "drizzle-orm";

export const userTable = pgTable("user", {
    id: text("id").primaryKey(),
    githubId: integer("github_id").unique(),
    username: text("username"),
    primaryCar: integer("primary_car"),
});

export const sessionTable = pgTable("session", {
    id: text("id").primaryKey(),
    userId: text("user_id")
        .notNull()
        .references(() => userTable.id),
    expiresAt: timestamp("expires_at", {
        withTimezone: true,
        mode: "date"
    }).notNull(),
});

export const carTable = pgTable("car", {
    id: serial("id").notNull().primaryKey(),
    name: text("name").notNull(),
    make: text("make").notNull(),
    model: text("model").notNull(),
    userId: text("user_id")
        .notNull()
        .references(() => userTable.id),
    picture: text("picture"),
});

export const mileageTable = pgTable("mileage", {
    id: serial("id").notNull().primaryKey(),
    carId: serial("car_id").notNull(),
    mileage: integer("mileage").notNull(),
    latitude: decimal("latitude"),
    longitude: decimal  ("longitude"),
    created: timestamp("timestamp").notNull().defaultNow(),
});

export const carRelations = relations(carTable, ({ many }) => ({
    mileage: many(mileageTable)
}));

export const mileageRelations = relations(mileageTable, ({ one }) => ({
    car: one(carTable, {
        fields: [mileageTable.carId],
        references: [carTable.id]
    })
}));
