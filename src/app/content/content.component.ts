import { Component, OnInit } from '@angular/core';
import { FirebaseApp } from '@angular/fire';
import { Router } from '@angular/router';
import { FirebaseService } from './../firebase.service';
import { User } from './../user'

@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.scss']
})
export class ContentComponent implements OnInit {
  hash: string;
  user: User;

  constructor(
    private firebase: FirebaseService,
    private router: Router,
    private fire: FirebaseApp
  ) { }

  ngOnInit(): void {
    this.hash = location.pathname.substring(location.pathname.lastIndexOf('/user_') + 6, location.pathname.length);

    this.fetchUser(this.hash)
  }

  fetchUser = (url: string) => {
    this.firebase.getUser(url).then(snap => {
      let data = snap.docs

      if (data.find(el => el.data()['hash'] === url) !== undefined) {
        this.user = <User>data.find(el => el.data()['hash'] === url).data()

      }
      else {
        this.router.navigate(['project/not-found'])
      }
    })
      .catch(err => console.log(err))
  }

  authUser = () => {
    this.fire.auth().signInWithEmailAndPassword(this.user['email'], this.user['hash'])
      .then(snapData => console.log(snapData.user))
      .catch(err => console.log(err))
  }

}
