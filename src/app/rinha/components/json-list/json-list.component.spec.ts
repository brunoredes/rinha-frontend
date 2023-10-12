import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JsonListComponent } from './json-list.component';

describe('JsonListComponent', () => {
  let component: JsonListComponent;
  let fixture: ComponentFixture<JsonListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [JsonListComponent]
    });
    fixture = TestBed.createComponent(JsonListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
