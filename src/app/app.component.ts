import { Component, VERSION } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { LoadingComponent } from './shared/loading/loading.component';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
    imports: [RouterLink, RouterLinkActive, RouterOutlet, LoadingComponent]
})
export class AppComponent {
  version = VERSION.full;
}
