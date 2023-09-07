import {
  QueryConstraint,
  collection,
  collectionGroup,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  onSnapshot,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { initializeApp } from "firebase/app";
import { FIRESTORE_CONFIG } from "./config.js";

export class FirestoreWeb {
  // initialize firebase config
  static get db() {
    return getFirestore(initializeApp(FIRESTORE_CONFIG));
  }


  private static pathSegmentCounter = (path: string) => {
    const segmentCount = (path.match(
      new RegExp(String.raw`(?<segment>[^/]+)`, "gi")
    ) ?? []).length
    return segmentCount;
  };


  private static isColPath = (path: string) => {
    const pathSegmentCount = this.pathSegmentCounter(path);
    if (pathSegmentCount === 0) return false;
    return pathSegmentCount % 2 === 1;
  };


  private static isDocPath = (path: string) => {
    const pathSegmentCount = this.pathSegmentCounter(path);
    if (pathSegmentCount === 0) return false;
    return pathSegmentCount % 2 === 0;
  };


  static createDoc = async (path: string, data: any): Promise<any> => {
    switch (true) {
      case this.isDocPath(path): {
        const docRef = doc(this.db, path);
        const doc_id = docRef.id;
        // Set the data for the document, including the doc_id and timestamps.
        const response = await setDoc(docRef, {
          ...data,
          doc_id,
          date_created: serverTimestamp(),
          date_updated: serverTimestamp(),
        });
        return response;
      }
      case this.isColPath(path): {
        const colRef = collection(this.db, path);
        const docRef = doc(colRef);
        const doc_id = docRef.id;
        // Set the data for the document, including the doc_id and timestamps.
        const response = await setDoc(docRef, {
          ...data,
          doc_id,
          date_created: serverTimestamp(),
          date_updated: serverTimestamp(),
        });
        return response;
      }
    }
  }


  static readDoc = async (docPath: string): Promise<any> => {
    if (!this.isDocPath(docPath)) return;
    // Get a reference to the document.
    const docRef = doc(this.db, docPath);

    // Get the document data.
    const response = await getDoc(docRef);
    const data = response.data();

    return data;
  }

  
  static updateDoc = async (docPath: string, data: any): Promise<any> => {
    if (!this.isDocPath(docPath)) return;
    // Get a reference to the document and update it with the given data.
    const docRef = doc(this.db, docPath);
    const response = await updateDoc(docRef, {
      ...data,
      date_updated: serverTimestamp(),
    });
    // Return the Firestore response object.
    return response;
  }


  static deleteDoc = async (docPath: string) => {
    if (!this.isDocPath(docPath)) return;
    // Get a reference to the document and delete it.
    const docRef = doc(this.db, docPath);
    const response = await deleteDoc(docRef);

    // Return the Firestore response object.
    return response;
  }


  static readCol = async (colPath: string, ...queryDef: Array<QueryConstraint>) => {
    if (!this.isColPath(colPath)) return;
    // Get a reference to the collection and apply the query definition.
    const colRef = collection(this.db, colPath);
    const q = query(colRef, ...queryDef);

    // Get the documents in the collection that match the query.
    const snapshot = await getDocs(q);

    // Map the documents to an array of data objects and return it.
    const data = snapshot.docs.map((doc) => {
      return {
        ...doc.data(),
      };
    });

    return data;
  }


  static readColGroup = async (colGroupId: string, ...queryDef: Array<QueryConstraint>) => {
    if (this.pathSegmentCounter(colGroupId) !== 1) return;
    // Get a reference to the collection group and apply the query definition.
    const colGroupRef = collectionGroup(this.db, colGroupId);
    const q = query(colGroupRef, ...queryDef);

    // Get the documents in the collection group that match the query.
    const snapshot = await getDocs(q);

    // Map the documents to an array of data objects and return it.
    const data = snapshot.docs.map((doc) => {
      return {
        ...doc.data(),
      };
    });

    return data;
  }


  static subscribeDoc = async (docPath: string, callback: () => any) => {
    if (!this.isDocPath(docPath)) return;
    // Get a reference to the document and subscribe to changes.
    const docRef = doc(this.db, docPath);
    const unsubscribe = onSnapshot(docRef, callback);

    // Return the function to unsubscribe from the Firestore document.
    return unsubscribe;
  }


  static subscribeColGroup = async (colGroupId: string, callback: () => any, ...queryDef: Array<QueryConstraint>) => {
    if (this.pathSegmentCounter(colGroupId) !== 1) return;
    const colGroupRef = collectionGroup(this.db, colGroupId);
    const q = query(colGroupRef, ...queryDef);
    const unsubscribe = onSnapshot(q, callback);
    return unsubscribe;
  };
}
