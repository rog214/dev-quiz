import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-carregando',
  standalone: true,
  templateUrl: './carregando.component.html',
  styleUrls: ['./carregando.component.scss']
})
export class CarregandoComponent {
  private router = inject(Router);

  voltar() {
    this.router.navigate(['/']);
  }
}
