import { db, auth } from './firebase';
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
  query,
  where,
  serverTimestamp,
  setDoc,
  getDoc,
  onSnapshot
} from 'firebase/firestore';

// Collection names
const COLLECTIONS = {
  USERS: 'users',
  TENANTS: 'tenants',
  UNITS: 'units',
  EXPENSES: 'expenses',
  PAYMENTS: 'payments'
};

const getCurrentUserId = () => auth.currentUser?.uid || null;

// ============ Tenants Operations ============
export const addTenant = async (tenantData, userId) => {
  try {
    const uid = userId || getCurrentUserId();
    if (!uid) throw new Error('Firebase user is not authenticated');

    const docRef = await addDoc(collection(db, COLLECTIONS.TENANTS), {
      ...tenantData,
      userId: uid,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    return { id: docRef.id, userId: uid, ...tenantData };
  } catch (error) {
    console.error('Error adding tenant:', error);
    throw error;
  }
};

export const getTenants = async (userId) => {
  try {
    const uid = userId || getCurrentUserId();
    if (!uid) throw new Error('Firebase user is not authenticated');

    const q = query(collection(db, COLLECTIONS.TENANTS), where('userId', '==', uid));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error getting tenants:', error);
    throw error;
  }
};

export const updateTenant = async (tenantId, tenantData, userId) => {
  try {
    const uid = userId || getCurrentUserId();
    if (!uid) throw new Error('Firebase user is not authenticated');

    const tenantRef = doc(db, COLLECTIONS.TENANTS, tenantId);
    const updatedData = {
      ...tenantData,
      userId: uid,
      updatedAt: serverTimestamp()
    };
    await updateDoc(tenantRef, updatedData);
    return { id: tenantId, userId: uid, ...tenantData };
  } catch (error) {
    console.error('Error updating tenant:', error);
    throw error;
  }
};

export const deleteTenant = async (tenantId) => {
  try {
    await deleteDoc(doc(db, COLLECTIONS.TENANTS, tenantId));
  } catch (error) {
    console.error('Error deleting tenant:', error);
    throw error;
  }
};

// Real-time listener for tenants
export const onTenantsChange = (userId, callback) => {
  try {
    const q = query(collection(db, COLLECTIONS.TENANTS), where('userId', '==', userId));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const tenants = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      callback(tenants);
    });
    return unsubscribe;
  } catch (error) {
    console.error('Error setting up tenant listener:', error);
    throw error;
  }
};

// ============ Units Operations ============
export const addUnit = async (unitData, userId) => {
  try {
    const uid = userId || getCurrentUserId();
    if (!uid) throw new Error('Firebase user is not authenticated');

    const docRef = await addDoc(collection(db, COLLECTIONS.UNITS), {
      ...unitData,
      userId: uid,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    return { id: docRef.id, userId: uid, ...unitData };
  } catch (error) {
    console.error('Error adding unit:', error);
    throw error;
  }
};

export const getUnits = async (userId) => {
  try {
    const uid = userId || getCurrentUserId();
    if (!uid) throw new Error('Firebase user is not authenticated');

    const q = query(collection(db, COLLECTIONS.UNITS), where('userId', '==', uid));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error getting units:', error);
    throw error;
  }
};

export const updateUnit = async (unitId, unitData, userId) => {
  try {
    const uid = userId || getCurrentUserId();
    if (!uid) throw new Error('Firebase user is not authenticated');

    const unitRef = doc(db, COLLECTIONS.UNITS, unitId);
    const updatedData = {
      ...unitData,
      userId: uid,
      updatedAt: serverTimestamp()
    };
    await updateDoc(unitRef, updatedData);
    return { id: unitId, userId: uid, ...unitData };
  } catch (error) {
    console.error('Error updating unit:', error);
    throw error;
  }
};

export const deleteUnit = async (unitId) => {
  try {
    await deleteDoc(doc(db, COLLECTIONS.UNITS, unitId));
  } catch (error) {
    console.error('Error deleting unit:', error);
    throw error;
  }
};

// Real-time listener for units
export const onUnitsChange = (userId, callback) => {
  try {
    const q = query(collection(db, COLLECTIONS.UNITS), where('userId', '==', userId));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const units = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      callback(units);
    });
    return unsubscribe;
  } catch (error) {
    console.error('Error setting up unit listener:', error);
    throw error;
  }
};

