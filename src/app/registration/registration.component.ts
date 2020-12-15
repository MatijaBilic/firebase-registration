import { TitleCasePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import { FirebaseService } from './../firebase.service';
import { User } from './../user';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss']
})
export class RegistrationComponent implements OnInit {

  reg: boolean;
  formHidden: boolean;
  responseHidden: boolean;
  register: FormGroup;
  gdpr: FormGroup;
  regData: User;
  randomizeSymbols: string = "ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890abcdefghijklmnopqrstuvwxyz";

  constructor(
    private http: HttpClient,
    private firestore: AngularFirestore,
    private fb: FormBuilder,
    private title: TitleCasePipe,
    private auth: AngularFireAuth,
    private firebaseService: FirebaseService
  ) {
    this.register = this.fb.group({
      ime: new FormControl('', Validators.required),
      prezime: new FormControl('', Validators.required),
      email: new FormControl('', [
        Validators.required,
        Validators.email
      ]),
      id: new FormControl('', Validators.required)
    });

    this.gdpr = this.fb.group({
      izjava: new FormControl(false),
      popis: new FormControl(false)
    });

  }

  ngOnInit(): void {
    this.reg = false;
    this.formHidden = false;
    this.responseHidden = true;
  }

  regToggle = () => {
    this.reg = !this.reg;

    if (this.responseHidden === false) {
      this.responseHidden = !this.responseHidden;
      this.formHidden = false;
    }
  }

  returnState = (valid: boolean) => {
    //  console.log(this.gdpr.value)
    let state: boolean;
    if (this.gdpr.value['izjava'] && valid) {
      state = true;
    }
    else {
      state = false;
    }

    return state;
  }

  setModal = () => {
    let show = this.reg ? 'flex' : 'none';
    return show;
  }


  randomize = (lengthOfCode: number, possible: string) => {
    let text = "";
    for (let i = 0; i < lengthOfCode; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
  }


  onSubmit = () => {

    this.regData = this.register.value;


    this.regData['ime'] = this.title.transform(this.register.value['ime']);
    this.regData['prezime'] = this.title.transform(this.register.value['prezime']);
    this.regData['email'] = this.register.value['email'].toLowerCase();
    this.regData['hash'] = this.randomize(12, this.randomizeSymbols);
    this.regData['link'] = `localhost:4200/project/user_${this.regData['hash']}`;


    if (this.gdpr.value['popis'] === true) {
      let data = this.regData;
      data['datumRegistracije'] = new Date();
      //  console.log(data)

      this.firebaseService.addToMailingList(data)
    }

    if (this.register.valid) { this.formHidden = true; }

    this.auth.createUserWithEmailAndPassword(this.regData['email'], this.regData['hash']).then(snapshot => {
      snapshot.user.getIdToken().then(data => {
        this.regData['token'] = data;
      })
        .catch(err=>console.log(err));
      
    })
      .catch(err => console.log(err))


    return new Promise<any>((resolve, reject) => {
        this.firebaseService.addRegistration(this.regData)
          .then(
            res => {
              this.register.reset();
              this.responseHidden = false;
             },
            err => reject(err)
          )
      })
    }


  

}
