import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'rinha-json-list',
  templateUrl: './json-list.component.html',
  styleUrls: ['./json-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class JsonListComponent {
  @Input() jsonData!: any[];

}
