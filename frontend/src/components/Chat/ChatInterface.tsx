import React, { useRef, useEffect } from 'react';
import { Layout, Input, Button, List, Card, message as antdMessage, Typography } from 'antd';
import { SendOutlined, RobotOutlined, UserOutlined } from '@ant-design/icons';
import { chatAPI } from '../../services/api';

interface Message {
  id: string;
  content: string;
  timestamp: string;
  is_bot: boolean;
  sources?: string[];
}

const { Content, Footer, Header } = Layout;
const { Title } = Typography;

const ChatInterface: React.FC = () => {
  const [messages, setMessages] = React.useState<Message[]>([]);
  const [inputMessage, setInputMessage] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage,
      timestamp: new Date().toISOString(),
      is_bot: false
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setLoading(true);

    try {
      const response = await chatAPI.sendMessage(inputMessage);
      const botMessage: Message = {
        id: Date.now().toString(),
        content: response.data.message,
        timestamp: new Date().toISOString(),
        is_bot: true,
        sources: response.data.sources
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      antdMessage.error('Failed to send message');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout style={{ height: '100vh' }}>
      <Header style={{ background: '#fff', padding: '0 24px', borderBottom: '1px solid #f0f0f0' }}>
        <Title level={3} style={{ margin: '16px 0' }}>
          <RobotOutlined style={{ marginRight: 8 }} />
          RAG Chat Assistant
        </Title>
      </Header>
      <Content style={{ padding: '24px', overflow: 'auto', background: '#f5f5f5' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          {messages.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 0' }}>
              <RobotOutlined style={{ fontSize: '48px', color: '#bfbfbf' }} />
              <p style={{ color: '#8c8c8c', marginTop: '16px' }}>
                Ask me anything about "Can't Hurt Me" by David Goggins
              </p>
            </div>
          ) : (
            <List
              itemLayout="horizontal"
              dataSource={messages}
              renderItem={(msg) => (
                <List.Item style={{
                  justifyContent: msg.is_bot ? 'flex-start' : 'flex-end',
                  padding: '8px 0'
                }}>
                  <Card
                    style={{
                      maxWidth: '80%',
                      borderRadius: '12px',
                      backgroundColor: msg.is_bot ? '#fff' : '#1890ff',
                      color: msg.is_bot ? 'rgba(0, 0, 0, 0.85)' : 'white',
                      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.09)'
                    }}
                    bordered={false}
                  >
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                      {msg.is_bot ? (
                        <RobotOutlined style={{ fontSize: '16px', marginTop: '4px' }} />
                      ) : (
                        <UserOutlined style={{ fontSize: '16px', marginTop: '4px', color: 'white' }} />
                      )}
                      <div>
                        <div style={{ whiteSpace: 'pre-wrap' }}>{msg.content}</div>
                        {msg.sources && msg.sources.length > 0 && (
                          <div style={{ fontSize: '12px', marginTop: '8px', opacity: 0.8 }}>
                            Sources: {msg.sources.join(', ')}
                          </div>
                        )}
                        <div style={{ fontSize: '12px', marginTop: '4px', opacity: 0.6 }}>
                          {new Date(msg.timestamp).toLocaleTimeString()}
                        </div>
                      </div>
                    </div>
                  </Card>
                </List.Item>
              )}
            />
          )}
          <div ref={messagesEndRef} />
        </div>
      </Content>
      <Footer style={{ padding: '16px 24px', background: '#fff', boxShadow: '0 -2px 8px rgba(0, 0, 0, 0.09)' }}>
        <div style={{ display: 'flex', gap: '12px', maxWidth: '800px', margin: '0 auto' }}>
          <Input
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onPressEnter={handleSend}
            placeholder="Ask about David Goggins' book..."
            disabled={loading}
            size="large"
            style={{ borderRadius: '8px' }}
          />
          <Button 
            type="primary" 
            icon={<SendOutlined />}
            onClick={handleSend}
            loading={loading}
            size="large"
            style={{ borderRadius: '8px' }}
          >
            Send
          </Button>
        </div>
      </Footer>
    </Layout>
  );
};

export default ChatInterface;
