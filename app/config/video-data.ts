/**
 * 视频教程数据配置
 * Video tutorial data configuration
 */
export interface VideoItem {
  id: string;
  title: string;
  fileName: string;
  description: string;
  icon?: string;
}

export interface VideoCategory {
  name: string;
  icon: string;
  videos: VideoItem[];
}

export const VIDEO_BASE_URL = '/videos/';

export const videoCategories: VideoCategory[] = [
  {
    name: '快速入门',
    icon: '🚀',
    videos: [
      { id: 'start-1', title: '平台介绍', fileName: 'intro.mp4', description: '了解平台的核心功能和使用场景' },
      { id: 'start-2', title: '账号注册', fileName: 'register.mp4', description: '演示如何注册和登录系统' },
    ],
  },
  {
    name: '基础操作',
    icon: '📖',
    videos: [
      { id: 'basic-1', title: '数据导入', fileName: 'import.mp4', description: '演示如何导入数据到系统' },
      { id: 'basic-2', title: '数据导出', fileName: 'export.mp4', description: '演示如何导出数据报表' },
    ],
  },
  {
    name: '高级功能',
    icon: '⚙️',
    videos: [
      { id: 'adv-1', title: 'API对接', fileName: 'api.mp4', description: '演示如何使用API进行系统对接' },
      { id: 'adv-2', title: '权限管理', fileName: 'permission.mp4', description: '演示如何配置用户权限' },
    ],
  },
];

// 扁平化视频数据，用于搜索组件
export const videoData = videoCategories.flatMap(category =>
  category.videos.map(video => ({
    type: 'video' as const,
    tab: 'main',
    category: category.name,
    title: video.title,
    description: video.description,
  }))
);
