import { FeedbackInput, FeedbackPort } from '../../application/ports/FeedbackPort';

export class HttpFeedbackAdapter implements FeedbackPort {
  async enviar(input: FeedbackInput): Promise<void> {
    const res = await fetch('/api/feedback', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
    });
    if (!res.ok) throw new Error('No se pudo enviar el feedback');
  }
}
