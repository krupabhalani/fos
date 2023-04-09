import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { firestore } from "../firebase.config";



// Saving new Item
export const saveItem = async (data) => {
  await setDoc(doc(firestore, "foodItems", `${Date.now()}`), data, {
    merge: true,
  });
};

export const editItemData = async (data) => {
  const ref = doc(firestore,'foodItems', data.id)
  const res = await setDoc(ref,data)
  
};

export const deleteItemData = async (data) => {
  const ref = doc(firestore,'foodItems', data.id)
  const res = await deleteDoc(ref)
  
};

// getall food items
export const getAllFoodItems = async () => {
  const items = await getDocs(
    query(collection(firestore, "foodItems"), orderBy("id", "desc"))
  );

  return items.docs.map((doc) => doc.data());
};
