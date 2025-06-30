<template>
  <div class="container mx-auto p-6 bg-gray-50 min-h-screen">
    <div class="max-w-5xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
      <!-- 页面标题 -->
      <div class="bg-gradient-to-r from-cuc-red-600 to-cuc-red-700 p-6 text-white">
        <h1 class="text-2xl font-bold">评论文本生成</h1>
        <p class="text-cuc-red-100 mt-1">自动生成高质量社交媒体评论</p>
      </div>
    <!--将两个组件之间的空白变大一些-->
    <div class="p-6"></div>
      <!-- 步骤指示器 -->
      <div class="mb-8">
        <div class="flex items-center justify-between max-w-3xl mx-auto">
          <div v-for="step in 3" :key="step" class="flex items-center" :class="{ 'flex-1': step < 3 }">
            <div class="w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-200" :class="currentStep >= step ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'">
              {{ step }}
            </div>
            <div class="ml-3 text-sm font-medium">
              <span :class="currentStep >= step ? 'text-blue-600' : 'text-gray-500'">{{ ['内容分析', '账号选择', '评论生成'][step - 1] }}</span>
            </div>
            <div v-if="step < 3" class="flex-1 h-0.5 ml-4" :class="currentStep > step ? 'bg-blue-600' : 'bg-gray-200'"></div>
          </div>
        </div>
      </div>

      <div class="p-6 space-y-8">
        <!-- 1. 内容选择与分析区域 -->
        <div v-show="currentStep === 1" class="bg-gray-50 p-5 rounded-lg border border-gray-200">
          <h2 class="text-lg font-semibold mb-4 flex items-center">
            <svg class="w-5 h-5 mr-2 text-cuc-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
            </svg>
            内容分析
          </h2>
          <div class="space-y-4">
            <div class="flex gap-3">
              <select
                v-model="selectedContentId"
                class="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cuc-red-500 focus:border-transparent"
              >
                <option value="">-- 选择内容 --</option>
                <option v-for="item in contentItems" :key="item.id" :value="item.id">{{ item.url }}</option>
              </select>
              <button
                @click="loadContentData"
                :disabled="!selectedContentId || isLoading"
                class="px-4 py-2 bg-cuc-red-600 text-white rounded-lg hover:bg-cuc-red-700 disabled:bg-gray-400"
              >
                {{ isLoading ? '加载中...' : '确定' }}
              </button>
            </div>

            <!-- 内容展示区域 -->
            <div v-if="selectedContent" class="mt-4 p-4 bg-white rounded-lg border border-gray-200 shadow-sm">
              <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div class="space-y-1">
                  <label class="text-xs text-gray-500">主题</label>
                  <div class="p-2 bg-gray-50 rounded border border-gray-200 font-medium">
                    {{ selectedContent.topic }}
                  </div>
                </div>
                <div class="space-y-1">
                  <label class="text-xs text-gray-500">情感倾向</label>
                  <div class="p-2 bg-gray-50 rounded border border-gray-200">
                    <span :class="selectedContent.sentiment === 'positive' ? 'text-green-500' : selectedContent.sentiment === 'negative' ? 'text-red-500' : 'text-gray-500'">
                      {{ selectedContent.sentiment === 'positive' ? '积极' : selectedContent.sentiment === 'negative' ? '消极' : '中性' }}
                    </span>
                  </div>
                </div>
                <div class="space-y-1">
                  <label class="text-xs text-gray-500">发布人</label>
                  <div class="p-2 bg-gray-50 rounded border border-gray-200">
                    {{ selectedContent.author }}
                  </div>
                </div>
              </div>

              <div class="space-y-2 mb-4">
                <label class="text-sm text-gray-500">原帖内容</label>
                <div class="p-3 bg-gray-50 rounded border border-gray-200 min-h-[80px]">
                  {{ selectedContent.content }}
                </div>
              </div>

              <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div class="space-y-1">
                  <label class="text-xs text-gray-500">点赞量</label>
                  <div class="p-2 bg-gray-50 rounded border border-gray-200 flex items-center">
                    <svg class="w-4 h-4 mr-1 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clip-rule="evenodd"/>
                    </svg>
                    {{ selectedContent.likes.toLocaleString() }}
                  </div>
                </div>
                <div class="space-y-1">
                  <label class="text-xs text-gray-500">评论量</label>
                  <div class="p-2 bg-gray-50 rounded border border-gray-200 flex items-center">
                    <svg class="w-4 h-4 mr-1 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zm-4 0h-2v2h2V9z" clip-rule="evenodd"/>
                    </svg>
                    {{ selectedContent.comments.toLocaleString() }}
                  </div>
                </div>
                <div class="space-y-1">
                  <label class="text-xs text-gray-500">转贴量</label>
                  <div class="p-2 bg-gray-50 rounded border border-gray-200 flex items-center">
                    <svg class="w-4 h-4 mr-1 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M7 10V3L1 14h7v7l6-11H7z"/>
                    </svg>
                    {{ selectedContent.reposts.toLocaleString() }}
                  </div>
                </div>
                <div class="space-y-1">
                  <label class="text-xs text-gray-500">浏览量</label>
                  <div class="p-2 bg-gray-50 rounded border border-gray-200 flex items-center">
                    <svg class="w-4 h-4 mr-1 text-purple-500" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"/>
                      <path fill-rule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clip-rule="evenodd"/>
                    </svg>
                    {{ selectedContent.views.toLocaleString() }}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="flex justify-end mt-4">
            <button @click="nextStep" :disabled="!isStepComplete" class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              下一步
            </button>
          </div>
        </div>

        <!-- 2. 账号选择区域 -->
        <div v-show="currentStep === 2" class="bg-gray-50 p-5 rounded-lg border border-gray-200">
          <h2 class="text-lg font-semibold mb-4 flex items-center">
            <svg class="w-5 h-5 mr-2 text-cuc-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
            </svg>
            账号选择
          </h2>
          <div class="space-y-4">
            <div class="flex gap-3">
              <select v-model="selectedAccountId" class="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cuc-red-500 focus:border-transparent">
                <option value="">-- 选择账号 --</option>
                <option v-for="account in accounts" :key="account.id" :value="account.id">{{ account.username }}</option>
              </select>
              <button
                @click="loadAccountInfo"
                :disabled="!selectedAccountId"
                class="px-4 py-2 bg-cuc-red-600 text-white rounded-lg hover:bg-cuc-red-700 disabled:bg-gray-400"
              >
                确定
              </button>
            </div>

            <!-- 账号信息展示区域 -->
            <div v-if="selectedAccount" class="mt-4 p-4 bg-white rounded-lg border border-gray-200 shadow-sm">
              <div class="flex items-start gap-6">
                <!-- 头像显示 -->
                <div class="flex-shrink-0">
                  <img :src="selectedAccount.profileImage" :alt="selectedAccount.username + '的头像'" class="w-20 h-20 rounded-full object-cover border-2 border-gray-200">
                </div>
                
                <!-- 账号信息网格 -->
                <div class="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div class="space-y-1">
                    <label class="text-xs text-gray-500">账号ID</label>
                    <div class="p-2 bg-gray-50 rounded border border-gray-200">
                      {{ selectedAccount.id }}
                    </div>
                  </div>
                  <div class="space-y-1">
                    <label class="text-xs text-gray-500">用户名</label>
                    <div class="p-2 bg-gray-50 rounded border border-gray-200">
                      {{ selectedAccount.username }}
                    </div>
                  </div>
                  <div class="space-y-1">
                    <label class="text-xs text-gray-500">状态</label>
                    <div class="p-2 bg-gray-50 rounded border border-gray-200">
                      <span :class="selectedAccount.isActive ? 'text-green-500' : 'text-gray-400'">{{ selectedAccount.isActive ? '活跃' : '未活跃' }}</span>
                    </div>
                  </div>
                  <div class="space-y-1">
                    <label class="text-xs text-gray-500">粉丝数</label>
                    <div class="p-2 bg-gray-50 rounded border border-gray-200">
                      {{ selectedAccount.followerCount.toLocaleString() }}
                    </div>
                  </div>
                  <div class="space-y-1">
                    <label class="text-xs text-gray-500">关注数</label>
                    <div class="p-2 bg-gray-50 rounded border border-gray-200">
                      {{ selectedAccount.followingCount.toLocaleString() }}
                    </div>
                  </div>
                  <div class="space-y-1">
                    <label class="text-xs text-gray-500">推文数</label>
                    <div class="p-2 bg-gray-50 rounded border border-gray-200">
                      {{ selectedAccount.tweetCount.toLocaleString() }}
                    </div>
                  </div>
                  <div class="space-y-1 md:col-span-2">
                    <label class="text-xs text-gray-500">最后同步时间</label>
                    <div class="p-2 bg-gray-50 rounded border border-gray-200">
                      {{ new Date(selectedAccount.lastSyncedAt).toLocaleString() }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="flex justify-between mt-4">
            <button @click="prevStep" class="px-4 py-2 border border-gray-300 rounded-lg">
              上一步
            </button>
            <button @click="nextStep" :disabled="!isStepComplete" class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              下一步
            </button>
          </div>
        </div>

        <!-- 3. 评论生成区域 -->
        <div v-show="currentStep === 3" class="bg-gray-50 p-5 rounded-lg border border-gray-200">
          <h2 class="text-lg font-semibold mb-4 flex items-center">
            <svg class="w-5 h-5 mr-2 text-cuc-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 8h10M7 12h1m-7 4h18m-10 0v-1m0 1v-3m0 12h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2h14z"/>
            </svg>
            评论生成
          </h2>

          <div class="space-y-6">
            <button
              @click="generateComment"
              :disabled="!selectedAccount || !selectedContent || isGenerating"
              class="w-full py-3 bg-gradient-to-r from-cuc-red-600 to-cuc-red-700 text-white rounded-lg hover:shadow-lg disabled:bg-gray-400"
            >
              开始生成
            </button>

            <!-- 生成结果展示区域 -->
            <div v-if="generatedComment" class="mt-6 p-4 bg-white rounded-lg border border-gray-200 shadow-sm">
              <label class="block text-sm text-gray-500 mb-2">生成的评论内容</label>
              <textarea
                v-model="generatedComment"
                class="w-full p-3 border border-gray-300 rounded-lg min-h-[120px]"
              ></textarea>

              <div class="mt-4 flex justify-end">
                <button
                  @click="postComment"
                  :disabled="!generatedComment"
                  class="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  确认评论
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useTwitterStore } from '../stores/twitter'
import { useUserStore } from '../stores/user'
import { useContentStore } from '../stores/content'

