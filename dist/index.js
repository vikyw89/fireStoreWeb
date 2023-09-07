var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var _a;
import { collection, collectionGroup, deleteDoc, doc, getDoc, getDocs, getFirestore, onSnapshot, query, serverTimestamp, setDoc, updateDoc, } from "firebase/firestore";
import { initializeApp } from "firebase/app";
import { FIRESTORE_CONFIG } from "./config.js";
export class FirestoreWeb {
    // initialize firebase config
    static get db() {
        return getFirestore(initializeApp(FIRESTORE_CONFIG));
    }
}
_a = FirestoreWeb;
FirestoreWeb.pathSegmentCounter = (path) => {
    var _b;
    const segmentCount = ((_b = path.match(new RegExp(String.raw `(?<segment>[^/]+)`, "gi"))) !== null && _b !== void 0 ? _b : []).length;
    return segmentCount;
};
FirestoreWeb.isColPath = (path) => {
    const pathSegmentCount = _a.pathSegmentCounter(path);
    if (pathSegmentCount === 0)
        return false;
    return pathSegmentCount % 2 === 1;
};
FirestoreWeb.isDocPath = (path) => {
    const pathSegmentCount = _a.pathSegmentCounter(path);
    if (pathSegmentCount === 0)
        return false;
    return pathSegmentCount % 2 === 0;
};
FirestoreWeb.createDoc = (path, data) => __awaiter(void 0, void 0, void 0, function* () {
    switch (true) {
        case _a.isDocPath(path): {
            const docRef = doc(_a.db, path);
            const doc_id = docRef.id;
            // Set the data for the document, including the doc_id and timestamps.
            const response = yield setDoc(docRef, Object.assign(Object.assign({}, data), { doc_id, date_created: serverTimestamp(), date_updated: serverTimestamp() }));
            return response;
        }
        case _a.isColPath(path): {
            const colRef = collection(_a.db, path);
            const docRef = doc(colRef);
            const doc_id = docRef.id;
            // Set the data for the document, including the doc_id and timestamps.
            const response = yield setDoc(docRef, Object.assign(Object.assign({}, data), { doc_id, date_created: serverTimestamp(), date_updated: serverTimestamp() }));
            return response;
        }
    }
});
FirestoreWeb.readDoc = (docPath) => __awaiter(void 0, void 0, void 0, function* () {
    if (!_a.isDocPath(docPath))
        return;
    // Get a reference to the document.
    const docRef = doc(_a.db, docPath);
    // Get the document data.
    const response = yield getDoc(docRef);
    const data = response.data();
    return data;
});
FirestoreWeb.updateDoc = (docPath, data) => __awaiter(void 0, void 0, void 0, function* () {
    if (!_a.isDocPath(docPath))
        return;
    // Get a reference to the document and update it with the given data.
    const docRef = doc(_a.db, docPath);
    const response = yield updateDoc(docRef, Object.assign(Object.assign({}, data), { date_updated: serverTimestamp() }));
    // Return the Firestore response object.
    return response;
});
FirestoreWeb.deleteDoc = (docPath) => __awaiter(void 0, void 0, void 0, function* () {
    if (!_a.isDocPath(docPath))
        return;
    // Get a reference to the document and delete it.
    const docRef = doc(_a.db, docPath);
    const response = yield deleteDoc(docRef);
    // Return the Firestore response object.
    return response;
});
FirestoreWeb.readCol = (colPath, ...queryDef) => __awaiter(void 0, void 0, void 0, function* () {
    if (!_a.isColPath(colPath))
        return;
    // Get a reference to the collection and apply the query definition.
    const colRef = collection(_a.db, colPath);
    const q = query(colRef, ...queryDef);
    // Get the documents in the collection that match the query.
    const snapshot = yield getDocs(q);
    // Map the documents to an array of data objects and return it.
    const data = snapshot.docs.map((doc) => {
        return Object.assign({}, doc.data());
    });
    return data;
});
FirestoreWeb.readColGroup = (colGroupId, ...queryDef) => __awaiter(void 0, void 0, void 0, function* () {
    if (_a.pathSegmentCounter(colGroupId) !== 1)
        return;
    // Get a reference to the collection group and apply the query definition.
    const colGroupRef = collectionGroup(_a.db, colGroupId);
    const q = query(colGroupRef, ...queryDef);
    // Get the documents in the collection group that match the query.
    const snapshot = yield getDocs(q);
    // Map the documents to an array of data objects and return it.
    const data = snapshot.docs.map((doc) => {
        return Object.assign({}, doc.data());
    });
    return data;
});
FirestoreWeb.subscribeDoc = (docPath, callback) => __awaiter(void 0, void 0, void 0, function* () {
    if (!_a.isDocPath(docPath))
        return;
    // Get a reference to the document and subscribe to changes.
    const docRef = doc(_a.db, docPath);
    const unsubscribe = onSnapshot(docRef, callback);
    // Return the function to unsubscribe from the Firestore document.
    return unsubscribe;
});
FirestoreWeb.subscribeColGroup = (colGroupId, callback, ...queryDef) => __awaiter(void 0, void 0, void 0, function* () {
    if (_a.pathSegmentCounter(colGroupId) !== 1)
        return;
    const colGroupRef = collectionGroup(_a.db, colGroupId);
    const q = query(colGroupRef, ...queryDef);
    const unsubscribe = onSnapshot(q, callback);
    return unsubscribe;
});
//# sourceMappingURL=index.js.map