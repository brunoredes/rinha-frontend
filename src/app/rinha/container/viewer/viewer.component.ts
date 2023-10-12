import { Component, inject } from '@angular/core';
import { JsonServiceService } from '../../services/json-service.service';
import { ActivatedRoute } from '@angular/router';
import { switchMap } from 'rxjs';
import { Title } from '@angular/platform-browser';
export type Actor = { name: string; age: number; 'Born At': number; Birthdate: number; photo: string; wife: null; weight: number; hasChildren: boolean; hasGreyHair: boolean; children: string[]; }
@Component({
  selector: 'rinha-viewer',
  templateUrl: './viewer.component.html',
  styleUrls: ['./viewer.component.scss']
})
export class ViewerComponent {
  private route = inject(ActivatedRoute);
  private titleService = inject(Title);

  public fileName = this.route.snapshot.params['fileName'];

  constructor() {
    this.route.params.subscribe(params => {
      const fileName = params['fileName'];
      this.titleService.setTitle(`Rinha de frontEnd - visualizando o arquivo ${fileName}`);
    });
  }
}
