export interface FeedbackInput {
  titulo: string;
  descripcion: string;
  userName: string;
  userEmail: string;
}

export interface FeedbackPort {
  enviar(input: FeedbackInput): Promise<void>;
}
