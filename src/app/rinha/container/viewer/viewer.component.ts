import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, inject } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { JsonServiceService } from '../../services/json-service.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'rinha-viewer',
  templateUrl: './viewer.component.html',
  styleUrls: ['./viewer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ViewerComponent implements OnDestroy, OnInit {

  private route = inject(ActivatedRoute);
  private titleService = inject(Title);
  private jsonService = inject(JsonServiceService);
  public fileName = this.route.snapshot.params['fileName'];
  public jsonData: any[] = [];
  private ngDestroyed$ = new Subject();

  constructor() {
    this.route.params.subscribe(params => {
      const fileName = params['fileName'];
      this.titleService.setTitle(`Rinha de FrontEnd - showing up the file ${fileName}`);
    });
  }

  ngOnInit(): void {
    this.jsonService.jsonData$
      .pipe(
        takeUntil(this.ngDestroyed$)
      )
      .subscribe({
        next: (data) => {
          this.jsonData = data;
        }
      });
  }

  public ngOnDestroy(): void {
    this.ngDestroyed$.next(true);
    this.ngDestroyed$.complete();
    this.jsonData = [];
  }
}
