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
  await addDoc(collection(db, "areas"), payload);
};

export const updateAreaById = async (areaId, payload) => {
  const areaRef = doc(db, "areas", areaId);
  await updateDoc(areaRef, payload);
};

export const deleteAreaById = async (areaId) => {
  const areaRef = doc(db, "areas", areaId);
  const snap = await getDoc(areaRef);
  const { areaType } = snap.data();
  if (areaType === "property") {
    const q = query(
      collection(db, "areas"),
      where("user", "==", auth.currentUser.uid),
      where("ownedProperty", "==", areaId)
    );
    const subareasSnap = await getDocs(q);
    const deletePromises = subareasSnap.docs.map((docSnap) =>
      deleteDoc(docSnap.ref)
    );
    await Promise.all(deletePromises);
  }
  await deleteDoc(areaRef);
};
