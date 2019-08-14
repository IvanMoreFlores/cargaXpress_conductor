import { Component } from '@angular/core';
import { Platform, MenuController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { BackgroundMode } from '@ionic-native/background-mode/ngx';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private backgroundMode: BackgroundMode
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.backgroundMode.setDefaults({ title: 'Información', text: 'CargaXpress se esta ejecuntando', color: '000000', });
      this.backgroundMode.enable();
      this.backgroundMode.on('activate').subscribe(() => {
        this.backgroundMode.disableWebViewOptimizations();
      });
      this.statusBar.styleLightContent();
      this.hideSplashScreen();
      // this.menu.swipeGesture(false, 'custom');
    });
  }

  hideSplashScreen() {
    if (this.splashScreen) {
      setTimeout(() => {
        this.splashScreen.hide();
      }, 3000);
    }
  }
}
