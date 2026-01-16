# 🎾 AceLine User Manual | 使用手册

Welcome to **AceLine**, the premium tennis community hub designed for high-performance clubs and private courts.

---

## 1. Role System | 角色系统

AceLine utilizes a hierarchical permission structure to ensure content quality and community security.

| Role | Permissions | Acquisition |
| :--- | :--- | :--- |
| **Super Admin** (超级管理员) | Full access, Key generation, Community creation | Created via one of the 5 Master Secrets |
| **Admin** (管理员) | Create/Edit albums, manage community content | Invited by Super Admin via Admin Key |
| **Member** (正式成员) | View albums, browse community feed | Invited by Admin/Super Admin via Member Key |

---

## 2. Community Setup | 创建社区

To establish a new hub, follow these steps:
1. Select **"Create Community"** from the registration screen.
2. Enter your details (Username, Password, Email).
3. Provide one of the **5 Master Secrets** (e.g., `ACE-7788`).
   - *Note: Each Master Secret is one-time use only per browser session. Once a community is tied to it, it becomes used.*
4. Upon success, a unique **Community ID** is generated automatically.

---

## 3. Managing Access | 访问权限管理

Super Admins can generate invitation codes to grow their community:
- Navigate to **Settings** -> **Keys List**.
- Select the target role (Member or Admin).
- Click **"Generate & Save"**.
- Use the **Link Icon** to copy a pre-formatted invitation message containing the Community ID and the verification code.

---

## 4. API & Security | 安全与接口说明

**Important: Zero Frontend API Exposure**
- **Authentication**: All sensitive API interactions (e.g., `/api/mystic-analysis`, `/api/mystic-title`) are handled via server-side proxies. 
- **No Client Keys**: There are zero Google Gemini or other AI API keys embedded in the frontend source code (`index.tsx`).
- **Data Privacy**: Personal information and credentials are never exposed in the browser's page source.

---

## 5. Pre-set Master Secrets | 预设超级管理密钥

The following keys are the only valid strings to initialize a new Super Admin account:
- `ACE-7788`
- `ACE-9922`
- `ACE-1155`
- `ACE-3344`
- `ACE-5566`

---

## 6. Local Storage | 数据存储

- All community data, user profiles, and invite statuses are managed via `localStorage`.
- To reset the application state, clear your browser's site data.
- **Cross-Device**: Since this is a client-side demo, data does not sync across different browsers unless a backend integration is active.

---
*AceLine - Relive Every Match Point.*