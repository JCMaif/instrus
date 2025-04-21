import { collection, doc, getDoc, getDocs, addDoc, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from "../config/firebase";

class FirestoreService {
    constructor(collectionName) {
        this.collectionName = collectionName;
        this.collectionRef = collection(db, collectionName);
    }

    // Create a new document
    async create(data) {
        try {
            const docRef = await addDoc(this.collectionRef, data);
            return docRef.id;
        } catch (error) {
            console.error("Error adding document: ", error);
            throw error;
        }
    }

    // Read a document by ID
    async read(id) {
        try {
            const docRef = doc(this.collectionRef, id);
            const docSnap = await getDoc(docRef);
            if (!docSnap.exists()) {
                throw new Error("Document does not exist");
            }
            return docSnap.data();
        } catch (error) {
            console.error("[FirestoreService] Read error:", error);
            throw error;
        }
    }

    // Read all documents
    async readAll() {
        try {
            const querySnapshot = await getDocs(this.collectionRef);
            return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        } catch (error) {
            console.error("Error reading documents: ", error);
            throw error;
        }
    }

    // Update a document by ID
    async update(id, data) {
        try {
            const docRef = doc(this.collectionRef, id);
            await updateDoc(docRef, data);
        } catch (error) {
            console.error("Error updating document: ", error);
            throw error;
        }
    }

    // Delete a document by ID
    async delete(id) {
        try {
            const docRef = doc(this.collectionRef, id);
            await deleteDoc(docRef);
        } catch (error) {
            console.error("Error deleting document: ", error);
            throw error;
        }
    }
}

export default FirestoreService;
