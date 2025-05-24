# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.


## Giải thích các thư mục chính:
📁 src/components/

common/: Components dùng chung (Header, Footer, Sidebar...)
ui/: Components UI cơ bản (Button, Input, Card...)
layout/: Components layout (MainLayout, AuthLayout...)

📁 src/pages/

Chứa các trang/màn hình của ứng dụng
Mỗi page có folder riêng với component, style và index file

📁 src/hooks/

Custom hooks để tái sử dụng logic
useAuth, useApi, useLocalStorage...

📁 src/context/

React Context cho state management toàn cục
AuthContext, ThemeContext...

📁 src/services/

api/: Các API calls
http/: HTTP client configuration
storage/: Utilities cho localStorage/sessionStorage

📁 src/store/

State management (Redux Toolkit hoặc Zustand)
Slices, middleware, store configuration

📁 src/utils/

constants/: Hằng số, API endpoints
helpers/: Utility functions
config/: Cấu hình ứng dụng

📁 src/styles/

Global styles, variables, mixins
Organized CSS/SCSS files

📁 src/routes/

Route configuration
Private/Public route components
Route constants