// 步骤控制相关
const currentStep = ref(1)

const nextStep = () => {
  if (currentStep.value < 3) {
    currentStep.value++
  }
}

const prevStep = () => {
  if (currentStep.value > 1) {
    currentStep.value--
  }
}

const isStepComplete = computed(() => {
  switch (currentStep.value) {
    case 1: return !!selectedContent.value
    case 2: return !!selectedAccount.value
    case 3: return true
    default: return false
  }
})

// 内容选择相关数据
const selectedContentId = ref('')
const selectedContent = ref<any>(null)
const contentItems = ref<any[]>([])
const isLoading = ref(false)
const isGenerating = ref(false)
const generatedComment = ref('')

// 账号选择相关
const selectedAccountId = ref('')
const selectedAccount = ref<any>(null)

// 从stores获取数据
const twitterStore = useTwitterStore()
const contentStore = useContentStore()
const router = useRouter()

// 在组件挂载时获取账号和内容数据
onMounted(async () => {
  await Promise.all([
    twitterStore.fetchAccounts(),
    contentStore.fetchContents()
  ])
  contentItems.value = contentStore.getContentUrls()
})

// 计算属性：获取账号列表
const accounts = computed(() => twitterStore.accounts)

// 加载选中账号的详细信息
const loadAccountInfo = () => {
  const account = twitterStore.accounts.find(acc => acc.id === selectedAccountId.value)
  if (account) {
    selectedAccount.value = { ...account }
  }
}

