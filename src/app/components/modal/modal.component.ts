import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.scss'
})
export class ModalComponent {

  @Input() isOpen: boolean = false; // Modal visibility flag
  @Output() closeModal: EventEmitter<void> = new EventEmitter<void>(); // Event to close the modal
  @Output() confirmModal: EventEmitter<{ startDate: string, endDate: string }> = new EventEmitter();

  @Input() startDate: string = '';  // Input startDate
  @Input() endDate: string = '';
  

  close() {
    this.closeModal.emit(); // Emit an event to close the modal
  }

  confirm() {
    // Emit startDate and endDate when confirming
    if (new Date(this.startDate) > new Date(this.endDate)) {
      alert('Please input a valid start date and end date!')
    } else {
      this.confirmModal.emit({
        startDate: this.startDate,
        endDate: this.endDate
      });
      this.close(); // Close the modal after confirming
    }
  }
}
