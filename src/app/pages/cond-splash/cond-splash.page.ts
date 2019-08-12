import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { StorageService } from './../../services/storage/storage.service';

@Component({
  selector: 'app-cond-splash',
  templateUrl: './cond-splash.page.html',
  styleUrls: ['./cond-splash.page.scss'],
})
export class CondSplashPage implements OnInit {

  user: String = '';
  messages: any[] = [];
  subscription: Subscription;
  constructor(private router: Router,
    private NvCrl: NavController,
    public _login: StorageService) {
    // this.subscription = this._login.getMessage().subscribe(message => {
    //   this.user = message.text;
    // });
  }

  ngOnInit() {
    if (localStorage.getItem('profile')) {
      this.router.navigate(['/cond-tabs/Home']);
    } else {
      this.NvCrl.navigateRoot('/cond-login');
    }
  }

  ionViewDidEnter() {
    // your code;
    this.ngOnInit();
  }

}
