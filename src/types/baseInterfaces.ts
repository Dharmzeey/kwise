interface PlaceData {
    id: string;
    name: string;
}

interface LgaData extends PlaceData{
    delivery_fee: number,
    delivery_days: number,
}