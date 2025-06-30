<template>
  <div class="min-h-screen bg-gray-50 flex items-center justify-center p-4">
    <div class="w-full max-w-md bg-white rounded-xl shadow-md overflow-hidden">
      <div class="p-6 sm:p-8">
        <div class="text-center">
          <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg class="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
            </svg>
          </div>
          <h2 class="text-2xl font-bold text-gray-900">评论发布成功！</h2>
          <p class="mt-2 text-gray-500">
            您的评论已成功提交，感谢您的参与。
          </p>
        </div>

        <div class="mt-8 space-y-3">
          <button
            @click="goToHome"
            class="w-full py-3 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            返回首页
          </button>
          <button
            @click="goToCommentGeneration"
            class="w-full py-3 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            再评论一条
          </button>
          <button
            @click="goToHistory"
            class="w-full py-3 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            查看历史数据
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

// 返回首页
const goToHome = () => {
  router.push('/CUC')
}

// 再评论一条
const goToCommentGeneration = () => {
  router.push('/comment-generation')
}

// 查看历史数据
const goToHistory = () => {
  router.push('/analytics')
}
</script>