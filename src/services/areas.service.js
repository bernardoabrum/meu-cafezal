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
      where("ownedProperty", "==", areaId),
    );
    const subareasSnap = await getDocs(q);
    const deletePromises = subareasSnap.docs.map((docSnap) =>
      deleteDoc(docSnap.ref),
    );
    await Promise.all(deletePromises);
  }
  await deleteDoc(areaRef);
};

export const updatePropertyStats = async (propertyId) => {
  try {
    const fields = await getAreasByUser({
      ownedProperty: propertyId,
      areaType: "field",
    });

    const totals = fields.reduce(
      (acc, f) => ({
        plants: acc.plants + (f.plantsNumber || 0),
        area: acc.area + (f.areaSize || 0),
      }),
      { plants: 0, area: 0 },
    );

    await updateAreaById(propertyId, {
      plantsNumber: totals.plants,
      cultivatedArea: totals.area,
    });
  } catch (err) {
    console.error("Erro ao recalcular estatísticas:", err);
    throw err;
  }
};

export const updateAreaGeometry = async (areaId, polygonPath) => {
  const areaRef = doc(db, "areas", areaId);
  const areaSnap = await getDoc(areaRef);

  if (!areaSnap.exists()) {
    throw new Error("Área não encontrada");
  }

  const areaData = areaSnap.data();

  const areaSize = google.maps.geometry.spherical.computeArea(polygonPath);

  const areaCords = polygonPath.map((point) => ({
    lat: point.lat(),
    lng: point.lng(),
  }));

  let plantsNumber = 0;

  if (
    areaData.areaType === "field" &&
    areaData.roadSpace &&
    areaData.plantSpace
  ) {
    plantsNumber = areaSize / areaData.roadSpace / areaData.plantSpace;
  }

  await updateDoc(areaRef, {
    areaSize,
    areaCords,
    plantsNumber,
  });

  if (areaData.areaType === "field" && areaData.ownedProperty) {
    await updatePropertyStats(areaData.ownedProperty);
  }

  return {
    areaSize,
    areaCords,
    plantsNumber,
  };
};