// ============ Expenses Operations ============
export const addExpense = async (expenseData, userId) => {
  try {
    const uid = userId || getCurrentUserId();
    if (!uid) throw new Error('Firebase user is not authenticated');

    const docRef = await addDoc(collection(db, COLLECTIONS.EXPENSES), {
      ...expenseData,
      userId: uid,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    return { id: docRef.id, userId: uid, ...expenseData };
  } catch (error) {
    console.error('Error adding expense:', error);
    throw error;
  }
};

export const getExpenses = async (userId) => {
  try {
    const uid = userId || getCurrentUserId();
    if (!uid) throw new Error('Firebase user is not authenticated');

    const q = query(collection(db, COLLECTIONS.EXPENSES), where('userId', '==', uid));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error getting expenses:', error);
    throw error;
  }
};

export const updateExpense = async (expenseId, expenseData, userId) => {
  try {
    const uid = userId || getCurrentUserId();
    if (!uid) throw new Error('Firebase user is not authenticated');

    const expenseRef = doc(db, COLLECTIONS.EXPENSES, expenseId);
    const updatedData = {
      ...expenseData,
      userId: uid,
      updatedAt: serverTimestamp()
    };
    await updateDoc(expenseRef, updatedData);
    return { id: expenseId, userId: uid, ...expenseData };
  } catch (error) {
    console.error('Error updating expense:', error);
    throw error;
  }
};

export const deleteExpense = async (expenseId) => {
  try {
    await deleteDoc(doc(db, COLLECTIONS.EXPENSES, expenseId));
  } catch (error) {
    console.error('Error deleting expense:', error);
    throw error;
  }
};

// Real-time listener for expenses
export const onExpensesChange = (userId, callback) => {
  try {
    const q = query(collection(db, COLLECTIONS.EXPENSES), where('userId', '==', userId));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const expenses = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      callback(expenses);
    });
    return unsubscribe;
  } catch (error) {
    console.error('Error setting up expense listener:', error);
    throw error;
  }
};

// ============ Payments Operations ============
export const addPayment = async (paymentData, userId) => {
  try {
    const uid = userId || getCurrentUserId();
    if (!uid) throw new Error('Firebase user is not authenticated');

    const docRef = await addDoc(collection(db, COLLECTIONS.PAYMENTS), {
      ...paymentData,
      userId: uid,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    return { id: docRef.id, userId: uid, ...paymentData };
  } catch (error) {
    console.error('Error adding payment:', error);
    throw error;
  }
};

export const getPayments = async (userId) => {
  try {
    const uid = userId || getCurrentUserId();
    if (!uid) throw new Error('Firebase user is not authenticated');

    const q = query(collection(db, COLLECTIONS.PAYMENTS), where('userId', '==', uid));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error getting payments:', error);
    throw error;
  }
};

export const updatePayment = async (paymentId, paymentData, userId) => {
  try {
    const uid = userId || getCurrentUserId();
    if (!uid) throw new Error('Firebase user is not authenticated');

    const paymentRef = doc(db, COLLECTIONS.PAYMENTS, paymentId);
    const updatedData = {
      ...paymentData,
      userId: uid,
      updatedAt: serverTimestamp()
    };
    await updateDoc(paymentRef, updatedData);
    return { id: paymentId, userId: uid, ...paymentData };
  } catch (error) {
    console.error('Error updating payment:', error);
    throw error;
  }
};

export const deletePayment = async (paymentId) => {
  try {
    await deleteDoc(doc(db, COLLECTIONS.PAYMENTS, paymentId));
  } catch (error) {
    console.error('Error deleting payment:', error);
    throw error;
  }
};

// Real-time listener for payments
export const onPaymentsChange = (userId, callback) => {
  try {
    const q = query(collection(db, COLLECTIONS.PAYMENTS), where('userId', '==', userId));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const payments = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      callback(payments);
    });
    return unsubscribe;
  } catch (error) {
    console.error('Error setting up payment listener:', error);
    throw error;
  }
};

// ============ User Profile Operations ============
export const updateUserProfile = async (userId, userData) => {
  try {
    const userRef = doc(db, COLLECTIONS.USERS, userId);
    await setDoc(userRef, userData, { merge: true });
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }
};

export const getUserProfile = async (userId) => {
  try {
    const userRef = doc(db, COLLECTIONS.USERS, userId);
    const userSnap = await getDoc(userRef);
    return userSnap.exists() ? userSnap.data() : null;
  } catch (error) {
    console.error('Error getting user profile:', error);
    throw error;
  }
};
