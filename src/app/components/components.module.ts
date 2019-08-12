import { NgModule } from '@angular/core';
import { ContentDrawerComponent } from './content-drawer/content-drawer.component';
import { MenuComponent } from './menu/menu.component';

@NgModule({
    declarations: [ContentDrawerComponent],
    exports: [ContentDrawerComponent]
})

export class ComponentsModule { }