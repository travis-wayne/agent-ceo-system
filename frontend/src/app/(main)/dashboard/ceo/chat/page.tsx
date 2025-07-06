"use client"

import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
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
  DollarSign
} from "lucide-react"
import { AppLayout } from "@/components/app-layout"
import { toast } from "sonner"
import { PageHeader } from "@/components/page-header";

const messages = [
  {
    id: 1,
    role: "user",
    content: "Hello! Can you help me with a coding question?",
  },
  {
    id: 2,
    role: "assistant",
    content:
      "Of course! I'd be happy to help with your coding question. What would you like to know?",
  },
  {
    id: 3,
    role: "user",
    content: "How do I create a responsive layout with CSS Grid?",
  },
  {
    id: 4,
    role: "assistant",
    content:
      "Creating a responsive layout with CSS Grid is straightforward. Here's a basic example:\n\n```css\n.container {\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));\n  gap: 1rem;\n}\n```\n\nThis creates a grid where:\n- Columns automatically fit as many as possible\n- Each column is at least 250px wide\n- Columns expand to fill available space\n- There's a 1rem gap between items\n\nWould you like me to explain more about how this works?",
  },
  {
    id: 5,
    role: "user",
    content: "What is the capital of France?",
  },
  {
    id: 6,
    role: "assistant",
    content: "The capital of France is Paris.",
  },
]

