import { Component, OnInit } from '@angular/core';
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
    private router: Router
  ) { }

  ngOnInit(): void {
    this.hash = location.pathname.substring(location.pathname.lastIndexOf('/user_') + 6, location.pathname.length);
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
  }

}
