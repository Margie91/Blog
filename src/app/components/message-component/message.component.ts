import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { MessageService } from '../../services/message-service/message.service';
import { Message } from '../../services/message-service/models/message';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss'],
})
export class MessageComponent implements OnInit {
  public message$: Observable<Message>;

  constructor(private messageService: MessageService) {}

  ngOnInit() {
    this.message$ = this.messageService.message;
  }

  public discardError(): void {
    this.messageService.setMessage(null);
  }
}
