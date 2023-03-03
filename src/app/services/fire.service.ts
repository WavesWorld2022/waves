import { Injectable } from '@angular/core';
import {AngularFirestore} from "@angular/fire/compat/firestore";

@Injectable({
  providedIn: 'root'
})
export class FireService {
  constructor(
    private afs: AngularFirestore,
  ) {}

  upload(arr: [], collection: string) {
    [].forEach(product => {
      setTimeout(() => {
        this.afs
          .collection(collection)
          .doc(String(product['id']))
          .set(product)
          .then(() => {
            console.log(product['id'])
          });
      }, 100);
    });
  }

  onGetCollection(collection: string) {
    return this.afs.collection(collection).valueChanges();
  }

  getDoc(collection: string, id: string) {
    this.afs.collection(collection, ref => ref.where('id', '==', id)).valueChanges();
  }
}
