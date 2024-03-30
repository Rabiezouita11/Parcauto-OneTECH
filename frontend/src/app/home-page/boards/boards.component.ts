import {Component, OnInit} from '@angular/core';
import {BoardData} from "../../interfaces/board-data";
import {FormControl, FormGroup} from "@angular/forms";
import {MatDialog} from "@angular/material/dialog";
import {NewBoardDialogComponent} from "./new-board-dialog/new-board-dialog.component";

@Component({
  selector: 'app-boards',
  templateUrl: './boards.component.html',
  styleUrls: ['./boards.component.scss']
})
export class BoardsComponent implements OnInit {
  initialListBoards: BoardData[] = [
    {
      id: '1',
     
      name: 'HYUNDAI GRAND i10',
      dateCreation: new Date('2024-08-10'),
      visibility: 'Public'
    },
    {
      id: '2',
      name: 'TOYOTA AGYA',
      dateCreation: new Date('2024-08-05'),
      visibility: 'Public'
    },
    {
      id: '3',
      name: 'KIA PICANTO',
      dateCreation: new Date('2024-07-30'),
      visibility: 'Public'
    },
    {
      id: '4',
      name: 'RENAULT KWID',
      dateCreation: new Date('2024-07-20'),
      visibility: 'Public'
    },
    {
      id: '5',
      name: 'PEUGEOT 208',
      dateCreation: new Date('2024-07-10'),
      visibility: 'Public'
    },
    {
      id: '6',
      name: 'SUSUKI CELERIO',
      dateCreation: new Date('2024-06-30'),
      visibility: 'Public'
    },
    {
      id: '7',
      name: 'CJERY QQ',
      dateCreation: new Date('2024-06-20'),
      visibility: 'Public'
    },
    {
      id: '8',
      name: 'SEAT IBIZA',
      dateCreation: new Date('2024-06-10'),
      visibility: 'Public'
    },
    {
      id: '9',
      name: 'RENAULT CLIO 4',
      dateCreation: new Date('2024-05-30'),
      visibility: 'Public'
    },
    {
      id: '10',
      name: 'SKODA FABIA',
      dateCreation: new Date('2024-05-20'),
      visibility: 'Public'
    },
    {
      id: '11',
      name: 'HYANDAI GRAND I10',
      dateCreation: new Date('2024-05-10'),
      visibility: 'Public'
    },
    {
      id: '12',
      name: 'HYANDAI GRAND I20',
      dateCreation: new Date('2024-04-30'),
      visibility: 'Public'
    },
    {
      id: '13',
      name: 'RENAULT CLIO 4',
      dateCreation: new Date('2024-04-20'),
      visibility: 'Public'
    },
    {
      id: '14',
      name: 'PEUGOT 208',
      dateCreation: new Date('2024-04-10'),
      visibility: 'Public'
    },
    {
      id: '15',
      name: 'SEAT LION',
      dateCreation: new Date('2024-03-30'),
      visibility: 'Public'
    },
    {
      id: '16',
      name: 'KIA PICANTO',
      dateCreation: new Date('2024-03-20'),
      visibility: 'Public'
    },
    {
      id: '17',
      name: 'CHERY QQ',
      dateCreation: new Date('2024-03-10'),
      visibility: 'Public'
    },
    {
      id: '18',
      name: 'TOYOTA YARIS',
      dateCreation: new Date('2024-02-28'),
      visibility: 'Public'
    },
    {
      id: '19',
      name: 'CITRON C3',
      dateCreation: new Date('2024-02-20'),
      visibility: 'Public'
    }
  ];
  listBoards: BoardData[] = [];
  boardForm = new FormGroup({
    search: new FormControl(''),
    select: new FormControl(''),
  });

  constructor(public dialog: MatDialog) {
    this.listBoards = this.initialListBoards;
  }

  ngOnInit(): void {
    this.boardForm.controls['select'].valueChanges.subscribe(value => {
      this.selectSwitch(value);
    });
    this.boardForm.controls['search'].valueChanges.subscribe(value => {
      if (value === "") {
        this.listBoards = this.initialListBoards;
        this.selectSwitch(this.boardForm.value.select);
      } else {
        this.listBoards = this.initialListBoards.filter(board => board.name.toLowerCase().includes(value.toLowerCase()));
      }
    });
    this.boardForm.controls['select'].patchValue("Ascending Alphabetically");
  }


  selectSwitch(value: string) {
    switch (value) {
      case "Latest Activity":
        this.listBoards = this.listBoards.sort((a, b) => b.dateCreation.getTime() - a.dateCreation.getTime());
        break;
      case "Oldest Activity":
        this.listBoards = this.listBoards.sort((a, b) => a.dateCreation.getTime() - b.dateCreation.getTime());
        break;
      case "Ascending Alphabetically":
        this.listBoards = this.listBoards.sort((a, b) => a.name.localeCompare(b.name));
        break;
      default:
        this.listBoards = this.listBoards.sort((a, b) => b.name.localeCompare(a.name));
    }
  }

  openNewBoardDialog(): void {
    this.dialog.open(NewBoardDialogComponent, {
      disableClose: true,
      width: '800px',
      height: '300px'
    });
  }

}
