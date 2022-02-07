import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
/* import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map'; */

@Injectable({
  providedIn: 'root'
})
export class AngularFireStoreService {

  constructor(private afs: AngularFirestore) {

  }
  getCollection(collection) {
    let observable = new Observable(observer => {
      this.afs.collection(collection).valueChanges().subscribe(data => {
        observer.next(data);
      }, e => {
        console.log(e);
        observer.next({error: 1});
      });
    });
    return observable;
  }
  getWhere(collection, field, value) {
    let observable = new Observable(observer => {
      this.afs.collection(collection, query => query.where(field, '==', value)).valueChanges().subscribe(data => {
        observer.next({ error: 0, data: data });
      }, e => {
        console.log("e", e);
        observer.next({error: 1});
      });
    });
    return observable;
  }
  getData(collection, field, value) {
    return new Promise(resolve => {
      this.afs.collection(collection, query => query.where(field, '==', value)).valueChanges().subscribe(data => {
        if (data.length > 0) {
          resolve({ error: 0, data: data });
        } else {
          resolve({ error: 1, data: data });
        }
      }, e => {
        resolve({ error: 1, message: e });
      });
    });
  }
  setData(collection, data, id?) {
    return new Promise(resolve => {
      this.afs.collection(collection).doc(id).set(data).then(data => {
        resolve({ error: 0, data: data });
      }).catch(e => {
        resolve({ error: 1, message: e });
      });
    });
  }
  removeData(collection, id) {
    return new Promise(resolve => {
      this.afs.collection(collection).doc(id).delete().then(data => {
        resolve({ error: 0, data: data });
      }).catch(e => {
        console.log("e", e);
        resolve({ error: 1, data: e });
      });
    });
  }
  generateId() {
    return new Promise(resolve => {
      let id = this.afs.createId();
      if (id) {
        resolve({ error: 0, data: id });
      } else {
        resolve({ error: 1, message: 'Could not generate ID' });
      }
    });
  }
}
