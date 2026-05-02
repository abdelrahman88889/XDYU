import { db } from './firebase';
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

// ============ Tenants Operations ============
export const addTenant = async (userId, tenantData) => {
  try {
    const docRef = await addDoc(collection(db, COLLECTIONS.TENANTS), {
      ...tenantData,
      userId,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    return { id: docRef.id, ...tenantData };
  } catch (error) {
    console.error('Error adding tenant:', error);
    throw error;
  }
};

export const getTenants = async (userId) => {
  try {
    const q = query(collection(db, COLLECTIONS.TENANTS), where('userId', '==', userId));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error getting tenants:', error);
    throw error;
  }
};

export const updateTenant = async (tenantId, tenantData) => {
  try {
    const tenantRef = doc(db, COLLECTIONS.TENANTS, tenantId);
    await updateDoc(tenantRef, {
      ...tenantData,
      updatedAt: serverTimestamp()
    });
    return { id: tenantId, ...tenantData };
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
export const addUnit = async (userId, unitData) => {
  try {
    const docRef = await addDoc(collection(db, COLLECTIONS.UNITS), {
      ...unitData,
      userId,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    return { id: docRef.id, ...unitData };
  } catch (error) {
    console.error('Error adding unit:', error);
    throw error;
  }
};

export const getUnits = async (userId) => {
  try {
    const q = query(collection(db, COLLECTIONS.UNITS), where('userId', '==', userId));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error getting units:', error);
    throw error;
  }
};

export const updateUnit = async (unitId, unitData) => {
  try {
    const unitRef = doc(db, COLLECTIONS.UNITS, unitId);
    await updateDoc(unitRef, {
      ...unitData,
      updatedAt: serverTimestamp()
    });
    return { id: unitId, ...unitData };
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
export const addExpense = async (userId, expenseData) => {
  try {
    const docRef = await addDoc(collection(db, COLLECTIONS.EXPENSES), {
      ...expenseData,
      userId,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    return { id: docRef.id, ...expenseData };
  } catch (error) {
    console.error('Error adding expense:', error);
    throw error;
  }
};

export const getExpenses = async (userId) => {
  try {
    const q = query(collection(db, COLLECTIONS.EXPENSES), where('userId', '==', userId));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error getting expenses:', error);
    throw error;
  }
};

export const updateExpense = async (expenseId, expenseData) => {
  try {
    const expenseRef = doc(db, COLLECTIONS.EXPENSES, expenseId);
    await updateDoc(expenseRef, {
      ...expenseData,
      updatedAt: serverTimestamp()
    });
    return { id: expenseId, ...expenseData };
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
export const addPayment = async (userId, paymentData) => {
  try {
    const docRef = await addDoc(collection(db, COLLECTIONS.PAYMENTS), {
      ...paymentData,
      userId,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    return { id: docRef.id, ...paymentData };
  } catch (error) {
    console.error('Error adding payment:', error);
    throw error;
  }
};

export const getPayments = async (userId) => {
  try {
    const q = query(collection(db, COLLECTIONS.PAYMENTS), where('userId', '==', userId));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error getting payments:', error);
    throw error;
  }
};

export const updatePayment = async (paymentId, paymentData) => {
  try {
    const paymentRef = doc(db, COLLECTIONS.PAYMENTS, paymentId);
    await updateDoc(paymentRef, {
      ...paymentData,
      updatedAt: serverTimestamp()
    });
    return { id: paymentId, ...paymentData };
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
