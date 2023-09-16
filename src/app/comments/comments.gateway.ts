import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';

@WebSocketGateway({
  path: 'comments/events',
  cors: { credentials: true, origin: ['http://localhost:4200'] },
})
export class CommentsGateway implements OnGatewayConnection {
  constructor(private commentService: CommentsService) {}
  @WebSocketServer()
  server: Server;

  connections: Socket[] = [];

  handleConnection(socket: Socket) {
    console.log('ok');
    this.connections.push(socket);
  }

  @SubscribeMessage('addComment')
  async handleAddComment(client: Socket, comment: CreateCommentDto) {
    // Логика сохранения комментария в БД с помощью Sequelize
    // this.commentService.create(comment);

    // Отправляем новый комментарий всем подключенным клиентам
    this.server.emit('newComment', comment);
    console.log('sent');
  }

  handleDisconnect(client: Socket) {
    const disconnectedSocketIndex = this.connections.findIndex(
      (socket) => socket.id === client.id,
    );
    if (disconnectedSocketIndex !== -1) {
      this.connections.splice(disconnectedSocketIndex, 1);
    }
  }

  // Дополнительные методы для получения комментариев из БД и отправки их клиенту
}
