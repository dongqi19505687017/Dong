import { defineStore } from 'pinia'
import { ref } from 'vue'

// 定义内容项接口
export interface ContentItem {
  id: string
  url: string
  content: string
  likes: number
  comments: number
  reposts: number
  views: number
  topic: string
  sentiment: 'positive' | 'negative' | 'neutral'
  author: string
}

// 模拟内容数据
const mockContents: ContentItem[] = [
  {
    id: '1',
    url: 'https://twitter.com/example/status/123456789',
    content: '人工智能技术的最新发展为各行各业带来了革命性的变化，特别是在自然语言处理和计算机视觉领域。期待看到更多创新应用！',
    likes: 2453,
    comments: 328,
    reposts: 876,
    views: 156000,
    topic: '人工智能',
    sentiment: 'positive',
    author: 'TechInsights'
  },
  {
    id: '2',
    url: 'https://twitter.com/example/status/987654321',
    content: '气候变化对全球生态系统的影响日益明显，我们需要采取紧急行动减少碳排放，保护我们共同的家园。',
    likes: 5621,
    comments: 1245,
    reposts: 3208,
    views: 425000,
    topic: '气候变化',
    sentiment: 'negative',
    author: 'EcoWarrior'
  },
  {
    id: '3',
    url: 'https://twitter.com/example/status/456789123',
    content: '最新发布的编程语言排行榜显示，Python仍然保持领先地位，JavaScript和Java紧随其后。不同语言各有优势，选择应基于项目需求。',
    likes: 1876,
    comments: 432,
    reposts: 512,
    views: 98000,
    topic: '编程语言',
    sentiment: 'neutral',
    author: 'CodeMaster'
  },
  {
    id: '4',
    url: 'https://twitter.com/example/status/789123456',
    content: '健康饮食和规律运动是保持身体健康的关键。研究表明，每周至少进行150分钟中等强度运动可以显著降低慢性疾病风险。',
    likes: 3241,
    comments: 567,
    reposts: 1243,
    views: 210000,
    topic: '健康生活',
    sentiment: 'positive',
    author: 'HealthExpert'
  }
]

export const useContentStore = defineStore('content', () => {
  const contents = ref<ContentItem[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  // 获取所有内容
  const fetchContents = async () => {
    loading.value = true
    error.value = null
    try {
      // 模拟API请求延迟
      await new Promise(resolve => setTimeout(resolve, 800))
      contents.value = mockContents
      return contents.value
    } catch (err: any) {
      error.value = err.message || '获取内容失败'
      return []
    } finally {
      loading.value = false
    }
  }

  // 根据URL获取内容
  const getContentByUrl = (url: string) => {
    return contents.value.find(item => item.url === url)
  }

  // 获取所有内容URL列表
  const getContentUrls = () => {
    return contents.value.map(item => ({ id: item.id, url: item.url }))
  }

  return {
    contents,
    loading,
    error,
    fetchContents,
    getContentByUrl,
    getContentUrls
  }
})