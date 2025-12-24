import { auth, db } from "@/firebase";
import {
  collection,
  getDoc,
  getDocs,
  query,
  where,
  addDoc,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";

export const getAreasByUser = async (filters = {}) => {
  const userId = auth.currentUser.uid;

  const constraints = [where("user", "==", userId)];

  Object.entries(filters).forEach(([field, value]) => {
    if (value !== undefined && value !== null) {
      constraints.push(where(field, "==", value));
    }
  });

  const q = query(collection(db, "areas"), ...constraints);

  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
};

export const getAreaById = async (areaId) => {
  const areaRef = doc(db, "areas", areaId);
  const areaSnap = await getDoc(areaRef);
  return areaSnap.data();
};

export const postNewArea = async (payload) => {
  try {
    await addDoc(collection(db, "areas"), payload);
  } catch (error) {
    console.error("Erro ao adicionar área: ", error);
  }
};

export const updateArea = async (areaId, payload) => {
  const areaRef = doc(db, "areas", areaId);
  await updateDoc(areaRef, payload);
};

export const deleteAreaById = async (areaId) => {
  const areaRef = doc(db, "areas", areaId);
  await deleteDoc(areaRef);
};
