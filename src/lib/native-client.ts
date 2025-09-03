/**
 * Cliente HTTP nativo para reemplazar el SDK de LangGraph
 * Esto nos dará control total sobre las peticiones y respuestas
 */

export interface Message {
  id: string;
  type: "human" | "ai" | "tool";
  content: string;
  timestamp: string;
  tool_calls?: any[] | null;
  tool_call_id?: string | null;
}

export interface TodoItem {
  content: string;
  status: "pending" | "in_progress" | "completed";
  activeForm: string;
}

export interface Thread {
  id: string;
  title: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ChatResponse {
  messages: Message[];
  todos: TodoItem[];
  files: Record<string, string>;
  thread_id: string;
  metadata: any;
}

export class NativeApiClient {
  private baseUrl: string;
  private accessToken: string;

  constructor(baseUrl: string, accessToken: string) {
    this.baseUrl = baseUrl.replace(/\/$/, ''); // Remove trailing slash
    this.accessToken = accessToken;
  }

  private async request<T>(
    method: 'GET' | 'POST' | 'PUT' | 'DELETE',
    endpoint: string,
    body?: any
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    // Solo agregar token si existe
    if (this.accessToken) {
      headers['Authorization'] = `Bearer ${this.accessToken}`;
    }

    const config: RequestInit = {
      method,
      headers,
    };

    if (body && method !== 'GET') {
      config.body = JSON.stringify(body);
    }

    console.log(`🚀 ${method} ${url}`, body ? { body } : '');

    const response = await fetch(url, config);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`❌ ${method} ${url} failed:`, response.status, errorText);
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    console.log(`✅ ${method} ${url} success:`, data);
    
    return data;
  }

  // Métodos para threads
  async searchThreads(params: { limit?: number; offset?: number } = {}): Promise<Thread[]> {
    const rawThreads = await this.request<any[]>('GET', '/threads/search');
    
    // Convertir el formato del backend a nuestro formato del frontend
    return rawThreads.map(thread => ({
      id: thread.thread_id,
      title: this.extractThreadTitle(thread),
      createdAt: new Date(thread.created_at),
      updatedAt: new Date(thread.updated_at),
    }));
  }

  async getThread(threadId: string): Promise<any> {
    return this.request('GET', `/threads/${threadId}`);
  }

  async getThreadState(threadId: string): Promise<any> {
    return this.request('GET', `/threads/${threadId}/state`);
  }

  async getThreadHistory(threadId: string): Promise<Message[]> {
    return this.request<Message[]>('GET', `/threads/${threadId}/history`);
  }

  // Método principal para chat
  async sendMessage(message: string, threadId?: string): Promise<ChatResponse> {
    return this.request<ChatResponse>('POST', '/chat', {
      message,
      thread_id: threadId,
    });
  }

  // Método de streaming para chat (TEMPORAL: usa /chat + streaming simulado)
  async sendMessageStream(
    message: string, 
    threadId?: string,
    onChunk?: (chunk: string) => void,
    onComplete?: (data: any) => void,
    onError?: (error: string) => void
  ): Promise<void> {
    console.log('🔄 USANDO STREAMING SIMULADO CON /chat');
    
    try {
      // Llamar al endpoint /chat normal que funciona
      const chatResponse = await this.sendMessage(message, threadId);
      
      console.log('✅ Chat response:', chatResponse);
      
      // Simular streaming del contenido CON LOUD THINKING
      const messages = chatResponse.messages || [];
      
      console.log(`🔤 Streaming simulado de ${messages.length} mensajes`);
      
      // Stream cada mensaje en orden para preservar loud thinking
      for (const msg of messages) {
        if (msg.type === 'ai') {
          // Stream contenido AI palabra por palabra
          if (msg.content && onChunk) {
            const words = msg.content.split(' ');
            
            for (let i = 0; i < words.length; i += 3) {
              const chunk = words.slice(i, i + 3).join(' ') + (i + 3 < words.length ? ' ' : '');
              onChunk(chunk);
              
              // Pausa pequeña para simular streaming
              await new Promise(resolve => setTimeout(resolve, 30));
            }
            
            // Agregar separador entre mensajes AI
            onChunk('\n\n');
          }
        } else if (msg.type === 'tool') {
          // Stream resultado de herramientas inmediatamente
          if (msg.content && onChunk) {
            onChunk(`\n🔧 ${msg.content}\n\n`);
            await new Promise(resolve => setTimeout(resolve, 100));
          }
        }
      }
      
      // Llamar onComplete con los datos reales
      onComplete?.({
        type: 'complete',
        thread_id: chatResponse.thread_id,
        todos: chatResponse.todos,
        files: chatResponse.files,
        metadata: chatResponse.metadata
      });
      
    } catch (error) {
      console.error('Error in simulated streaming:', error);
      onError?.(error instanceof Error ? error.message : 'Error desconocido');
    }
    
    return;
    
    // CÓDIGO ORIGINAL DEL STREAMING (desactivado)
    const url = `${this.baseUrl}/chat/stream`;
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Accept': 'text/event-stream',
      'Cache-Control': 'no-cache',
    };

