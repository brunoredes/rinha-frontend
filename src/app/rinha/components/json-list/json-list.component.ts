import { ChangeDetectionStrategy, Component, Input, inject } from '@angular/core';
import { Actor } from '../../container/viewer/viewer.component';
import { JsonServiceService } from '../../services/json-service.service';

@Component({
  selector: 'rinha-json-list',
  templateUrl: './json-list.component.html',
  styleUrls: ['./json-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class JsonListComponent {
  @Input() json!: JSON;
  private service = inject(JsonServiceService);
  jsonParts: any[] = [];
  private reader?: ReadableStreamReader<any>;

  ngOnInit() {

  }

  ngOnDestroy() {
    this.reader?.cancel();
  }

  
}
