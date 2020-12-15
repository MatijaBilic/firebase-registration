import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { FirebaseApp } from "@angular/fire";
import { HttpClient } from '@angular/common/http';

const MAIN_COL = 'client'
const LIST_DOCS = 'mailing'
const REG_DOCS = 'users'
const MEMBERS = 'project'

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  constructor(
    public http: HttpClient,
    public afs: AngularFirestore,
    public fire: FirebaseApp
  ) { }

  addRegistration = (data) => {
    return this.fire.firestore()
      .collection(MAIN_COL + '/' + MEMBERS + '/' + REG_DOCS)
      .add(data)
  }

  addToMailingList = (data) => {
    return this.fire.firestore()
      .collection(MAIN_COL + '/' + LIST_DOCS)
      .add(data)
  }

  getUser = (hash: string) => {
    return this.fire.firestore()
      .collection(MAIN_COL + '/' + MEMBERS + '/' + REG_DOCS)
      .where('hash', '==', hash)
      .get()
  }

}
