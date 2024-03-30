import {Component, Input} from '@angular/core';
import {ListData} from "../../../../interfaces/list-data";

@Component({
  selector: 'app-list-box',
  templateUrl: './list-box.component.html',
  styleUrls: ['./list-box.component.scss']
})
export class ListBoxComponent {

  @Input() list: ListData = {name: "", cards: []};


  constructor() {
  }





}
