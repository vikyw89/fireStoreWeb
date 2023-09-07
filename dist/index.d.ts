import { QueryConstraint } from "firebase/firestore";
export declare class FirestoreWeb {
    static get db(): import("@firebase/firestore").Firestore;
    private static pathSegmentCounter;
    private static isColPath;
    private static isDocPath;
    static createDoc: (path: string, data: any) => Promise<any>;
    static readDoc: (docPath: string) => Promise<any>;
    static updateDoc: (docPath: string, data: any) => Promise<any>;
    static deleteDoc: (docPath: string) => Promise<void>;
    static readCol: (colPath: string, ...queryDef: Array<QueryConstraint>) => Promise<{
        [x: string]: any;
    }[] | undefined>;
    static readColGroup: (colGroupId: string, ...queryDef: Array<QueryConstraint>) => Promise<{
        [x: string]: any;
    }[] | undefined>;
    static subscribeDoc: (docPath: string, callback: () => any) => Promise<import("@firebase/firestore").Unsubscribe | undefined>;
    static subscribeColGroup: (colGroupId: string, callback: () => any, ...queryDef: Array<QueryConstraint>) => Promise<import("@firebase/firestore").Unsubscribe | undefined>;
}
