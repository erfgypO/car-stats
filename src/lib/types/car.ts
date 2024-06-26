import type {MileageItem} from "$lib/types/mileageItem";

export interface Car {
    id: number;
    name: string;
    userId: string;
    make: string;
    model: string;
    picture: string | null;
    mileage: MileageItem[];
}
