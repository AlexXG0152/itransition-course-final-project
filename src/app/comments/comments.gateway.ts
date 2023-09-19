import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';

@WebSocketGateway({
  path: '/api/v1/comments/events/',
  cors: {
    credentials: true,
    // origin: [process.env.HOST],
  },
})
export class CommentsGateway implements OnGatewayConnection {
  constructor(private commentService: CommentsService) {}

  @WebSocketServer()
  server: Server;

  connections: Socket[] = [];

  handleConnection(socket: Socket) {
    console.log(`Client Connected: ${socket.id}`);
    this.connections.push(socket);
  }

  afterInit() {
    console.log('Initialized');
  }

  @SubscribeMessage('addComment')
  async handleAddComment(@MessageBody() comment: CreateCommentDto) {
    if (comment.commentText) {
      const newComment = await this.commentService.create(comment);
      this.server.emit('newComment', newComment);
    }
  }

  handleDisconnect(client: Socket) {
    const disconnectedSocketIndex = this.connections.findIndex(
      (socket) => socket.id === client.id,
    );
    if (disconnectedSocketIndex !== -1) {
      this.connections.splice(disconnectedSocketIndex, 1);
    }
  }
}
