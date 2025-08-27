# Component Structure

This document describes the reorganized component structure of the SEFGH UI project.

## Directory Structure

### `/src/components/`

#### Core Application
- `MainApp.tsx` - Main application component (formerly SEFGHApp.tsx)

#### Layout & Navigation
- `layout/`
  - `AppHeader.tsx` - Main application header with user controls
- `navigation/`
  - `NavigationPanel.tsx` - Side navigation panel

#### Chat System
- `chat/` - All chat-related components
  - `ChatPanel.tsx` - Main chat interface
  - `EnhancedChatPanel.tsx` - Enhanced chat with thinking system
  - `ChatManager.tsx` - Chat session management
  - `EnhancedHistoryPanel.tsx` - Chat history with advanced features
  - `FloatingActions.tsx` - Floating action buttons
  - `KeyboardShortcutsHelp.tsx` - Keyboard shortcuts help
  - `SkeletonMessage.tsx` - Loading skeleton for messages
  - `StreamedMessage.tsx` - Streaming message component
  - `ThoughtTimeline.tsx` - AI thinking timeline
  - `TokenCursor.tsx` - Token cursor animation

#### User Interface
- `ui/` - Reusable UI components (shadcn/ui and custom)
  - Standard shadcn components (button, card, input, etc.)
  - Custom components (AnimatedButton, LoadingSpinner, etc.)

#### Feature Panels
- `panels/` - Feature-specific panels
  - `AllPagesPanel.tsx` - All pages overview
  - `AnimationShowcase.tsx` - Animation demonstrations
  - `ConsolePanel.tsx` - Debug console
  - `HistoryPanel.tsx` - Basic history panel
  - `LanguagePanel.tsx` - Language settings
  - `ModelsPanel.tsx` - AI model management
  - `ProxyPanel.tsx` - Proxy configuration
  - `SettingsManagementPanel.tsx` - Settings management
  - `TestKeyPanel.tsx` - API key testing
  - `UsagePanel.tsx` - Usage statistics
  - `VirtualKeysPanel.tsx` - Virtual keyboard

#### User Features
- `profile/` - User profile components
  - `ProfilePictureUpload.tsx` - Profile picture upload
  - `PublicProfileSection.tsx` - Public profile display
  - `UserProfileDropdown.tsx` - User profile dropdown menu

- `settings/` - Settings components
  - `AccountSettingsPanel.tsx` - Account settings panel

- `sharing/` - Sharing functionality
  - `ShareModal.tsx` - Share content modal
  - `ShareableLinkManager.tsx` - Manage shareable links

#### Specialized Components
- `canvas/`
  - `CanvasPanel.tsx` - Canvas drawing interface

- `search/`
  - `SearchPanel.tsx` - GitHub repository search

- `input/`
  - `ExpandablePromptInput.tsx` - Expandable text input

- `workbench/` - Code workbench
  - `WorkbenchPanel.tsx` - Main workbench interface
  - `WorkbenchManager.tsx` - Workbench management
  - `WorkbenchList.tsx` - List of workbenches

- `common/` - Common utility components
  - `KeyboardShortcuts.tsx` - Keyboard shortcuts handler
  - `ThinkingAnimation.tsx` - AI thinking animation
  - `ToolsDropdown.tsx` - Tools dropdown menu

## Benefits of This Structure

1. **Logical Grouping**: Components are grouped by functionality rather than scattered
2. **Easier Navigation**: Developers can quickly find related components
3. **Better Maintainability**: Clear separation of concerns
4. **Scalability**: Easy to add new components in appropriate directories
5. **Reduced Import Complexity**: Shorter, more intuitive import paths

## Import Path Updates

All import paths have been updated to reflect the new structure. Components now use relative paths within their directories and absolute paths for cross-directory imports.