// 加载选中内容的数据
const loadContentData = async () => {
  if (!selectedContentId.value) return

  isLoading.value = true
  try {
    // 从content store获取内容数据
    const content = contentStore.getContentByUrl(
      contentItems.value.find(item => item.id === selectedContentId.value)?.url || ''
    )
    
    if (content) {
      selectedContent.value = { ...content }
    } else {
      alert('未找到对应的内容数据')
    }
  } catch (error) {
    console.error('加载内容失败:', error)
    alert('加载内容失败，请重试')
  } finally {
    isLoading.value = false
  }
}

// 生成评论
const generateComment = async () => {
  if (!selectedAccount.value || !selectedContent.value) return

  isGenerating.value = true
  try {
    // 模拟模型调用延迟
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // 根据情感倾向生成不同风格的评论
    const sentimentMap = {
      positive: '非常赞同',
      negative: '不太认同',
      neutral: '客观来看'
    }
    
    const sentimentText = sentimentMap[selectedContent.value.sentiment] || '我认为'
    // 使用账号ID、内容分析的主题和情感倾向生成评论
    generatedComment.value = `${sentimentText}。账号ID: ${selectedAccount.value.id} 分享的${selectedContent.value.topic}内容很有见地。${selectedContent.value.content} 期待更多相关讨论！`
  } catch (error) {
    console.error('生成评论失败:', error)
    alert('评论生成失败，请重试')
  } finally {
    isGenerating.value = false
  }
}

// 发布评论
const postComment = async () => {
  if (!generatedComment.value.trim()) return

  try {
    // 模拟发布延迟
    await new Promise(resolve => setTimeout(resolve, 1500))
    alert('评论已发布成功！')
    // 跳转到评论成功页面
    router.push('/comment-success')
  } catch (error) {
    console.error('发布评论失败:', error)
    alert('发布评论失败，请重试')
  }
}
</script>