function ConversationPromptInput() {
  const [prompt, setPrompt] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [chatMessages, setChatMessages] = useState(messages)
  const [showReasoning, setShowReasoning] = useState(false)
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [showScrollButton, setShowScrollButton] = useState(false)

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

    // Small delay to ensure DOM is updated
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

  const handleSubmit = () => {
    if (!prompt.trim()) return

    setPrompt("")
    setIsLoading(true)

    // Add user message immediately
    const newUserMessage = {
      id: chatMessages.length + 1,
      role: "user",
      content: prompt.trim(),
    }

    setChatMessages([...chatMessages, newUserMessage])

    // Simulate API response
    setTimeout(() => {
      const assistantResponse = {
        id: chatMessages.length + 2,
        role: "assistant",
        content: `This is a response to: "${prompt.trim()}"`,
      }

      setChatMessages((prev) => [...prev, assistantResponse])
      setIsLoading(false)
    }, 1500)
  }

  return (
    <AppLayout>
      <PageHeader
        items={[
          { label: "CEO Dashboard", href: "/dashboard/ceo" },
          { label: "AI Chat", isCurrentPage: true },
        ]}
      />
      
      <main className="px-2 sm:px-4 md:px-6 py-4 md:py-6">
        {/* Chat Interface */}
        <Card className="flex flex-col max-h-[70vh] mb-8">
          <CardHeader className="border-b flex-shrink-0">
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              AI Conversation
            </CardTitle>
            <CardDescription>
              Powered by prompt-kit components
            </CardDescription>
          </CardHeader>
          
          <div className="flex-1 flex flex-col min-h-0 relative">
            <div ref={scrollContainerRef} className="flex-1 overflow-y-auto px-4 py-6">
              <div className="space-y-6">
                {chatMessages.map((message, index) => {
                  const isAssistant = message.role === "assistant"
                  const isLastMessage = index === chatMessages.length - 1 && !isLoading

                  return (
                    <Message
                      key={message.id}
                      className={cn(
                        "mx-auto flex w-full max-w-3xl flex-col gap-2 px-0 md:px-6",
                        isAssistant ? "items-start" : "items-end"
                      )}
                    >
                      {isAssistant ? (
                        <div className="group flex w-full flex-col gap-0">
                          <MessageContent
                            className="text-foreground prose w-full flex-1 rounded-lg bg-muted p-4"
                            markdown
                          >
                            {message.content}
                          </MessageContent>
                          <MessageActions
                            className={cn(
                              "-ml-2.5 flex gap-0 opacity-0 transition-opacity duration-150 group-hover:opacity-100",
                              isLastMessage && "opacity-100"
                            )}
                          >
                            <MessageAction tooltip="Copy" delayDuration={100}>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="rounded-full"
                                onClick={() => {
                                  navigator.clipboard.writeText(message.content);
                                  toast.success("Message copied to clipboard");
                                }}
                              >
                                <Copy className="h-4 w-4" />
                              </Button>
                            </MessageAction>
                            <MessageAction tooltip="Upvote" delayDuration={100}>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="rounded-full"
                                onClick={() => toast.success("Message upvoted")}
                              >
                                <ThumbsUp className="h-4 w-4" />
                              </Button>
                            </MessageAction>
                            <MessageAction tooltip="Downvote" delayDuration={100}>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="rounded-full"
                                onClick={() => toast.success("Message downvoted")}
                              >
                                <ThumbsDown className="h-4 w-4" />
                              </Button>
                            </MessageAction>
                          </MessageActions>
                        </div>
                      ) : (
                        <div className="group flex flex-col items-end gap-1">
                          <MessageContent className="bg-primary text-primary-foreground max-w-[85%] rounded-lg px-4 py-3 sm:max-w-[100%]">
                            {message.content}
                          </MessageContent>
                          <MessageActions
                            className={cn(
                              "flex gap-0 opacity-0 transition-opacity duration-150 group-hover:opacity-100"
                            )}
                          >
                            <MessageAction tooltip="Edit" delayDuration={100}>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="rounded-full"
                                onClick={() => toast.success("Edit mode activated")}
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                            </MessageAction>
                            <MessageAction tooltip="Delete" delayDuration={100}>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="rounded-full"
                                onClick={() => toast.success("Message deleted")}
                              >
                                <Trash className="h-4 w-4" />
                              </Button>
                            </MessageAction>
                            <MessageAction tooltip="Copy" delayDuration={100}>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="rounded-full"
                                onClick={() => {
                                  navigator.clipboard.writeText(message.content);
                                  toast.success("Message copied to clipboard");
                                }}
                              >
                                <Copy className="h-4 w-4" />
                              </Button>
                            </MessageAction>
                          </MessageActions>
                        </div>
                      )}
                    </Message>
                  )
                })}
                {/* Invisible element to scroll to */}
                <div ref={messagesEndRef} />
              </div>
              
              {/* Scroll to bottom button */}
              {showScrollButton && (
                <Button
                  onClick={scrollToBottom}
                  size="sm"
                  className="absolute bottom-4 right-4 rounded-full shadow-lg z-10"
                >
                  <ChevronDown className="h-4 w-4" />
                </Button>
              )}
            </div>
            
            <div className="border-t p-4 flex-shrink-0">
              <PromptInput
                isLoading={isLoading}
                value={prompt}
                onValueChange={setPrompt}
                onSubmit={handleSubmit}
                className="border-input bg-background relative z-10 w-full rounded-lg border p-0 shadow-sm"
              >
                <div className="flex flex-col">
                  <PromptInputTextarea
                    placeholder="Ask anything..."
                    className="min-h-[44px] pt-3 pl-4 text-base leading-[1.3] sm:text-base md:text-base"
                  />

                  <PromptInputActions className="mt-3 flex w-full items-center justify-between gap-2 px-3 pb-3">
                    <div className="flex items-center gap-2">
                      <PromptInputAction tooltip="Add attachment">
                        <Button
                          variant="outline"
                          size="icon"
                          className="size-8 rounded-full"
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </PromptInputAction>

                      <PromptInputAction tooltip="Search">
                        <Button variant="outline" size="sm" className="rounded-full">
                          <Globe className="h-4 w-4 mr-1" />
                          Search
                        </Button>
                      </PromptInputAction>

                      <PromptInputAction tooltip="More actions">
                        <Button
                          variant="outline"
                          size="icon"
                          className="size-8 rounded-full"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </PromptInputAction>
                    </div>
                    <div className="flex items-center gap-2">
                      <PromptInputAction tooltip="Voice input">
                        <Button
                          variant="outline"
                          size="icon"
                          className="size-8 rounded-full"
                        >
                          <Mic className="h-4 w-4" />
                        </Button>
                      </PromptInputAction>

                      <Button
                        size="icon"
                        disabled={!prompt.trim() || isLoading}
                        onClick={handleSubmit}
                        className="size-8 rounded-full"
                      >
                        {!isLoading ? (
                          <ArrowUp className="h-4 w-4" />
                        ) : (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        )}
                      </Button>
                    </div>
                  </PromptInputActions>
                </div>
              </PromptInput>
            </div>
          </div>
        </Card>

        {/* Settings Card */}
        <Card className="mb-4 sm:mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Conversation Settings
            </CardTitle>
            <CardDescription>
              Configure your prompt-kit conversation experience
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label htmlFor="reasoning-toggle" className="text-sm font-medium">
                  Show AI Reasoning
                </Label>
                <p className="text-xs text-muted-foreground">
                  Display the AI's thought process for each response
                </p>
              </div>
              <Switch
                id="reasoning-toggle"
                checked={showReasoning}
                onCheckedChange={setShowReasoning}
              />
            </div>
          </CardContent>
        </Card>
      </main>
    </AppLayout>
  )
}

export default ConversationPromptInput
