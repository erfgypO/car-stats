import {db, schema} from "$lib/server/db";
import {and, eq} from "drizzle-orm";
import type {Car} from "$lib/types/car";
import {carTable, mileageTable} from "$lib/server/schema";
import {getPrimaryCar, updatePrimaryCarSetting} from "$lib/server/actions/user-actions";

export async function getAllCars(userId: string) {
    const cars = await db.query.carTable.findMany({
        where: eq(schema.carTable.userId, userId)
    });

    return cars as Car[];
}

export async function getCarById(carId: number, userId: string) {
    const car =  await db.query.carTable.findFirst({
        where: and(
            eq(schema.carTable.userId, userId),
            eq(schema.carTable.id, carId)
        ),
        with: {
            mileage: {
                orderBy: (mileage, { desc }) => [desc(mileage.created)],
                limit: 5
            }
        }
    });

    return car as Car;
}

export async function checkCarExists(carId: number, userId: string) {
    const car = await db.query.carTable.findFirst({
        where: and(
            eq(schema.carTable.userId, userId),
            eq(schema.carTable.id, carId)
        )
    });

    return car !== undefined;
}

export async function addMileage(carId: number, mileage: number, latitude: number | null, longitude: number | null) {
    await db.insert(schema.mileageTable).values({
        carId,
        mileage,
        latitude,
        longitude,
    })
}

export interface CarParams {
    name: string,
    model: string,
    make: string
}

export async function updateCar(carId: number, userId: string, params: CarParams): Promise<void> {
    await db.update(carTable).set(params)
        .where(and(
            eq(carTable.id, carId),
            eq(carTable.userId, userId)
        ));
}

export async function createCar(userId: string, params: CarParams): Promise<void> {
    await db.insert(schema.carTable).values({
        ...params,
        userId
    });
}

export async function deleteCar(carId: number, userId: string): Promise<void> {
    const carExists = await checkCarExists(carId, userId);

    if(!carExists) {
        throw new Error("Car not found");
    }

    const primaryCar = await getPrimaryCar(userId);
    if(primaryCar === carId) {
        await updatePrimaryCarSetting(userId, null);
    }

    await db.delete(schema.carTable).where(and(
       eq(carTable.id, carId),
       eq(carTable.userId, userId)
    ));
    await db.delete(mileageTable).where(eq(mileageTable.carId, carId));
}

export async function updateCarPicture(carId: number, userId: string, picture: string): Promise<void> {
    const result = await db.update(schema.carTable).set({
        picture
    }).where(and(
        eq(carTable.id, carId),
        eq(carTable.userId, userId)
    ));

    if(result.rowCount !== 1) {
        throw new Error("Car not found");
    }
}

export async function getCarPicture(carId: number, userId: string): Promise<string | null> {
    const car = await db.query.carTable.findFirst({
        where: and(
            eq(carTable.id, carId),
            eq(carTable.userId, userId)
        ),
        columns: {
            picture: true,
        }
    });

    return car?.picture ?? null;
}
