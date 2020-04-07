import { Component, OnInit, Output, EventEmitter } from '@angular/core';


@Component({
  selector: 'app-rightbar',
  templateUrl: './rightbar.component.html',
  styleUrls: ['./rightbar.component.css']
})
export class RightbarComponent implements OnInit {

  // output event emitter to take screen shot
  @Output() takeScreenShot = new EventEmitter<object>();

  @Output() addDefectDraw = new EventEmitter<boolean>();

  @Output() moveRightActionButtons = new EventEmitter<boolean>();

  // var to store layout and component hide and show status
  rightLayout: Object = {
    show: false,
    defectWizardShow: false,
    imageListShow: false,
    filterLayout: false
  }

  layoutToggle: Object = {
    rightShow: false
  }

  // toggle layout
  toggleLayout: Boolean = false;

  constructor(
   
  ) { }

  ngOnInit() {

  }

 

  moveRightActionBtn(event) {
    this.moveRightActionButtons.emit(event)
  }
}
