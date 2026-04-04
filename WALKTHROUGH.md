# NangLuc AI - Phase 1: Setup & Foundation

Dự án đã được khởi tạo với Next.js 15 và các thư viện cốt lõi.

## Tech Stack Đã Cài Đặt
- **Frontend**: Next.js 15 (App Router), TypeScript, Tailwind CSS
- **UI/UX**: Lucide React, Framer Motion (motion/react)
- **Database/Auth**: Supabase Client
- **State Management**: TanStack Query (React Query)
- **Form Handling**: React Hook Form + Zod

## Cấu Trúc Thư Mục
- `/src/app`: Chứa các route chính (Dashboard, Learn, Assessment)
- `/src/components`: Chứa UI components và Learning components
- `/src/lib`: Chứa logic kết nối Supabase và các tiện ích
- `/src/lib/supabase`: Cấu hình Supabase client

## Phase 6: Polish & Soft Launch (Hoàn tất)

Dự án đã sẵn sàng cho giai đoạn Soft Launch với 500 người dùng thử nghiệm.

### Các cải tiến cuối cùng:
- **PWA Ready**: Đã tích hợp `manifest.json` và Service Worker. Học sinh có thể cài đặt app lên màn hình chính điện thoại.
- **Offline Mode**: Hỗ trợ cache các trang chính và tài nguyên cơ bản để truy cập nhanh hơn.
- **Mobile Optimized**: Toàn bộ giao diện được tinh chỉnh cho cảm ứng (touch-friendly), các nút bấm tối thiểu 44px.
- **Error Handling**: Tích hợp `ErrorBoundary` toàn cục và Skeleton UI cho các trạng thái tải dữ liệu.
- **Feedback System**: Nút "Góp ý" nổi bật giúp thu thập phản hồi từ 500 người dùng đầu tiên.
- **Dark Mode Support**: Hỗ trợ giao diện tối dựa trên cấu hình hệ thống.

### Demo Flow (GIF Placeholders):
1. **Diagnostic**: [GIF: Học sinh làm bài kiểm tra đầu vào]
2. **Progress Tree**: [GIF: Cây tiến trình cá nhân hóa sau kiểm tra]
3. **Tutor Chat**: [GIF: Tương tác với AI Tutor theo khung SELF]

### Hướng dẫn triển khai:
1. Đảm bảo các biến môi trường `NEXT_PUBLIC_SUPABASE_URL` và `NEXT_PUBLIC_SUPABASE_ANON_KEY` đã được thiết lập.
2. Chạy `npm run build` để kiểm tra lần cuối.
3. Triển khai lên Vercel hoặc Cloud Run.

### Mục tiêu Soft Launch:
- Thu thập 500 người dùng thử nghiệm.
- Theo dõi tỷ lệ giữ chân (Retention) và thời gian phiên học tập.
- Tinh chỉnh AI Tutor dựa trên phản hồi thực tế.
