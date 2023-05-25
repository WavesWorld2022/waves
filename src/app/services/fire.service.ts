import { Injectable } from '@angular/core';
import {AngularFirestore} from "@angular/fire/compat/firestore";
import { getDatabase, ref, push, set } from "firebase/database";
import {child, get} from "@angular/fire/database";
import {environment} from "../../environments/environment.prod";
import {combineLatest, Subject} from "rxjs";
import {waveLocations} from "../../assets/json/wave-locations";
import {manufacturer} from "../../assets/json/manufacturer";
import {productionMethod} from "../../assets/json/production-method";
import {products} from "../../assets/json/products";

@Injectable({
  providedIn: 'root'
})
export class FireService {
  public collectionData$ = new Subject<any>;
  public collectionSecondData$ = new Subject<any>;
  public collectionThirdData$ = new Subject<any>;
  constructor(
    private afs: AngularFirestore,
  ) {}

  upload(arr: any[], collection: string) {
    arr.forEach(product => {
      setTimeout(() => {
        this.afs
          .collection(collection)
          .doc(String(product['waveProductionMethodKey']))
          .set(product)
          .then(() => {
            console.log(product['waveProductionMethodKey'])
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
    } else if (environment.firebase.source === 'json') {
      switch (collection) {
        case 'locations': {
          setTimeout(() => {
            this.collectionData$.next(waveLocations);
          }, 500);
          break;
        }
        case 'manufacturer': {
          setTimeout(() => {
            this.collectionData$.next(manufacturer);
          }, 500);
          break;
        }
        case 'production-methods': {
          setTimeout(() => {
            this.collectionData$.next(productionMethod);
          }, 500);
          break;
        }
        case 'products': {
          setTimeout(() => {
            this.collectionData$.next(products);
          }, 500);
          break;
        }
      }
    }
  }

  onGetSecondCollection(collection: string): any {
    if (environment.firebase.source === 'fb') {
      this.afs.collection(collection).valueChanges().subscribe(resp => {
        this.collectionSecondData$.next(resp);
      });
    } else if (environment.firebase.source === 'db') {
      const dbRef = ref(getDatabase());
      return get(child(dbRef, collection)).then((snapshot) => {
        if (snapshot.exists()) {
          this.collectionSecondData$.next(snapshot.val())
        } else {
          console.log("No data available");
        }
      }).catch((error) => {
        console.error(error);
      });
    } else if (environment.firebase.source === 'json') {
      switch (collection) {
        case 'locations': {
          setTimeout(() => {
            this.collectionSecondData$.next(waveLocations);
          }, 500);
          break;
        }
        case 'manufacturer': {
          setTimeout(() => {
            this.collectionSecondData$.next(manufacturer);
          }, 500);
          break;
        }
        case 'production-methods': {
          setTimeout(() => {
            this.collectionSecondData$.next(productionMethod);
          }, 500);
          break;
        }
        case 'products': {
          setTimeout(() => {
            this.collectionSecondData$.next(products);
          }, 500);
          break;
        }
      }
    }
  }

  onGetThirdCollection(collection: string): any {
    if (environment.firebase.source === 'fb') {
      this.afs.collection(collection).valueChanges().subscribe(resp => {
        this.collectionThirdData$.next(resp);
      });
    } else if (environment.firebase.source === 'db') {
      const dbRef = ref(getDatabase());
      return get(child(dbRef, collection)).then((snapshot) => {
        if (snapshot.exists()) {
          this.collectionThirdData$.next(snapshot.val())
        } else {
          console.log("No data available");
        }
      }).catch((error) => {
        console.error(error);
      });
    } else if (environment.firebase.source === 'json') {
      switch (collection) {
        case 'locations': {
          setTimeout(() => {
            this.collectionThirdData$.next(waveLocations);
          }, 500);
          break;
        }
        case 'manufacturer': {
          setTimeout(() => {
            this.collectionThirdData$.next(manufacturer);
          }, 500);
          break;
        }
        case 'production-methods': {
          setTimeout(() => {
            this.collectionThirdData$.next(productionMethod);
          }, 500);
          break;
        }
        case 'products': {
          setTimeout(() => {
            this.collectionThirdData$.next(products);
          }, 500);
          break;
        }
      }
    }
  }

  getSupportCollections(collections: string[]) {
    const dbRef = ref(getDatabase());
    const first = get(child(dbRef, collections[0]));
    const second = get(child(dbRef, collections[1]));
    const third = get(child(dbRef, collections[2]));

    return combineLatest([first, second, third]);
  }

  getDoc(collection: string, id: string) {
    this.afs.collection(collection, ref => ref.where('id', '==', id)).valueChanges();
  }

  // from real data base //TODO: in future delete
  getCollection() {

  }

}
