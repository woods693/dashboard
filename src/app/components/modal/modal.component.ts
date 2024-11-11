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

  @Input() isOpen: boolean = false;
  @Input() startDate: string = '';
  @Input() endDate: string = '';
  @Output() closeModal: EventEmitter<void> = new EventEmitter<void>(); 
  @Output() confirmModal: EventEmitter<{ startDate: string, endDate: string }> = new EventEmitter();

  close() {
    this.closeModal.emit();
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
