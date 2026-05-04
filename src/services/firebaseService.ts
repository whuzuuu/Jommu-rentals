import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  onSnapshot,
  Timestamp,
  getDocFromServer
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, auth, storage, handleFirestoreError, OperationType } from "../firebase";

// Test connection
async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if(error instanceof Error && error.message.includes('the client is offline')) {
      console.error("Please check your Firebase configuration. ");
    }
  }
}
testConnection();

// Storage
export const uploadFile = async (file: File, folder: string = 'cars') => {
  try {
    const storageRef = ref(storage, `${folder}/${Date.now()}_${file.name}`);
    const snapshot = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);
    return downloadURL;
  } catch (error) {
    console.error("Error uploading file:", error);
    throw error;
  }
};

// Cars
export const getCars = async () => {
  const path = 'cars';
  try {
    const q = query(collection(db, path), orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, path);
  }
};

export const getCarById = async (id: string) => {
  const path = `cars/${id}`;
  try {
    const docRef = doc(db, 'cars', id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    }
    return null;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, path);
  }
};

export const subscribeToCars = (callback: (cars: any[]) => void) => {
  const path = 'cars';
  const q = query(collection(db, path), orderBy('createdAt', 'desc'));
  return onSnapshot(q, (snapshot) => {
    callback(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  }, (error) => {
    handleFirestoreError(error, OperationType.LIST, path);
  });
};

export const createCar = async (carData: any) => {
  const path = 'cars';
  try {
    const docRef = await addDoc(collection(db, path), {
      ...carData,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });
    return docRef.id;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
};

export const updateCar = async (id: string, carData: any) => {
  const path = `cars/${id}`;
  try {
    const docRef = doc(db, 'cars', id);
    await updateDoc(docRef, {
      ...carData,
      updatedAt: Timestamp.now(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
};

export const deleteCar = async (id: string) => {
  const path = `cars/${id}`;
  try {
    const docRef = doc(db, 'cars', id);
    await deleteDoc(docRef);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
};

// Bookings
export const createBooking = async (bookingData: any) => {
  const path = 'bookings';
  try {
    const docRef = await addDoc(collection(db, path), {
      ...bookingData,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });
    return docRef.id;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
};

export const subscribeToBookings = (callback: (bookings: any[]) => void) => {
  const path = 'bookings';
  const q = query(collection(db, path), orderBy('createdAt', 'desc'));
  return onSnapshot(q, (snapshot) => {
    callback(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  }, (error) => {
    handleFirestoreError(error, OperationType.LIST, path);
  });
};

export const updateBookingStatus = async (id: string, status: string) => {
  const path = `bookings/${id}`;
  try {
    const docRef = doc(db, 'bookings', id);
    await updateDoc(docRef, {
      status,
      updatedAt: Timestamp.now(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
};

// Customers
export const createCustomer = async (customerData: any) => {
  const path = 'customers';
  try {
    const docRef = await addDoc(collection(db, path), {
      ...customerData,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });
    return docRef.id;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
};

export const getCustomerByEmail = async (email: string) => {
  const path = 'customers';
  try {
    const q = query(collection(db, path), where('email', '==', email));
    const snapshot = await getDocs(q);
    if (!snapshot.empty) {
      const doc = snapshot.docs[0];
      return { id: doc.id, ...doc.data() };
    }
    return null;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, path);
  }
};

export const subscribeToCustomers = (callback: (customers: any[]) => void) => {
  const path = 'customers';
  const q = query(collection(db, path), orderBy('createdAt', 'desc'));
  return onSnapshot(q, (snapshot) => {
    callback(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  }, (error) => {
    handleFirestoreError(error, OperationType.LIST, path);
  });
};

// Profiles
export const createAdminProfile = async (profileData: any) => {
  const path = 'admin_profiles';
  try {
    const docRef = await addDoc(collection(db, path), {
      ...profileData,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });
    return docRef.id;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
};

export const updateAdminProfile = async (id: string, profileData: any) => {
  const path = `admin_profiles/${id}`;
  try {
    const docRef = doc(db, 'admin_profiles', id);
    await updateDoc(docRef, {
      ...profileData,
      updatedAt: Timestamp.now(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
};

export const subscribeToAdminProfiles = (callback: (profiles: any[]) => void) => {
  const path = 'admin_profiles';
  const q = query(collection(db, path), orderBy('createdAt', 'asc'));
  return onSnapshot(q, (snapshot) => {
    callback(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  }, (error) => {
    handleFirestoreError(error, OperationType.LIST, path);
  });
};

export const deleteAdminProfile = async (id: string) => {
  const path = `admin_profiles/${id}`;
  try {
    await deleteDoc(doc(db, 'admin_profiles', id));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
};

// Admin Stats (Computed client-side for now)
export const getAdminStats = async () => {
  try {
    const cars = await getDocs(collection(db, 'cars'));
    const bookings = await getDocs(collection(db, 'bookings'));
    const customers = await getDocs(collection(db, 'customers'));
    
    const paidBookings = bookings.docs.filter(doc => doc.data().paymentStatus === 'paid');
    const totalRevenue = paidBookings.reduce((acc, doc) => acc + (doc.data().totalPrice || 0), 0);

    return {
      totalCars: cars.size,
      totalBookings: bookings.size,
      totalCustomers: customers.size,
      totalRevenue,
      trends: {
        carTrend: { value: 2, isUp: true },
        bookingTrend: { value: 12, isUp: true },
        revenueTrend: { value: 8, isUp: true },
        customerTrend: { value: 5, isUp: true },
      }
    };
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, 'stats');
  }
};
