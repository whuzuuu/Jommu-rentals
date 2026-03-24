export interface Car {
  id: string;
  name: string;
  price: number;
  type: string;
  imageUrl: string;
  transmission?: string;
  fuelType?: string;
  seats?: number;
  features?: string[];
  gallery?: string[];
}

export interface Booking {
  carId: string;
  carName: string;
  fullName: string;
  email: string;
  phone: string;
  pickupDate: string;
  returnDate: string;
  notes?: string;
  paymentMethod: "mpesa" | "card";
  paymentDetails: {
    mpesaPhone?: string;
    cardNumber?: string;
    expiryDate?: string;
    cvv?: string;
  };
}
