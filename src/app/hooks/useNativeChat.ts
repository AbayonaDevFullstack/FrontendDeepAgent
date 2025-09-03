import { useState, useCallback, useMemo, useRef } from "react";
import { getDeployment } from "@/lib/environment/deployments";
import { v4 as uuidv4 } from "uuid";
import type { TodoItem } from "../types/types";
import { createNativeClient, type Message } from "@/lib/native-client";
import { useAuthContext } from "@/providers/Auth";

export function useNativeChat(
  threadId: string | null,
  setThreadId: (
    value: string | ((old: string | null) => string | null) | null,
  ) => void,
  onTodosUpdate: (todos: TodoItem[]) => void,
  onFilesUpdate: (files: Record<string, string>) => void,
) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  const deployment = useMemo(() => getDeployment(), []);
  const { session } = useAuthContext();
  const accessToken = session?.accessToken;

  const client = useMemo(() => {
    if (!deployment?.deploymentUrl || !accessToken) return null;
    return createNativeClient(accessToken, deployment.deploymentUrl);
  }, [deployment?.deploymentUrl, accessToken]);

  // Cargar mensajes existentes cuando cambia el threadId
  const loadThreadMessages = useCallback(async () => {
    if (!client || !threadId) {
      setMessages([]);
      return;
    }

    try {
      setIsLoading(true);
      const threadHistory = await client.getThreadHistory(threadId);
      setMessages(threadHistory);
    } catch (error) {
      console.error('Error loading thread messages:', error);
      setMessages([]);
    } finally {
      setIsLoading(false);
    }
  }, [client, threadId]);

  // Llamar loadThreadMessages cuando cambie threadId
  useMemo(() => {
    loadThreadMessages();
  }, [loadThreadMessages]);

  const sendMessage = useCallback(
    async (message: string) => {
      if (!client) return;

      // Crear mensaje optimista del usuario
      const humanMessage: Message = {
        id: uuidv4(),
        type: "human",
        content: message,
        timestamp: new Date().toISOString(),
        tool_calls: null,
        tool_call_id: null,
      };

      // Agregar mensaje optimistamente
      setMessages(prev => [...prev, humanMessage]);
      setIsLoading(true);

      // Crear un mensaje de AI vacío para ir llenando con streaming
      const aiMessageId = uuidv4();
      const aiMessage: Message = {
        id: aiMessageId,
        type: "ai",
        content: "",
        timestamp: new Date().toISOString(),
        tool_calls: null,
        tool_call_id: null,
      };

      // Agregar mensaje de AI vacío
      setMessages(prev => [...prev, aiMessage]);

      let streamingContent = "";

      try {

        await client.sendMessageStream(
          message,
          threadId || undefined,
          // onChunk - recibir chunks de texto
          (chunk: string) => {
            streamingContent += chunk;
            
            // Actualizar el mensaje de AI con el contenido acumulado
            setMessages(prev => 
              prev.map(msg => 
                msg.id === aiMessageId 
                  ? { ...msg, content: streamingContent }
                  : msg
              )
            );
          },
          // onComplete - cuando termina el streaming
          (data: any) => {
            console.log('🏁 Stream completed:', data);
            
            // Actualizar threadId si es nuevo
            if (data.thread_id && data.thread_id !== threadId) {
              setThreadId(data.thread_id);
            }

            // Actualizar todos y archivos
            onTodosUpdate(data.todos || []);
            onFilesUpdate(data.files || {});

            setIsLoading(false);
          },
          // onError - manejar errores
          (error: string) => {
            console.error('Stream error:', error);
            
            // Solo actualizar con error si no hay contenido previo
            setMessages(prev => 
              prev.map(msg => 
                msg.id === aiMessageId 
                  ? { 
                      ...msg, 
                      content: streamingContent || "Lo siento, hubo un error procesando tu mensaje. Por favor inténtalo de nuevo." 
                    }
                  : msg
              )
            );

            setIsLoading(false);
          }
        );

      } catch (error) {
        console.error('Error sending message:', error);
        
        // Solo actualizar con error si no hay contenido previo
        setMessages(prev => 
          prev.map(msg => 
            msg.id === aiMessageId 
              ? { 
                  ...msg, 
                  content: streamingContent || "Lo siento, hubo un error enviando tu mensaje. Por favor inténtalo de nuevo." 
                }
              : msg
          )
        );

        setIsLoading(false);
      }
    },
    [client, threadId, setThreadId, onTodosUpdate, onFilesUpdate],
  );

  const stopStream = useCallback(() => {
    // En nuestra implementación nativa, no tenemos streaming real
    // pero mantenemos la interfaz para compatibilidad
    setIsLoading(false);
  }, []);

  return {
    messages,
    isLoading,
    sendMessage,
    stopStream,
  };
}