    // Solo agregar token si existe
    if (this.accessToken) {
      headers['Authorization'] = `Bearer ${this.accessToken}`;
    }

    const body = JSON.stringify({
      message,
      thread_id: threadId,
    });

    console.log(`🚀 STREAMING POST ${url}`, { message, threadId });

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers,
        body,
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`❌ STREAMING POST ${url} failed:`, response.status, errorText);
        onError?.(`HTTP ${response.status}: ${errorText}`);
        return;
      }

      const reader = response.body?.getReader();
      if (!reader) {
        onError?.('No se pudo crear el reader para el streaming');
        return;
      }

      const decoder = new TextDecoder();
      let buffer = '';

      try {
        while (true) {
          const { done, value } = await reader.read();
          
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          
          // Procesar líneas completas
          const lines = buffer.split('\n');
          buffer = lines.pop() || ''; // Guardar la línea incompleta

          for (const line of lines) {
            if (line.trim() === '') continue;
            
            if (line.startsWith('data: ')) {
              try {
                const jsonData = line.slice(6); // Remover "data: "
                const data = JSON.parse(jsonData);
                
                console.log('📡 Stream data:', data);

                if (data.type === 'text_chunk') {
                  onChunk?.(data.content);
                } else if (data.type === 'complete') {
                  onComplete?.(data);
                } else if (data.type === 'error') {
                  onError?.(data.message);
                } else if (data.type === 'start') {
                  console.log('🎬 Stream started for thread:', data.thread_id);
                } else if (data.type === 'phase') {
                  console.log(`📋 Phase changed to: ${data.phase}`);
                  // Podríamos agregar separadores visuales entre fases si queremos
                }
              } catch (e) {
                console.warn('Failed to parse SSE data:', line, e);
              }
            }
          }
        }
      } finally {
        reader.releaseLock();
      }

      console.log('✅ Stream completed');

    } catch (error) {
      console.error('❌ Stream error:', error);
      onError?.(error instanceof Error ? error.message : 'Unknown streaming error');
    }
  }

  // Método auxiliar para extraer título del thread
  private extractThreadTitle(thread: any): string {
    try {
      // Si tiene valores con mensajes, usar el primer mensaje
      if (thread.values && thread.values.messages && thread.values.messages.length > 0) {
        const firstMessage = thread.values.messages[0];
        if (typeof firstMessage.content === 'string') {
          return firstMessage.content.slice(0, 50) + (firstMessage.content.length > 50 ? '...' : '');
        }
      }
      
      // Fallback al ID del thread
      return `Thread ${thread.thread_id?.slice(0, 8) || 'unknown'}`;
    } catch (error) {
      console.warn('Error extracting thread title:', error);
      return `Thread ${thread.thread_id?.slice(0, 8) || 'unknown'}`;
    }
  }
}

// Factory function
export function createNativeClient(accessToken: string, deploymentUrl: string) {
  return new NativeApiClient(deploymentUrl, accessToken);
}