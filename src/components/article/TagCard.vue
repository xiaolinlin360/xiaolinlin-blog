<template>
  <aside class="tag-card">
    <div class="head">
      <span class="hash">#</span>
      <span class="title">文章标签</span>
      <span class="total">{{ labels.length }}</span>
    </div>

    <div class="tags">
      <span v-for="item in labels" :key="item.id" class="tag">
        {{ item.label_name }}<sup>{{ item.count }}</sup>
      </span>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getLabels, type LabelItem } from '@/api/label'

const labels = ref<LabelItem[]>([])

onMounted(async () => {
  try {
    labels.value = await getLabels()
  } catch (error) {
    console.error('获取标签失败', error)
  }
})
</script>

<style scoped lang="scss">
.tag-card {
  margin-top: 30px;
  padding: 18px 16px 16px;
  border: 1px solid $my-border-color;
  border-radius: 16px;
  background-color: transparent;

  .head {
    display: flex;
    align-items: baseline;
    gap: 6px;

    .hash {
      font-size: 15px;
      color: $my-text-light;
    }

    .title {
      font-size: 15px;
      font-weight: 600;
      color: $my-text-main;
    }

    /* 一共多少个标签，靠最右 */
    .total {
      margin-left: auto;
      font-size: 12px;
      color: $my-text-light;
    }
  }

  /* 标签自动换行排下去，右上角那个小数字是文章数 */
  .tags {
    display: flex;
    flex-wrap: wrap;
    gap: 10px 14px;
    margin-top: 14px;

    .tag {
      font-size: 13px;
      color: $my-text-sub;
      transition: color 0.15s;

      sup {
        margin-left: 1px;
        font-size: 10px;
        color: $my-text-light;
      }

      &:hover {
        color: $my-accent-color;
      }
    }
  }
}
</style>
