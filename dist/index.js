"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Firestore = void 0;
const firestore_1 = require("firebase/firestore");
const app_1 = require("firebase/app");
const config_1 = require("./config");
class Firestore {
    // initialize firebase config
    static get db() {
        return (0, firestore_1.getFirestore)((0, app_1.initializeApp)(config_1.FIRESTORE_CONFIG));
    }
}
exports.Firestore = Firestore;
_a = Firestore;
Firestore.pathSegmentCounter = (path) => {
    var _b;
    const segmentCount = ((_b = path.match(new RegExp(String.raw `(?<segment>[^/]+)`, "gi"))) !== null && _b !== void 0 ? _b : []).length;
    return segmentCount;
};
Firestore.isColPath = (path) => {
    const pathSegmentCount = _a.pathSegmentCounter(path);
    if (pathSegmentCount === 0)
        return false;
    return pathSegmentCount % 2 === 1;
};
Firestore.isDocPath = (path) => {
    const pathSegmentCount = _a.pathSegmentCounter(path);
    if (pathSegmentCount === 0)
        return false;
    return pathSegmentCount % 2 === 0;
};
Firestore.createDoc = (path, data) => __awaiter(void 0, void 0, void 0, function* () {
    switch (true) {
        case _a.isDocPath(path): {
            const docRef = (0, firestore_1.doc)(_a.db, path);
            const doc_id = docRef.id;
            // Set the data for the document, including the doc_id and timestamps.
            const response = yield (0, firestore_1.setDoc)(docRef, Object.assign(Object.assign({}, data), { doc_id, date_created: (0, firestore_1.serverTimestamp)(), date_updated: (0, firestore_1.serverTimestamp)() }));
            return response;
        }
        case _a.isColPath(path): {
            const colRef = (0, firestore_1.collection)(_a.db, path);
            const docRef = (0, firestore_1.doc)(colRef);
            const doc_id = docRef.id;
            // Set the data for the document, including the doc_id and timestamps.
            const response = yield (0, firestore_1.setDoc)(docRef, Object.assign(Object.assign({}, data), { doc_id, date_created: (0, firestore_1.serverTimestamp)(), date_updated: (0, firestore_1.serverTimestamp)() }));
            return response;
        }
    }
});
Firestore.readDoc = (docPath) => __awaiter(void 0, void 0, void 0, function* () {
    if (!_a.isDocPath(docPath))
        return;
    // Get a reference to the document.
    const docRef = (0, firestore_1.doc)(_a.db, docPath);
    // Get the document data.
    const response = yield (0, firestore_1.getDoc)(docRef);
    const data = response.data();
    return data;
});
Firestore.updateDoc = (docPath, data) => __awaiter(void 0, void 0, void 0, function* () {
    if (!_a.isDocPath(docPath))
        return;
    // Get a reference to the document and update it with the given data.
    const docRef = (0, firestore_1.doc)(_a.db, docPath);
    const response = yield (0, firestore_1.updateDoc)(docRef, Object.assign(Object.assign({}, data), { date_updated: (0, firestore_1.serverTimestamp)() }));
    // Return the Firestore response object.
    return response;
});
Firestore.deleteDoc = (docPath) => __awaiter(void 0, void 0, void 0, function* () {
    if (!_a.isDocPath(docPath))
        return;
    // Get a reference to the document and delete it.
    const docRef = (0, firestore_1.doc)(_a.db, docPath);
    const response = yield (0, firestore_1.deleteDoc)(docRef);
    // Return the Firestore response object.
    return response;
});
Firestore.readCol = (colPath, ...queryDef) => __awaiter(void 0, void 0, void 0, function* () {
    if (!_a.isColPath(colPath))
        return;
    // Get a reference to the collection and apply the query definition.
    const colRef = (0, firestore_1.collection)(_a.db, colPath);
    const q = (0, firestore_1.query)(colRef, ...queryDef);
    // Get the documents in the collection that match the query.
    const snapshot = yield (0, firestore_1.getDocs)(q);
    // Map the documents to an array of data objects and return it.
    const data = snapshot.docs.map((doc) => {
        return Object.assign({}, doc.data());
    });
    return data;
});
Firestore.readColGroup = (colGroupId, ...queryDef) => __awaiter(void 0, void 0, void 0, function* () {
    if (_a.pathSegmentCounter(colGroupId) !== 1)
        return;
    // Get a reference to the collection group and apply the query definition.
    const colGroupRef = (0, firestore_1.collectionGroup)(_a.db, colGroupId);
    const q = (0, firestore_1.query)(colGroupRef, ...queryDef);
    // Get the documents in the collection group that match the query.
    const snapshot = yield (0, firestore_1.getDocs)(q);
    // Map the documents to an array of data objects and return it.
    const data = snapshot.docs.map((doc) => {
        return Object.assign({}, doc.data());
    });
    return data;
});
Firestore.subscribeDoc = (docPath, callback) => __awaiter(void 0, void 0, void 0, function* () {
    if (!_a.isDocPath(docPath))
        return;
    // Get a reference to the document and subscribe to changes.
    const docRef = (0, firestore_1.doc)(_a.db, docPath);
    const unsubscribe = (0, firestore_1.onSnapshot)(docRef, callback);
    // Return the function to unsubscribe from the Firestore document.
    return unsubscribe;
});
Firestore.subscribeColGroup = (colGroupId, callback, ...queryDef) => __awaiter(void 0, void 0, void 0, function* () {
    if (_a.pathSegmentCounter(colGroupId) !== 1)
        return;
    const colGroupRef = (0, firestore_1.collectionGroup)(_a.db, colGroupId);
    const q = (0, firestore_1.query)(colGroupRef, ...queryDef);
    const unsubscribe = (0, firestore_1.onSnapshot)(q, callback);
    return unsubscribe;
});
