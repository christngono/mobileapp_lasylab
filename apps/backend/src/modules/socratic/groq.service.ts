import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

/**
 * Accès au modèle Groq (API compatible OpenAI). La clé API est lue depuis la
 * configuration serveur et n'est JAMAIS exposée au client.
 * Si aucune clé n'est configurée, `chat()` renvoie null et le service
 * socratique bascule sur une relance de secours (mode dégradé).
 */
@Injectable()
export class GroqService {
  private readonly logger = new Logger(GroqService.name);
  private readonly client: OpenAI | null;
  private readonly model: string;

  constructor(private readonly config: ConfigService) {
    const apiKey = this.config.get<string>('groq.apiKey');
    const baseURL = this.config.get<string>('groq.baseUrl');
    this.model = this.config.get<string>('groq.model') ?? 'llama-3.3-70b-versatile';
    this.client = apiKey ? new OpenAI({ apiKey, baseURL }) : null;
    if (!this.client) {
      this.logger.warn('GROQ_API_KEY absente : le module socratique fonctionne en mode dégradé.');
    }
  }

  get isConfigured(): boolean {
    return this.client !== null;
  }

  /** Envoie la conversation au modèle et renvoie la réponse (ou null si indisponible). */
  async chat(messages: ChatMessage[]): Promise<string | null> {
    if (!this.client) return null;
    try {
      const completion = await this.client.chat.completions.create({
        model: this.model,
        messages,
        temperature: 0.6,
        max_tokens: 300,
      });
      return completion.choices[0]?.message?.content?.trim() ?? null;
    } catch (err) {
      this.logger.error('Appel Groq échoué', err as Error);
      return null;
    }
  }
}
