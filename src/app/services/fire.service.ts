import { Injectable } from '@angular/core';
import {AngularFirestore} from "@angular/fire/compat/firestore";
import { getDatabase, ref, push, set } from "firebase/database";
import {child, get} from "@angular/fire/database";
import {environment} from "../../environments/environment.prod";
import {Subject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class FireService {
  public collectionData$ = new Subject<any>;
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

  onGetCollection(collection: string): any {
    if (environment.firebase.source === 'fb') {
      this.afs.collection(collection).valueChanges().subscribe(resp => {
        this.collectionData$.next(resp);
      });
    } else if (environment.firebase.source === 'db') {
      const dbRef = ref(getDatabase());
      return get(child(dbRef, collection)).then((snapshot) => {
        if (snapshot.exists()) {
          this.collectionData$.next(snapshot.val())
        } else {
          console.log("No data available");
        }
      }).catch((error) => {
        console.error(error);
      });
    }
  }

  getDoc(collection: string, id: string) {
    this.afs.collection(collection, ref => ref.where('id', '==', id)).valueChanges();
  }

  // from real data base //TODO: in future delete
  getCollection() {

  }

}