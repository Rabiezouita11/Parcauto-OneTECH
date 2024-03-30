import {AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnInit} from '@angular/core';
import {MatDialog} from "@angular/material/dialog";
import {CreateWorkspaceDialogComponent} from "./create-workspace-dialog/create-workspace-dialog.component";


// @ts-ignore
@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss']
})
export class HomePageComponent implements OnInit, AfterViewInit {
  sidenavHeight: number = 0;

  constructor(private elementRef: ElementRef, private cdr: ChangeDetectorRef, public dialog: MatDialog) {
  }

  ngOnInit(): void {
  }

  toggleFullscreen() {
    const doc = window.document;
    const docEl = doc.documentElement;
    const requestFullScreen = docEl.requestFullscreen;
    const exitFullScreen = doc.exitFullscreen;
    if (!doc.fullscreenElement) {
      if (requestFullScreen) {
        requestFullScreen.call(docEl);
      }
    } else {
      if (exitFullScreen) {
        exitFullScreen.call(doc);
      }
    }
  }

  ngAfterViewInit(): void {
    this.cdr.detectChanges();
    this.sidenavHeight = window.innerHeight - 180;
    this.cdr.detectChanges();
  }

  openCreateWorkspaceDialog(): void {
    this.dialog.open(CreateWorkspaceDialogComponent, {
      disableClose: true,
      width: '800px',
      height: '505px'
    });
  }


}
