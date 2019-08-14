import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument, DocumentReference } from '@angular/fire/firestore';
import { map, take } from 'rxjs/operators';
import { Observable } from 'rxjs';

export interface Tracking {
  id?: string,
  data: string
}

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  private tracking: Observable<Tracking[]>;
  private trackingCollection: AngularFirestoreCollection<Tracking>;
  constructor(
    private afs: AngularFirestore
  ) {


    this.trackingCollection = this.afs.collection<Tracking>('trackings');
    this.tracking = this.trackingCollection.snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          return { id, ...data };
        });
      })
    );
  }

  getTrackings(): Observable<Tracking[]> {
    return this.tracking;
  }

  addTracking(tracking: Tracking) {
    return this.trackingCollection.add(tracking);
  }

  updateTracking(tracking: Tracking, id: string) {
    return this.trackingCollection.doc(id).update(tracking);
  }

  removeTracking(id) {
    return this.trackingCollection.doc(id).delete();
  }
}
