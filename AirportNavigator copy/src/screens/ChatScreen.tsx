import { useMemo, useRef, useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Pressable,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Checkpoint, ChatMessage } from '../types';
import { useItinerary } from '../context/ItineraryContext';
import { useTranslation } from '../hooks/useTranslation';
import { getTranslatedCheckpoints } from '../utils/translationUtils';
import { generateAIResponse } from '../utils/geminiService';

export function ChatScreen() {
  const insets = useSafeAreaInsets();
  const { checkpoints, addCheckpoint, addMultipleCheckpoints, selectedCheckpoints } = useItinerary();
  const { t, language } = useTranslation();
  
  const translatedCheckpoints = useMemo(() => 
    getTranslatedCheckpoints(checkpoints, language), 
    [checkpoints, language]
  );
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<ScrollView>(null);
  const [pendingConfirmation, setPendingConfirmation] = useState<{
    checkpoints: Checkpoint[];
    messageId: string;
  } | null>(null);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: t.chatScreen.welcomeMessage,
      createdAt: Date.now(),
    },
  ]);
  
  // Update welcome message when language changes
  useEffect(() => {
    setMessages((prev) => 
      prev.map((msg) => 
        msg.id === 'welcome' 
          ? { ...msg, content: t.chatScreen.welcomeMessage }
          : msg
      )
    );
  }, [t.chatScreen.welcomeMessage]);

  const scrollToBottom = () => {
    requestAnimationFrame(() => {
      scrollRef.current?.scrollToEnd({ animated: true });
    });
  };

  const generateSuggestions = (query: string): Checkpoint[] => {
    const normalized = query.toLowerCase();
    if (!normalized.trim()) return [];

    // Add Chinese keywords for better matching
    const keywordMatches: Record<string, (checkpoint: Checkpoint) => boolean> = {
      lounge: (checkpoint) => checkpoint.type === 'lounge',
      '休息室': (checkpoint) => checkpoint.type === 'lounge',
      '貴賓室': (checkpoint) => checkpoint.type === 'lounge',
      eat: (checkpoint) => checkpoint.type === 'dining',
      food: (checkpoint) => checkpoint.type === 'dining',
      dining: (checkpoint) => checkpoint.type === 'dining',
      '吃': (checkpoint) => checkpoint.type === 'dining',
      '餐廳': (checkpoint) => checkpoint.type === 'dining',
      '餐饮': (checkpoint) => checkpoint.type === 'dining',
      '吃飯': (checkpoint) => checkpoint.type === 'dining',
      shop: (checkpoint) => checkpoint.type === 'shopping',
      shopping: (checkpoint) => checkpoint.type === 'shopping',
      '購物': (checkpoint) => checkpoint.type === 'shopping',
      '商店': (checkpoint) => checkpoint.type === 'shopping',
      rest: (checkpoint) => checkpoint.type === 'restroom',
      restroom: (checkpoint) => checkpoint.type === 'restroom',
      '洗手間': (checkpoint) => checkpoint.type === 'restroom',
      gate: (checkpoint) => checkpoint.type === 'gate',
      '登機口': (checkpoint) => checkpoint.type === 'gate',
    };

    const matchedKey = Object.keys(keywordMatches).find((keyword) => normalized.includes(keyword));
    if (!matchedKey) {
      return translatedCheckpoints.filter((checkpoint: Checkpoint) => !checkpoint.isMandatory).slice(0, 3);
    }
    const predicate = keywordMatches[matchedKey];
    return translatedCheckpoints.filter(predicate).slice(0, 3);
  };

  const handlePlanMyDay = () => {
    setIsTyping(true);
    scrollToBottom();

    setTimeout(() => {
      const dining = translatedCheckpoints.find((c) => c.type === 'dining');
      const lounge = translatedCheckpoints.find((c) => c.type === 'lounge');
      const shopping = translatedCheckpoints.find((c) => c.type === 'shopping');

      const checkpointsToAdd = [dining, lounge, shopping].filter(
        (c): c is Checkpoint => !!c && !selectedCheckpoints.includes(c.id)
      );

      if (checkpointsToAdd.length === 0) {
        const assistantMessage: ChatMessage = {
          id: `${Date.now()}-assistant`,
          role: 'assistant',
          content: t.chatScreen.nothingToAdd,
          createdAt: Date.now(),
        };
        setMessages((prev) => [...prev, assistantMessage]);
        setIsTyping(false);
        scrollToBottom();
        return;
      }

      const suggestionNames = checkpointsToAdd.map((c) => c.name).join(', ');
      const messageId = `${Date.now()}-assistant`;

      const assistantMessage: ChatMessage = {
        id: messageId,
        role: 'assistant',
        content: t.chatScreen.planConfirmation.replace('{{suggestions}}', suggestionNames),
        createdAt: Date.now(),
        suggestions: checkpointsToAdd,
        isConfirmation: true,
      };

      setMessages((prev) => [...prev, assistantMessage]);
      setPendingConfirmation({ checkpoints: checkpointsToAdd, messageId });
      setIsTyping(false);
      scrollToBottom();
    }, 600);
  };

  const handleConfirmation = (confirmed: boolean) => {
    if (!pendingConfirmation) return;

    const { checkpoints: checkpointsToAdd, messageId } = pendingConfirmation;

    // Find and update the original confirmation message to remove buttons
    setMessages((prev) =>
      prev.map((msg) =>
        msg.id === messageId
          ? {
              ...msg,
              isConfirmation: false, // No longer a confirmation
            }
          : msg
      )
    );

    if (confirmed) {
      addMultipleCheckpoints(checkpointsToAdd.map((c) => c.id));
      const confirmationMessage: ChatMessage = {
        id: `${Date.now()}-assistant`,
        role: 'assistant',
        content: language === 'zh' 
          ? `已添加 ${checkpointsToAdd.length} 个地点到您的行程！` 
          : `Added ${checkpointsToAdd.length} location${checkpointsToAdd.length > 1 ? 's' : ''} to your itinerary!`,
        createdAt: Date.now(),
      };
      setMessages((prev) => [...prev, confirmationMessage]);
    } else {
      const cancellationMessage: ChatMessage = {
        id: `${Date.now()}-assistant`,
        role: 'assistant',
        content: language === 'zh'
          ? '好的，我不会添加这些地点。如果您需要其他建议，请告诉我！'
          : 'Okay, I won\'t add these locations. Let me know if you need other suggestions!',
        createdAt: Date.now(),
      };
      setMessages((prev) => [...prev, cancellationMessage]);
    }

    setPendingConfirmation(null);
    scrollToBottom();
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: ChatMessage = {
      id: `${Date.now()}-user`,
      role: 'user',
      content: input,
      createdAt: Date.now(),
    };

    setMessages((prev: ChatMessage[]) => [...prev, userMessage]);
    const userInput = input;
    setInput('');
    setIsTyping(true);
    scrollToBottom();

    // Check if user wants to plan their day
    if (userInput.toLowerCase().includes('plan my day')) {
      handlePlanMyDay();
      return;
    }

    try {
      // Use Gemini AI to generate response
      const aiResponse = await generateAIResponse(
        userInput,
        checkpoints,
        selectedCheckpoints,
        language
      );

      const messageId = `${Date.now()}-assistant`;
      const hasSuggestions = aiResponse.suggestedCheckpoints && aiResponse.suggestedCheckpoints.length > 0;

      const assistantMessage: ChatMessage = {
        id: messageId,
        role: 'assistant',
        content: aiResponse.text,
        createdAt: Date.now(),
        suggestions: aiResponse.suggestedCheckpoints || [],
        isConfirmation: hasSuggestions, // Show confirmation buttons if there are suggestions
      };

      setMessages((prev: ChatMessage[]) => [...prev, assistantMessage]);
      
      // Set pending confirmation if there are suggestions
      if (hasSuggestions) {
        setPendingConfirmation({ 
          checkpoints: aiResponse.suggestedCheckpoints!, 
          messageId 
        });
      }
    } catch (error) {
      console.error('Error getting AI response:', error);
      
      // Fallback to local suggestions if AI fails
      const suggestions = generateSuggestions(userInput);
      const suggestionNames = suggestions.map((checkpoint) => checkpoint.name).join(', ');

      const assistantMessage: ChatMessage = {
        id: `${Date.now()}-assistant`,
        role: 'assistant',
        content: suggestions.length
          ? t.chatScreen.responseTemplate.replace('{{suggestions}}', suggestionNames)
          : t.chatScreen.noResultsMessage,
        createdAt: Date.now(),
        suggestions,
      };

      setMessages((prev: ChatMessage[]) => [...prev, assistantMessage]);
    } finally {
      setIsTyping(false);
      scrollToBottom();
    }
  };

  const handleQuickSuggestion = (suggestion: string) => {
    setInput(suggestion);
  };

  const handleAddSuggestion = (checkpoint: Checkpoint) => {
    if (selectedCheckpoints.includes(checkpoint.id)) return;
    addCheckpoint(checkpoint.id);
  };

  const messageGroups = useMemo(() => messages, [messages]);

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? insets.top : 0}
    >
      <ScrollView
        ref={scrollRef}
        style={styles.messages}
        contentContainerStyle={[
          styles.messagesContent,
          { paddingBottom: 40 + Math.max(insets.bottom, 16) },
        ]}
        keyboardShouldPersistTaps="handled"
      >
  {messageGroups.map((message: ChatMessage) => (
          <View
            key={message.id}
            style={[styles.messageRow, message.role === 'user' ? styles.messageRight : styles.messageLeft]}
          >
            <View style={[styles.bubble, message.role === 'user' ? styles.userBubble : styles.assistantBubble]}>
              <Text style={message.role === 'user' ? styles.userText : styles.assistantText}>{message.content}</Text>
            </View>
            {message.suggestions && !message.isConfirmation ? (
              <View style={styles.suggestionList}>
                {message.suggestions.map((checkpoint: Checkpoint) => (
                  <Pressable
                    key={checkpoint.id}
                    style={styles.suggestionCard}
                    onPress={() => handleAddSuggestion(checkpoint)}
                  >
                    <Text style={styles.suggestionTitle}>{checkpoint.name}</Text>
                    <Text style={styles.suggestionMeta}>{checkpoint.location}</Text>
                  </Pressable>
                ))}
              </View>
            ) : null}
            {message.isConfirmation ? (
              <View style={styles.confirmationContainer}>
                <View style={styles.suggestionList}>
                  {message.suggestions?.map((checkpoint: Checkpoint) => (
                    <View key={checkpoint.id} style={styles.suggestionCard}>
                      <Text style={styles.suggestionTitle}>{checkpoint.name}</Text>
                      <Text style={styles.suggestionMeta}>{checkpoint.location}</Text>
                    </View>
                  ))}
                </View>
                <View style={styles.confirmationButtons}>
                  <Pressable style={[styles.button, styles.confirmButton]} onPress={() => handleConfirmation(true)}>
                    <Text style={styles.buttonTextConfirm}>{t.chatScreen.confirm}</Text>
                  </Pressable>
                  <Pressable style={[styles.button, styles.cancelButton]} onPress={() => handleConfirmation(false)}>
                    <Text style={styles.buttonText}>{t.chatScreen.cancel}</Text>
                  </Pressable>
                </View>
              </View>
            ) : null}
          </View>
        ))}
        {isTyping ? (
          <View style={[styles.messageRow, styles.messageLeft]}>
            <View style={[styles.bubble, styles.assistantBubble]}>
              <Text style={styles.assistantText}>{t.chatScreen.typing}</Text>
            </View>
          </View>
        ) : null}
      </ScrollView>

      {messages.length <= 1 ? (
        <View style={styles.quickActions}>
          <Pressable style={styles.quickPill} onPress={() => handleQuickSuggestion(t.chatScreen.planMyDay)}>
            <Text style={styles.quickText}>{t.chatScreen.planMyDay}</Text>
          </Pressable>
          {t.chatScreen.quickSuggestions.map((suggestion: string) => (
            <Pressable
              key={suggestion}
              style={styles.quickPill}
              onPress={() => handleQuickSuggestion(suggestion)}
            >
              <Text style={styles.quickText}>{suggestion}</Text>
            </Pressable>
          ))}
        </View>
      ) : null}

      <View style={[styles.inputBar, { paddingBottom: Math.max(insets.bottom, 16) }]}>
        <TextInput
          placeholder={t.chatScreen.inputPlaceholder}
          placeholderTextColor="#94A3B8"
          value={input}
          onChangeText={setInput}
          onSubmitEditing={handleSend}
          style={styles.textInput}
          returnKeyType="send"
        />
        <Pressable style={styles.sendButton} onPress={handleSend}>
          <MaterialIcons name="send" color="#FFFFFF" size={20} />
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAF8F6',
  },
  messages: {
    flex: 1,
  },
  messagesContent: {
    padding: 16,
    paddingBottom: 40,
  },
  messageRow: {
    marginBottom: 16,
  },
  messageLeft: {
    alignItems: 'flex-start',
  },
  messageRight: {
    alignItems: 'flex-end',
  },
  bubble: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 18,
    maxWidth: '85%',
  },
  assistantBubble: {
    backgroundColor: '#EBEDEC',
  },
  userBubble: {
    backgroundColor: '#016563',
  },
  assistantText: {
    color: '#0F172A',
    fontSize: 14,
  },
  userText: {
    color: '#FFFFFF',
    fontSize: 14,
  },
  suggestionList: {
    width: '100%',
    marginTop: 10,
    gap: 10,
  },
  suggestionCard: {
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 14,
    padding: 12,
    backgroundColor: '#FFFFFF',
  },
  suggestionTitle: {
    fontWeight: '600',
    color: '#0F172A',
    marginBottom: 4,
  },
  suggestionMeta: {
    color: '#64748B',
    fontSize: 12,
  },
  confirmationContainer: {
    width: '100%',
    marginTop: 10,
    gap: 10,
  },
  confirmationButtons: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 8,
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 14,
    alignItems: 'center',
  },
  buttonText: {
    fontWeight: '600',
  },
  buttonTextConfirm:{
    fontWeight: '600',
    color: '#FFFFFF',
  },
  confirmButton: {
    backgroundColor: '#016563',
    color: '#FFFFFF',
  },
  cancelButton: {
    backgroundColor: '#EBEDEC',
    color: '#000000',
  },
  quickActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  quickPill: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#E8F4F3',
  },
  quickText: {
    color: '#016563',
    fontWeight: '600',
  },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 10,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    backgroundColor: '#FFFFFF',
  },
  textInput: {
    flex: 1,
    borderRadius: 999,
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 16,
    paddingVertical: Platform.select({ ios: 12, android: 8 }),
    color: '#0F172A',
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#016563',
  },
});
