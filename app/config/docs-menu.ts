import type { TreeItem } from "@nuxt/ui";

/**
 * 文档侧边栏菜单配置
 * Documentation sidebar menu configuration
 */
export const docsMenuItems: TreeItem[] = [
  {
    label: "帮助中心",
    defaultExpanded: true,
    path: "/docs",
    children: [
      {
        label: "用户手册",
        path: "/docs/user_manual/user_register",
        children: [
          { label: "快速开始", path: "/docs/user_manual/user_register" },
          { label: "基础功能", path: "/docs/user_manual/jyqy" },
          { label: "高级功能", path: "/docs/user_manual/yljg" },
        ],
      },
    ],
  },
];
