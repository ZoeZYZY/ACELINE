# 🎾 AceLine User Manual | 使用手册

Welcome to **AceLine**, the premium tennis community hub designed for high-performance clubs and private courts.

---

## 1. Storage Architecture | 存储架构 (NEW)

AceLine now uses a **Decentralized Cloud Storage** model. Instead of a shared 100GB limit, storage is provided by the Super Admin's personal cloud drive.

- **Zero Storage Cost**: The platform acts as a management interface. Media is hosted on your linked cloud.
- **Privacy First**: AceLine utilizes **OAuth Handshake** to access only a dedicated `/Apps/AceLine` folder.

---

## 2. Role System | 角色系统

| Role | Permissions | Acquisition |
| :--- | :--- | :--- |
| **App Owner** (平台主) | Global oversight of all Super Admins & Communities | Fixed system account  |
| **Super Admin** (超级管理员) | Create community, **Handshake Cloud Storage**, Manage Admins & Members | Registered via **Master Secret** |
| **Admin** (管理员) | Manage albums, invite members, moderate content | Appointed by Super Admin |
| **Member** (正式成员) | Browse albums, upload photos to community cloud | Invited via **Invite Link/Code** |

---

## 3. Account Security | 账号安全 (NEW)

### 3.1 Email Verification | 邮箱验证
- All new accounts are marked as "Unverified" until they complete the email verification process.
- Verified accounts have priority access and enhanced community trust badges.
- **Demo Logic**: In this prototype, clicking "Verify" simulates the email sending and confirmation process.

### 3.2 Password Recovery | 密码找回
- If you forget your password, use the **"Forgot Password?"** link on the Login screen.
- Enter your registered email to receive a recovery link.
- **Demo Logic**: This prototype simulates the recovery flow without sending physical emails.

---

## 4. Community Setup & Cloud Link | 创建社区与云端连接

To establish a new community:
1. Select **"Register"** and enter your credentials.
2. Use a **Master Secret** (e.g., `ACE-7788`) in the "Invite Code" field to become a Super Admin.
3. **Cloud Handshake**: Choose your cloud provider and complete the OAuth flow.

---

## 5. Invitation System | 邀请机制

AceLine features an automated **Deep Link** invitation system:
- **Share**: Super Admins/Admins can click "Share Invite Link" in their Profile.
- **Mechanism**: The link contains `inviteCode` and `cid` parameters for auto-filling the registration form.

---

## 6. Pre-set Master Secrets | 预设超级管理密钥

The following keys initialize a new Super Admin account:
- 

---
*AceLine - Relive Every Match Point.*
