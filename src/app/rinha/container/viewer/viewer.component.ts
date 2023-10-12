import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { JsonServiceService } from '../../services/json-service.service';

@Component({
  selector: 'rinha-viewer',
  templateUrl: './viewer.component.html',
  styleUrls: ['./viewer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ViewerComponent {

  private route = inject(ActivatedRoute);
  private titleService = inject(Title);
  private jsonService = inject(JsonServiceService);
  public fileName = this.route.snapshot.params['fileName'];
  public jsonData: any[] = [];


  constructor() {
    this.route.params.subscribe(params => {
      const fileName = params['fileName'];
      this.titleService.setTitle(`Rinha de FrontEnd - showing up the file ${fileName}`);
    });

    this.jsonService.jsonData$.subscribe({
      next: (data) => {
        this.jsonData = data;
      }
    });
  }
}
