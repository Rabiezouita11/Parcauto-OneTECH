import {Component, Input} from '@angular/core';
import {CardData} from "../../../../interfaces/card-data";

@Component({
  selector: 'app-card-box',
  templateUrl: './card-box.component.html',
  styleUrls: ['./card-box.component.scss']
})
export class CardBoxComponent {
  @Input() card: CardData = {activity: "", description: "", endDate: new Date(), name: "", startDate: new Date()};
  displayDeleteButton: boolean = false;

  constructor() {
  }


  handleDisplayingDeleteButton(state: boolean) {
    this.displayDeleteButton = state;
  }

}
