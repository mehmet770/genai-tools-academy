export interface AITool {
  id: string
  slug: string
  name: string
  tagline: string
  description: string
  category: AIToolCategory
  logo_url: string
  website_url: string
  features: string[]
  robot_options: RobotOption[]
  created_at: string
}

export type AIToolCategory =
  | 'text'
  | 'image'
  | 'audio'
  | 'video'
  | 'code'
  | 'data'
  | 'multimodal'
  | 'research'
  | 'writing'

export interface AcademicScenario {
  id: string
  title: string
  description: string
  steps: string[]
  promptExample?: string
  difficulty: 'Başlangıç' | 'Orta' | 'İleri'
  discipline?: string
}

export interface ProConData {
  pros: string[]
  cons: string[]
  bestFor: string[]
  costModel: string
  privacyNote: string
}

export interface LearningPathStep {
  toolSlug: string
  toolName: string
  action: string
  duration: string
  outcome: string
  promptHint?: string
}

export interface LearningPath {
  slug: string
  title: string
  subtitle: string
  description: string
  duration: string
  level: 'Başlangıç' | 'Orta' | 'İleri'
  targetAudience: string
  icon: string
  color: string
  steps: LearningPathStep[]
  outcomes: string[]
  prerequisites: string[]
}

export interface Profile {
  id: string
  username: string
  avatar_url: string | null
  bio: string | null
  created_at: string
  educator_mode?: boolean
  institution?: string | null
  discipline?: string | null
}

export interface Post {
  id: string
  user_id: string
  image_url: string
  caption: string | null
  likes_count: number
  created_at: string
  profiles: Profile
}

export interface Comment {
  id: string
  tool_id: string
  user_id: string
  content: string
  created_at: string
  profiles: Profile
}

export interface PostComment {
  id: string
  post_id: string
  user_id: string
  content: string
  created_at: string
  profiles: Profile
}

export interface RobotOption {
  id: string
  label: string
  content: string
}

export interface NewsItem {
  id: string
  title: string
  description: string | null
  url: string
  source: string
  image_url: string | null
  published_at: string | null
  category: string
  created_at: string
}

export interface Favorite {
  id: string
  user_id: string
  tool_id: string
  created_at: string
}

export interface Prompt {
  id: string
  tool_id: string
  user_id: string
  title: string
  description: string   // public-facing açıklama (kullanıcı bunu okur)
  content: string       // gizli ham prompt (sadece kopyalanır)
  copies_count: number
  views_count: number
  created_at: string
  profiles?: Profile
}

export interface PromptView {
  id: string
  prompt_id: string
  viewer_id: string | null
  viewer_username: string
  viewed_at: string
}

export interface UserPathStep {
  step: number
  title: string
  description: string
  tool: string
  duration: string
}

export interface UserPath {
  id: string
  user_id: string
  title: string
  description: string
  icon: string
  steps: UserPathStep[]
  likes_count: number
  views_count: number
  is_public: boolean
  created_at: string
  profiles?: { username: string; avatar_url: string | null }
}

export type PathRankTier = 'Explorer' | 'Compiler' | 'Promptsmith' | 'Architect'

export interface ToolView {
  id: string
  user_id: string
  tool_id: string
  viewed_at: string
  tools?: AITool
}
