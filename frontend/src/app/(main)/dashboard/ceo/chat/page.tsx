"use client"

import { useState, useRef, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PageHeaderWithActions } from "@/components/ui/page-header-with-actions";
import { StatCard } from "@/components/ui/stat-card";
import { StatusBadge } from "@/components/ui/status-badge";
import { useAgent } from "@/lib/agents/agent-context";
import {
  ChatContainerContent,
  ChatContainerRoot,
} from "@/components/prompt-kit/chat-container"
import {
  Message,
  MessageAction,
  MessageActions,
  MessageContent,
} from "@/components/prompt-kit/message"
import {
  PromptInput,
  PromptInputAction,
  PromptInputActions,
  PromptInputTextarea,
} from "@/components/prompt-kit/prompt-input"
import { cn } from "@/lib/utils"
import {
  ArrowUp,
  Copy,
  Globe,
  Mic,
  MoreHorizontal,
  Pencil,
  Plus,
  ThumbsDown,
  ThumbsUp,
  Trash,
  MessageSquare,
  Bot,
  User,
  Send,
  Settings,
  History,
  Sparkles,
  Brain,
  Target,
  TrendingUp,
  Users,
  Zap,
  Clock,
  CheckCircle,
  AlertCircle,
  FileText,
  Image,
  Video,
  Smile,
  Paperclip,
  ChevronDown,
  ChevronUp,
  RotateCcw,
  Save,
  Loader2,
  Lightbulb,
  Rocket,
  BarChart3,
  Calendar,
  DollarSign,
  Edit,
  Eye,
  ArrowLeft,
  Star,
  Activity,
  Shield
} from "lucide-react"
import Link from "next/link";
import { toast } from "sonner"

