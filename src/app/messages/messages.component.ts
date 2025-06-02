import { Component } from '@angular/core';
import { MessageService } from '../message.service';
import { CommonModule, NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrl: './messages.component.css',
  standalone: true,
  imports: [NgFor, NgIf, CommonModule],
})
export class MessagesComponent {
  constructor(public messageService: MessageService) {}
}
