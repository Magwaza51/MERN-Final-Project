import React, { useState, useEffect } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { toast } from 'react-toastify';

const AIHealthAssistant = () => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [healthProfile, setHealthProfile] = useState(null);

  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition
  } = useSpeechRecognition();

  useEffect(() => {
    if (transcript && !listening) {
      setInputMessage(transcript);
      resetTranscript();
    }
  }, [transcript, listening, resetTranscript]);

  useEffect(() => {
    loadHealthProfile();
    initializeAssistant();
  }, []);

  const loadHealthProfile = async () => {
    // Use mock health profile for demo
    setHealthProfile({
      name: 'Demo User',
      age: 32,
      conditions: ['None'],
      allergies: ['None known'],
      medications: [],
      lastCheckup: '2025-09-15',
      bloodType: 'O+',
      emergencyContact: 'Emergency Contact'
    });
  };

  const initializeAssistant = () => {
    const welcomeMessage = {
      id: Date.now(),
      text: "Hello! I'm your AI Health Assistant. I can help you with health questions, medication reminders, symptoms analysis, and wellness tips. How can I assist you today?",
      sender: 'ai',
      timestamp: new Date(),
      type: 'text'
    };
    setMessages([welcomeMessage]);
  };

  const processHealthQuery = async (query) => {
    setIsLoading(true);
    
    // Use mock AI responses for demo
    const aiResponse = generateMockResponse(query);
    
    // Simulate AI processing delay
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
    
    setIsLoading(false);
    return aiResponse;
  };

  const generateMockResponse = (query) => {
    const lowerQuery = query.toLowerCase();
    
    // Symptom analysis
    if (lowerQuery.includes('headache') || lowerQuery.includes('pain')) {
      return {
        text: "I understand you're experiencing headache/pain. Here's what I recommend:\n\n• Stay hydrated - drink plenty of water\n• Rest in a quiet, dark room\n• Apply a cold or warm compress\n• Consider over-the-counter pain relief if appropriate\n\n⚠️ If symptoms persist or worsen, please consult a healthcare professional.",
        type: 'symptom_analysis',
        urgency: 'moderate',
        recommendations: [
          'Hydration therapy',
          'Rest and relaxation',
          'Pain management techniques'
        ]
      };
    }

    // Medication queries
    if (lowerQuery.includes('medication') || lowerQuery.includes('medicine')) {
      return {
        text: "I can help with medication information. Based on your profile, here are some important points:\n\n• Always take medications as prescribed\n• Set reminders for consistent timing\n• Be aware of potential interactions\n• Never stop prescribed medications without consulting your doctor\n\nWould you like me to set up medication reminders for you?",
        type: 'medication_advice',
        actions: ['set_reminder', 'drug_interaction_check']
      };
    }

    // General health advice
    if (lowerQuery.includes('exercise') || lowerQuery.includes('fitness')) {
      return {
        text: "Great question about exercise! Based on general health guidelines:\n\n• Aim for 150 minutes of moderate exercise weekly\n• Include both cardio and strength training\n• Start slowly and gradually increase intensity\n• Listen to your body and rest when needed\n\n💡 Would you like me to create a personalized exercise plan based on your health profile?",
        type: 'fitness_advice',
        actions: ['create_exercise_plan', 'track_activities']
      };
    }

    // Mental health
    if (lowerQuery.includes('stress') || lowerQuery.includes('anxiety') || lowerQuery.includes('mental')) {
      return {
        text: "Mental health is just as important as physical health. Here are some strategies:\n\n• Practice deep breathing exercises\n• Try meditation or mindfulness\n• Maintain a regular sleep schedule\n• Stay connected with supportive people\n• Consider professional help if needed\n\n🧠 Would you like me to guide you through a quick relaxation exercise?",
        type: 'mental_health',
        actions: ['breathing_exercise', 'meditation_guide', 'stress_tracking']
      };
    }

    // Default response
    return {
      text: "I'm here to help with your health questions! I can assist with:\n\n• Symptom analysis and guidance\n• Medication information and reminders\n• Exercise and nutrition advice\n• Mental health support\n• Preventive care recommendations\n\nCould you be more specific about what you'd like to know?",
      type: 'general_help',
      suggestions: [
        'Analyze my symptoms',
        'Medication reminders',
        'Exercise recommendations',
        'Nutrition advice'
      ]
    };
  };

  const sendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = {
      id: Date.now(),
      text: inputMessage,
      sender: 'user',
      timestamp: new Date(),
      type: 'text'
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');

    const aiResponse = await processHealthQuery(inputMessage);
    
    const aiMessage = {
      id: Date.now() + 1,
      ...aiResponse,
      sender: 'ai',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, aiMessage]);

    // Text-to-speech for AI responses if voice is enabled
    if (voiceEnabled && 'speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(aiResponse.text);
      utterance.rate = 0.8;
      utterance.pitch = 1;
      speechSynthesis.speak(utterance);
    }
  };

  const startListening = () => {
    if (browserSupportsSpeechRecognition) {
      SpeechRecognition.startListening({ continuous: false });
    } else {
      toast.error('Your browser does not support speech recognition');
    }
  };

  const executeAction = async (action) => {
    switch (action) {
      case 'set_reminder':
        setMessages(prev => [...prev, {
          id: Date.now(),
          text: "I'd be happy to set up medication reminders for you. What medication would you like reminders for?",
          sender: 'ai',
          timestamp: new Date(),
          type: 'reminder_setup'
        }]);
        break;
        
      case 'breathing_exercise':
        startBreathingExercise();
        break;
        
      case 'create_exercise_plan':
        setMessages(prev => [...prev, {
          id: Date.now(),
          text: "Let me create a personalized exercise plan for you. I'll need to know your current fitness level and any limitations. Are you a beginner, intermediate, or advanced exerciser?",
          sender: 'ai',
          timestamp: new Date(),
          type: 'exercise_planning'
        }]);
        break;
        
      default:
        toast.info(`Action: ${action} - Feature coming soon!`);
    }
  };

  const startBreathingExercise = () => {
    const exerciseMessage = {
      id: Date.now(),
      text: "Let's do a 4-7-8 breathing exercise together. Follow the instructions below:",
      sender: 'ai',
      timestamp: new Date(),
      type: 'breathing_exercise',
      component: 'BreathingExercise'
    };
    setMessages(prev => [...prev, exerciseMessage]);
  };

  const BreathingExercise = () => {
    const [phase, setPhase] = useState('ready'); // ready, inhale, hold, exhale
    const [count, setCount] = useState(0);
    const [cycle, setCycle] = useState(0);

    const startExercise = () => {
      setPhase('inhale');
      setCount(4);
      
      const interval = setInterval(() => {
        setCount(prev => {
          if (prev <= 1) {
            clearInterval(interval);
            if (phase === 'inhale') {
              setPhase('hold');
              setCount(7);
              // Continue with hold phase
            } else if (phase === 'hold') {
              setPhase('exhale');
              setCount(8);
              // Continue with exhale phase
            } else if (phase === 'exhale') {
              setCycle(prev => prev + 1);
              if (cycle < 3) {
                setPhase('inhale');
                setCount(4);
              } else {
                setPhase('complete');
              }
            }
            return prev;
          }
          return prev - 1;
        });
      }, 1000);
    };

    return (
      <div className="breathing-exercise">
        <div className="breathing-circle">
          <div className={`circle ${phase}`}>
            <span className="count">{count}</span>
          </div>
        </div>
        
        <div className="breathing-instructions">
          {phase === 'ready' && (
            <div>
              <p>Ready to start breathing exercise?</p>
              <button onClick={startExercise} className="start-btn">Start</button>
            </div>
          )}
          {phase === 'inhale' && <p>Breathe In... {count}</p>}
          {phase === 'hold' && <p>Hold... {count}</p>}
          {phase === 'exhale' && <p>Breathe Out... {count}</p>}
          {phase === 'complete' && (
            <div>
              <p>Great job! You completed the breathing exercise.</p>
              <p>How do you feel? More relaxed?</p>
            </div>
          )}
        </div>
        
        <div className="cycle-counter">
          Cycle: {cycle + 1} / 4
        </div>
      </div>
    );
  };

  const QuickActions = () => (
    <div className="quick-actions">
      <h4>Quick Actions</h4>
      <div className="actions-grid">
        <button onClick={() => executeAction('symptom_checker')}>
          🔍 Symptom Checker
        </button>
        <button onClick={() => executeAction('medication_reminder')}>
          💊 Med Reminders
        </button>
        <button onClick={() => executeAction('health_tips')}>
          💡 Daily Tips
        </button>
        <button onClick={() => executeAction('emergency_info')}>
          🚨 Emergency Info
        </button>
      </div>
    </div>
  );

  return (
    <div className="ai-health-assistant">
      <div className="assistant-header">
        <div className="header-info">
          <h2>🤖 AI Health Assistant</h2>
          <p>Your personal health companion</p>
        </div>
        
        <div className="voice-controls">
          <button
            className={`voice-btn ${voiceEnabled ? 'active' : ''}`}
            onClick={() => setVoiceEnabled(!voiceEnabled)}
          >
            {voiceEnabled ? '🔊' : '🔇'} Voice
          </button>
          
          {browserSupportsSpeechRecognition && (
            <button
              className={`mic-btn ${listening ? 'listening' : ''}`}
              onClick={startListening}
              disabled={listening}
            >
              {listening ? '🎤 Listening...' : '🎤 Speak'}
            </button>
          )}
        </div>
      </div>

      <div className="chat-container">
        <div className="messages-list">
          {messages.map(message => (
            <div key={message.id} className={`message ${message.sender}`}>
              <div className="message-bubble">
                {message.component === 'BreathingExercise' ? (
                  <BreathingExercise />
                ) : (
                  <>
                    <div className="message-text">
                      {message.text.split('\n').map((line, index) => (
                        <div key={index}>
                          {line}
                          {index < message.text.split('\n').length - 1 && <br />}
                        </div>
                      ))}
                    </div>
                    
                    {message.urgency && (
                      <div className={`urgency-indicator ${message.urgency}`}>
                        {message.urgency === 'high' && '🔴 High Priority'}
                        {message.urgency === 'moderate' && '🟡 Moderate Priority'}
                        {message.urgency === 'low' && '🟢 Low Priority'}
                      </div>
                    )}
                    
                    {message.actions && (
                      <div className="message-actions">
                        {message.actions.map(action => (
                          <button
                            key={action}
                            onClick={() => executeAction(action)}
                            className="action-btn"
                          >
                            {action.replace('_', ' ').toUpperCase()}
                          </button>
                        ))}
                      </div>
                    )}
                    
                    {message.suggestions && (
                      <div className="suggestions">
                        {message.suggestions.map(suggestion => (
                          <button
                            key={suggestion}
                            onClick={() => setInputMessage(suggestion)}
                            className="suggestion-btn"
                          >
                            {suggestion}
                          </button>
                        ))}
                      </div>
                    )}
                  </>
                )}
                
                <div className="message-time">
                  {message.timestamp.toLocaleTimeString()}
                </div>
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="message ai">
              <div className="message-bubble">
                <div className="typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            </div>
          )}
        </div>

        <QuickActions />

        <div className="input-section">
          <div className="input-container">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Ask me about your health..."
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              className="message-input"
            />
            <button onClick={sendMessage} className="send-btn">
              📤
            </button>
          </div>
          
          {transcript && (
            <div className="transcript-preview">
              Voice input: "{transcript}"
            </div>
          )}
        </div>
      </div>

      <style>{`
        .ai-health-assistant {
          max-width: 800px;
          margin: 0 auto;
          padding: 20px;
          height: calc(100vh - 120px);
          display: flex;
          flex-direction: column;
        }

        .assistant-header {
          background: linear-gradient(135deg, #4f46e5, #7c3aed);
          color: white;
          padding: 20px;
          border-radius: 15px 15px 0 0;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .header-info h2 {
          margin: 0 0 5px 0;
        }

        .header-info p {
          margin: 0;
          opacity: 0.9;
        }

        .voice-controls {
          display: flex;
          gap: 10px;
        }

        .voice-btn, .mic-btn {
          padding: 8px 15px;
          border: 2px solid white;
          background: transparent;
          color: white;
          border-radius: 20px;
          cursor: pointer;
          font-weight: bold;
          transition: all 0.3s;
        }

        .voice-btn.active {
          background: white;
          color: #4f46e5;
        }

        .mic-btn.listening {
          background: #dc3545;
          border-color: #dc3545;
          animation: pulse 1s infinite;
        }

        @keyframes pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.05); }
          100% { transform: scale(1); }
        }

        .chat-container {
          background: white;
          flex: 1;
          display: flex;
          flex-direction: column;
          border-radius: 0 0 15px 15px;
          overflow: hidden;
        }

        .messages-list {
          flex: 1;
          overflow-y: auto;
          padding: 20px;
          display: flex;
          flex-direction: column;
          gap: 15px;
        }

        .message {
          display: flex;
        }

        .message.user {
          justify-content: flex-end;
        }

        .message.ai {
          justify-content: flex-start;
        }

        .message-bubble {
          max-width: 70%;
          padding: 15px 20px;
          border-radius: 20px;
          position: relative;
        }

        .message.user .message-bubble {
          background: #4f46e5;
          color: white;
          border-bottom-right-radius: 5px;
        }

        .message.ai .message-bubble {
          background: #f8f9fa;
          color: #333;
          border-bottom-left-radius: 5px;
          border: 1px solid #e9ecef;
        }

        .message-text {
          line-height: 1.5;
        }

        .message-time {
          font-size: 11px;
          opacity: 0.7;
          margin-top: 8px;
          text-align: right;
        }

        .urgency-indicator {
          margin-top: 10px;
          padding: 5px 10px;
          border-radius: 15px;
          font-size: 12px;
          font-weight: bold;
        }

        .urgency-indicator.high {
          background: #f8d7da;
          color: #721c24;
        }

        .urgency-indicator.moderate {
          background: #fff3cd;
          color: #856404;
        }

        .urgency-indicator.low {
          background: #d4edda;
          color: #155724;
        }

        .message-actions {
          margin-top: 10px;
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }

        .action-btn {
          padding: 5px 12px;
          border: 1px solid #4f46e5;
          background: white;
          color: #4f46e5;
          border-radius: 15px;
          cursor: pointer;
          font-size: 11px;
          font-weight: bold;
          transition: all 0.3s;
        }

        .action-btn:hover {
          background: #4f46e5;
          color: white;
        }

        .suggestions {
          margin-top: 10px;
          display: flex;
          flex-direction: column;
          gap: 5px;
        }

        .suggestion-btn {
          padding: 8px 12px;
          border: 1px solid #e9ecef;
          background: white;
          color: #666;
          border-radius: 10px;
          cursor: pointer;
          text-align: left;
          font-size: 13px;
          transition: all 0.3s;
        }

        .suggestion-btn:hover {
          background: #f8f9fa;
          border-color: #4f46e5;
        }

        .typing-indicator {
          display: flex;
          gap: 4px;
          align-items: center;
        }

        .typing-indicator span {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #4f46e5;
          animation: typing 1.4s infinite;
        }

        .typing-indicator span:nth-child(2) {
          animation-delay: 0.2s;
        }

        .typing-indicator span:nth-child(3) {
          animation-delay: 0.4s;
        }

        @keyframes typing {
          0%, 60%, 100% { transform: translateY(0); }
          30% { transform: translateY(-10px); }
        }

        .breathing-exercise {
          text-align: center;
          padding: 20px;
        }

        .breathing-circle {
          margin: 20px 0;
        }

        .circle {
          width: 150px;
          height: 150px;
          border-radius: 50%;
          margin: 0 auto;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 1s ease-in-out;
          border: 4px solid #4f46e5;
        }

        .circle.inhale {
          transform: scale(1.3);
          background: rgba(79, 70, 229, 0.1);
        }

        .circle.hold {
          transform: scale(1.3);
          background: rgba(79, 70, 229, 0.2);
        }

        .circle.exhale {
          transform: scale(0.7);
          background: rgba(79, 70, 229, 0.05);
        }

        .count {
          font-size: 2rem;
          font-weight: bold;
          color: #4f46e5;
        }

        .breathing-instructions {
          margin: 20px 0;
          font-size: 1.2rem;
          font-weight: bold;
        }

        .start-btn {
          background: #4f46e5;
          color: white;
          border: none;
          padding: 10px 20px;
          border-radius: 25px;
          cursor: pointer;
          font-weight: bold;
        }

        .cycle-counter {
          font-size: 14px;
          color: #666;
          margin-top: 10px;
        }

        .quick-actions {
          padding: 15px 20px;
          border-top: 1px solid #e9ecef;
          background: #f8f9fa;
        }

        .quick-actions h4 {
          margin: 0 0 10px 0;
          color: #333;
          font-size: 14px;
        }

        .actions-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 8px;
        }

        .actions-grid button {
          padding: 8px 12px;
          border: 1px solid #e9ecef;
          background: white;
          border-radius: 6px;
          cursor: pointer;
          font-size: 11px;
          text-align: center;
          transition: all 0.3s;
        }

        .actions-grid button:hover {
          background: #4f46e5;
          color: white;
          border-color: #4f46e5;
        }

        .input-section {
          padding: 20px;
          border-top: 1px solid #e9ecef;
        }

        .input-container {
          display: flex;
          gap: 10px;
          align-items: center;
        }

        .message-input {
          flex: 1;
          padding: 12px 20px;
          border: 2px solid #e9ecef;
          border-radius: 25px;
          font-size: 14px;
          outline: none;
          transition: border-color 0.3s;
        }

        .message-input:focus {
          border-color: #4f46e5;
        }

        .send-btn {
          padding: 12px 15px;
          background: #4f46e5;
          color: white;
          border: none;
          border-radius: 50%;
          cursor: pointer;
          font-size: 16px;
          transition: all 0.3s;
        }

        .send-btn:hover {
          background: #3730a3;
          transform: scale(1.05);
        }

        .transcript-preview {
          margin-top: 10px;
          padding: 8px 15px;
          background: #fff3cd;
          border-radius: 15px;
          font-size: 13px;
          color: #856404;
        }

        @media (max-width: 768px) {
          .actions-grid {
            grid-template-columns: repeat(2, 1fr);
          }
          
          .voice-controls {
            flex-direction: column;
            gap: 5px;
          }
          
          .assistant-header {
            flex-direction: column;
            text-align: center;
            gap: 15px;
          }
        }
      `}</style>
    </div>
  );
};

export default AIHealthAssistant;