export default function ChatPage() {
  const searchParams = useSearchParams();
  const agentId = searchParams.get('agent');
  const chatId = searchParams.get('chat');
  
  const { 
    agents, 
    selectedAgent, 
    setSelectedAgent, 
    getAgentById, 
    getAgentChats, 
    createChat, 
    sendMessage 
  } = useAgent();

  const [prompt, setPrompt] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [currentChat, setCurrentChat] = useState<any>(null)
  const [chatMessages, setChatMessages] = useState<any[]>([])
  const [showReasoning, setShowReasoning] = useState(false)
  const [selectedAgentId, setSelectedAgentId] = useState(agentId || "")
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [showScrollButton, setShowScrollButton] = useState(false)

  // Initialize agent and chat on load
  useEffect(() => {
    if (agentId) {
      const agent = getAgentById(agentId);
      if (agent) {
        setSelectedAgent(agent);
        setSelectedAgentId(agentId);
        
        // Load existing chat or create new one
        if (chatId) {
          const agentChats = getAgentChats(agentId);
          const existingChat = agentChats.find(c => c.id === chatId);
          if (existingChat) {
            setCurrentChat(existingChat);
            setChatMessages(existingChat.messages);
          }
        }
      }
    }
  }, [agentId, chatId, getAgentById, setSelectedAgent, getAgentChats]);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    const scrollToBottom = () => {
      if (messagesEndRef.current) {
        messagesEndRef.current.scrollIntoView({ 
          behavior: 'smooth',
          block: 'end'
        })
      }
    }

    const timeoutId = setTimeout(scrollToBottom, 100)
    return () => clearTimeout(timeoutId)
  }, [chatMessages, isLoading])

  // Handle scroll events to show/hide scroll button
  useEffect(() => {
    const handleScroll = () => {
      if (scrollContainerRef.current) {
        const { scrollTop, scrollHeight, clientHeight } = scrollContainerRef.current
        const isScrolledUp = scrollHeight - scrollTop - clientHeight > 100
        setShowScrollButton(isScrolledUp)
      }
    }

    const container = scrollContainerRef.current
    if (container) {
      container.addEventListener('scroll', handleScroll)
      return () => container.removeEventListener('scroll', handleScroll)
    }
  }, [])

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ 
        behavior: 'smooth',
        block: 'end'
      })
    }
  }

  const handleAgentChange = (newAgentId: string) => {
    const agent = getAgentById(newAgentId);
    if (agent) {
      setSelectedAgent(agent);
      setSelectedAgentId(newAgentId);
      setCurrentChat(null);
      setChatMessages([]);
      // Update URL
      window.history.replaceState({}, '', `/dashboard/ceo/chat?agent=${newAgentId}`);
    }
  };

  const handleSubmit = async () => {
    if (!prompt.trim() || !selectedAgent) return

    const messageContent = prompt.trim();
    setPrompt("")
    setIsLoading(true)

    try {
      // Create new chat if none exists
      let chat = currentChat;
      if (!chat) {
        chat = await createChat(selectedAgent.id, `Chat with ${selectedAgent.name}`);
        setCurrentChat(chat);
        // Update URL to include chat ID
        window.history.replaceState({}, '', `/dashboard/ceo/chat?agent=${selectedAgent.id}&chat=${chat.id}`);
      }

      // Send message
      await sendMessage(chat.id, messageContent);
      
      // Refresh chat messages
      const updatedChats = getAgentChats(selectedAgent.id);
      const updatedChat = updatedChats.find(c => c.id === chat.id);
      if (updatedChat) {
        setChatMessages(updatedChat.messages);
      }
    } catch (error) {
      toast.error('Failed to send message');
    } finally {
      setIsLoading(false)
    }
  }

  const handleNewChat = async () => {
    if (!selectedAgent) return;
    
    try {
      const newChat = await createChat(selectedAgent.id);
      setCurrentChat(newChat);
      setChatMessages([]);
      window.history.replaceState({}, '', `/dashboard/ceo/chat?agent=${selectedAgent.id}&chat=${newChat.id}`);
      toast.success('New chat started');
    } catch (error) {
      toast.error('Failed to create new chat');
    }
  };

  // Create breadcrumbs
  const breadcrumbs = [
    { label: "CEO Dashboard", href: "/dashboard/ceo" },
    { label: "AI Chat" }
  ];

  // Create header actions
  const headerActions = [
    {
      label: "New Chat",
      onClick: handleNewChat,
      icon: Plus,
      variant: "outline" as const,
      disabled: !selectedAgent
    },
    {
      label: "Chat History",
      onClick: () => toast.info("Chat history feature coming soon"),
      icon: History,
      variant: "outline" as const
    },
    ...(selectedAgent ? [{
      label: "Edit Agent",
      onClick: () => window.location.href = `/dashboard/ceo/agents/edit/${selectedAgent.id}`,
      icon: Edit,
      variant: "outline" as const
    }] : [])
  ];

  // Prepare agent performance stats if agent is selected
  const agentStats = selectedAgent ? [
    {
      title: "Success Rate",
      value: `${selectedAgent.performance.successRate}%`,
      icon: Target,
    },
    {
      title: "Avg Response",
      value: `${selectedAgent.performance.avgResponseTime}h`,
      icon: Clock,
    },
    {
      title: "Tasks Done",
      value: selectedAgent.performance.tasksCompleted.toString(),
      icon: CheckCircle,
    },
    {
      title: "Impact Score",
      value: `${selectedAgent.performance.businessImpact}/10`,
      icon: TrendingUp,
    }
  ] : [];

  return (
    <main className="px-2 sm:px-4 md:px-6 py-4 md:py-6">
      {/* Page Header */}
      <PageHeaderWithActions
        title={selectedAgent ? `Chat with ${selectedAgent.name}` : "AI Chat"}
        description={selectedAgent ? `Interact with your ${selectedAgent.type} agent` : "Select an agent to start chatting"}
        breadcrumbs={breadcrumbs}
        actions={headerActions}
        icon={MessageSquare}
        className="mb-6"
      />

      <div className="grid gap-6 grid-cols-1 lg:grid-cols-4">
        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-4">
          {/* Agent Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Select Agent</CardTitle>
              <CardDescription>Choose which AI agent to chat with</CardDescription>
            </CardHeader>
            <CardContent>
              <Select value={selectedAgentId} onValueChange={handleAgentChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose an agent" />
                </SelectTrigger>
                <SelectContent>
                  {agents.map((agent) => (
                    <SelectItem key={agent.id} value={agent.id}>
                      <div className="flex items-center space-x-2">
                        <span>{agent.avatar}</span>
                        <span>{agent.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          {/* Selected Agent Info */}
          {selectedAgent && (
            <Card>
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="text-2xl">{selectedAgent.avatar}</div>
                  <div>
                    <CardTitle className="text-lg">{selectedAgent.name}</CardTitle>
                    <CardDescription>{selectedAgent.type}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Status:</span>
                  <StatusBadge status={selectedAgent.status} size="sm" />
                </div>
                
                <div className="space-y-2">
                  <span className="text-sm font-medium">Specialties:</span>
                  <div className="flex flex-wrap gap-1">
                    {selectedAgent.specialties.slice(0, 2).map((specialty, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {specialty}
                      </Badge>
                    ))}
                    {selectedAgent.specialties.length > 2 && (
                      <Badge variant="secondary" className="text-xs">
                        +{selectedAgent.specialties.length - 2}
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <span className="text-sm font-medium">Quick Stats:</span>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="text-center p-2 bg-muted/50 rounded">
                      <p className="font-bold">{selectedAgent.performance.successRate}%</p>
                      <p className="text-muted-foreground">Success</p>
                    </div>
                    <div className="text-center p-2 bg-muted/50 rounded">
                      <p className="font-bold">{selectedAgent.performance.businessImpact}</p>
                      <p className="text-muted-foreground">Impact</p>
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t space-y-2">
                  <Link href={`/dashboard/ceo/agents/edit/${selectedAgent.id}`} className="block">
                    <Button size="sm" variant="outline" className="w-full">
                      <Settings className="h-4 w-4 mr-2" />
                      Configure Agent
                    </Button>
                  </Link>
                  <Link href="/dashboard/ceo/agents/analytics" className="block">
                    <Button size="sm" variant="outline" className="w-full">
                      <BarChart3 className="h-4 w-4 mr-2" />
                      View Analytics
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Chat Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Chat Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="reasoning" className="text-sm">Show Reasoning</Label>
                <Switch
                  id="reasoning"
                  checked={showReasoning}
                  onCheckedChange={setShowReasoning}
                />
              </div>
              
              <div className="space-y-2">
                <Label className="text-sm">Response Style</Label>
                <Select defaultValue="professional">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="professional">Professional</SelectItem>
                    <SelectItem value="casual">Casual</SelectItem>
                    <SelectItem value="detailed">Detailed</SelectItem>
                    <SelectItem value="concise">Concise</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Recent Chats */}
          {selectedAgent && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Recent Chats</CardTitle>
              </CardHeader>
              <CardContent>
                {(() => {
                  const agentChats = getAgentChats(selectedAgent.id);
                  
                  if (agentChats.length === 0) {
                    return (
                      <p className="text-sm text-muted-foreground">No previous chats</p>
                    );
                  }

                  return (
                    <div className="space-y-2">
                      {agentChats.slice(0, 3).map((chat) => (
                        <Button
                          key={chat.id}
                          variant={currentChat?.id === chat.id ? "default" : "ghost"}
                          size="sm"
                          className="w-full justify-start text-left"
                          onClick={() => {
                            setCurrentChat(chat);
                            setChatMessages(chat.messages);
                            window.history.replaceState({}, '', `/dashboard/ceo/chat?agent=${selectedAgent.id}&chat=${chat.id}`);
                          }}
                        >
                          <div className="truncate">
                            <p className="font-medium text-xs">{chat.title}</p>
                            <p className="text-xs text-muted-foreground">
                              {chat.messages.length} messages
                            </p>
                          </div>
                        </Button>
                      ))}
                    </div>
                  );
                })()}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Chat Area */}
        <div className="lg:col-span-3">
          {selectedAgent ? (
            <Card className="h-[calc(100vh-200px)] flex flex-col">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="text-xl">{selectedAgent.avatar}</div>
                    <div>
                      <CardTitle className="text-lg">{selectedAgent.name}</CardTitle>
                      <CardDescription>
                        {currentChat?.title || `Chat with ${selectedAgent.name}`}
                      </CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <StatusBadge status={selectedAgent.status} size="sm" />
                    <Button size="sm" variant="outline" onClick={handleNewChat}>
                      <Plus className="h-4 w-4 mr-2" />
                      New Chat
                    </Button>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="flex-1 flex flex-col p-0">
                <ChatContainerRoot className="flex-1 flex flex-col">
                  <ChatContainerContent 
                    ref={scrollContainerRef}
                    className="flex-1 overflow-y-auto p-4 space-y-4"
                  >
                    {chatMessages.length === 0 ? (
                      <div className="text-center py-8">
                        <div className="text-4xl mb-4">{selectedAgent.avatar}</div>
                        <h3 className="text-lg font-medium mb-2">
                          Welcome to {selectedAgent.name}
                        </h3>
                        <p className="text-muted-foreground mb-4">
                          I'm your {selectedAgent.type} agent. How can I help you today?
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-w-md mx-auto">
                          {selectedAgent.specialties.slice(0, 4).map((specialty, index) => (
                            <Button
                              key={index}
                              variant="outline"
                              size="sm"
                              className="text-xs"
                              onClick={() => setPrompt(`Help me with ${specialty.toLowerCase()}`)}
                            >
                              {specialty}
                            </Button>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <>
                        {chatMessages.map((message, index) => (
                          <Message key={message.id || index} className="group">
                            <div className="flex items-start space-x-3">
                              <Avatar className="h-8 w-8 mt-1">
                                <AvatarFallback>
                                  {message.role === 'user' ? <User className="h-4 w-4" /> : selectedAgent.avatar}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center space-x-2 mb-1">
                                  <span className="font-medium text-sm">
                                    {message.role === 'user' ? 'You' : selectedAgent.name}
                                  </span>
                                  <span className="text-xs text-muted-foreground">
                                    {new Date(message.timestamp).toLocaleTimeString()}
                                  </span>
                                  {message.metadata?.confidence && (
                                    <Badge variant="secondary" className="text-xs">
                                      {Math.round(message.metadata.confidence * 100)}% confidence
                                    </Badge>
                                  )}
                                </div>
                                <MessageContent className="text-sm">
                                  {message.content}
                                </MessageContent>
                                {message.metadata?.sources && message.metadata.sources.length > 0 && (
                                  <div className="mt-2 text-xs text-muted-foreground">
                                    <span className="font-medium">Sources: </span>
                                    {message.metadata.sources.join(', ')}
                                  </div>
                                )}
                                {message.role === 'assistant' && (
                                  <MessageActions className="mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <MessageAction>
                                      <Button size="sm" variant="ghost" className="h-6 px-2">
                                        <Copy className="h-3 w-3" />
                                      </Button>
                                    </MessageAction>
                                    <MessageAction>
                                      <Button size="sm" variant="ghost" className="h-6 px-2">
                                        <ThumbsUp className="h-3 w-3" />
                                      </Button>
                                    </MessageAction>
                                    <MessageAction>
                                      <Button size="sm" variant="ghost" className="h-6 px-2">
                                        <ThumbsDown className="h-3 w-3" />
                                      </Button>
                                    </MessageAction>
                                  </MessageActions>
                                )}
                              </div>
                            </div>
                          </Message>
                        ))}
                        
                        {isLoading && (
                          <Message className="animate-pulse">
                            <div className="flex items-start space-x-3">
                              <Avatar className="h-8 w-8 mt-1">
                                <AvatarFallback>{selectedAgent.avatar}</AvatarFallback>
                              </Avatar>
                              <div className="flex-1">
                                <div className="flex items-center space-x-2 mb-1">
                                  <span className="font-medium text-sm">{selectedAgent.name}</span>
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                </div>
                                <MessageContent className="text-sm text-muted-foreground">
                                  Thinking...
                                </MessageContent>
                              </div>
                            </div>
                          </Message>
                        )}
                      </>
                    )}
                    <div ref={messagesEndRef} />
                  </ChatContainerContent>
                  
                  {/* Scroll to bottom button */}
                  {showScrollButton && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="absolute bottom-20 right-8 rounded-full p-2"
                      onClick={scrollToBottom}
                    >
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  )}
                  
                  {/* Input Area */}
                  <div className="p-4 border-t">
                    <PromptInput onSubmit={handleSubmit} className="relative">
                      <PromptInputTextarea
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder={`Message ${selectedAgent.name}...`}
                        className="min-h-12 resize-none pr-12"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleSubmit();
                          }
                        }}
                      />
                      <PromptInputActions>
                        <PromptInputAction>
                          <Button
                            size="sm"
                            type="submit"
                            disabled={!prompt.trim() || isLoading}
                            className="absolute right-2 bottom-2"
                          >
                            {isLoading ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Send className="h-4 w-4" />
                            )}
                          </Button>
                        </PromptInputAction>
                      </PromptInputActions>
                    </PromptInput>
                  </div>
                </ChatContainerRoot>
              </CardContent>
            </Card>
          ) : (
            <Card className="h-[calc(100vh-200px)] flex items-center justify-center">
              <CardContent className="text-center">
                <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">Select an AI Agent</h3>
                <p className="text-muted-foreground mb-4">
                  Choose an agent from the sidebar to start chatting
                </p>
                <Link href="/dashboard/ceo/agents">
                  <Button variant="outline">
                    <Eye className="h-4 w-4 mr-2" />
                    View All Agents
                  </Button>
                </Link>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Agent Performance Stats */}
      {selectedAgent && (
        <div className="mt-6 grid gap-4 sm:gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
          {agentStats.map((stat, index) => (
            <StatCard key={index} {...stat} />
          ))}
        </div>
      )}
    </main>
  );
}
