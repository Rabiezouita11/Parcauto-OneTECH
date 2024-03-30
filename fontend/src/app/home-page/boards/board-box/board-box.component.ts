import {Component, Input} from '@angular/core';
import {BoardData} from "../../../interfaces/board-data";
import {MatDialog} from "@angular/material/dialog";
import {ModifyBoardDialogComponent} from "../modify-board-dialog/modify-board-dialog.component";
import {DeleteBoardDialogComponent} from "../delete-board-dialog/delete-board-dialog.component";
import {Router} from "@angular/router";

@Component({
  selector: 'app-board-box',
  templateUrl: './board-box.component.html',
  styleUrls: ['./board-box.component.scss']
})
export class BoardBoxComponent {

  @Input() boardData: BoardData = {dateCreation: new Date(), id: "", name: "", visibility: ""};

  constructor(public dialog: MatDialog, private router: Router) {
  }

  modifySelectedBoard(event: Event, boardData: BoardData) {
    event.preventDefault();
    this.dialog.open(ModifyBoardDialogComponent, {
      disableClose: true,
      width: '800px',
      height: '300px',
      data: boardData
    });
  }

  deleteSelectedBoard(event: Event, id: string) {
    event.preventDefault();
    this.dialog.open(DeleteBoardDialogComponent, {
      disableClose: false,
      width: '800px',
      height: '150px',
      data: id,
    });
  }


  routeToBoard(id: string) {
    this.router.navigate(['/home/board/' + id]);
  }
}
