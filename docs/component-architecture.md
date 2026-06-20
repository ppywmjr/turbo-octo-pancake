# Component & UI Architecture

This document provides an overview of the component structure and design patterns used in the application.

## Component Hierarchy & Organization

The application follows a modular component structure, primarily organized within the `app/components` directory. Components are categorized based on their responsibility and usage.

### 1. Layout & Page-Level Components
These components are typically used at the top level of pages to structure the layout and provide core functionality.
*   **`app/layout.tsx`**: The root layout that provides the global structure, including fonts, metadata, and global styles.
*   **`app/page.tsx`**: The main landing page component, which orchestrates several sub-components like `HeroCTA`, `CourseCard`, and plan displays.

### 2. Feature-Specific Components
These components are tied to specific business logic or user journeys.
*   **`app/components/HeroCTA.tsx`**: A high-impact component used to drive user engagement and direct them towards subscription plans.
*   **`app/components/SubscribeButton.tsx`**: A specialized button that handles the complex logic of initiating a checkout process via an API route.
*   **`app/components/AuthSync.tsx`**: A background component responsible for synchronizing user authentication state with the external subscription service.
*   **`app/courses/CourseGrid.tsx`**: A component used to display a collection of courses in a responsive grid layout.

### 3. Reusable UI Components
These are atomic or semi-atomic components designed for reuse across different parts of the application.
*   **`app/components/CourseCard.tsx`**: A card-based component used to represent individual courses.
*   \\u2013 **`app/components/VideoCard.tsx`**: A component for displaying individual videos within a course.
*   **`app/components/ErrorNotification.tsx`**: A global-style notification component used to display error messages to the user.

---

## Design Patterns & Principles

### 1. Separation of Concerns
The application maintains a clear separation between UI components and business logic:
*   **UI Components**: Focus on rendering and user interaction (e.g., `SubscribeButton`).
*   **Logic/Data Layer**: Complex operations, such as API calls and data fetching, are handled in `app/api` routes or utility functions in `app/lib`.

### 2. Client vs. Server Components (Next.js)
The application makes strategic use of Next.js's component models:
*   **Server Components**: Used for data-heavy tasks like fetching courses or plans from the backend. This minimizes the amount of JavaScript sent to the client and improves performance.
*   **Client Components**: Used for interactive elements that require browser-side state or effects (e.g., `AuthSync`, `SubscribeButton`). These are marked with the `'use client'` directive.

### 3. Responsive Design
The UI is built using **Tailwind CSS**, ensuring a responsive and modern look across different device sizes. The layout adapts seamlessly from mobile to desktop environments.

### 4. Error Handling & User Feedback
The application uses a proactive approach to error handling:
*   **`ErrorNotification`**: Provides immediate, visual feedback for errors (e.g., unauthorized access).
*   **Graceful Degradation**: Components like `VideoCardSkeleton` provide visual feedback during loading states, improving the perceived performance.

---

## Summary Table of Key Components

| Component | Type | Primary Responsibility |
| :--- | :--- | :--- |
| `HeroCTA` | Client | Drives user engagement and plan selection. |
| `SubscribeButton` | Client | Initiates the checkout process via API. |
| `AuthSync` | Client | Synchronizes user identity with the subscription service. |
| `ErrorNotification` | Client | Displays error messages to the user. |
| `CourseCard` | Server/Client | Represents a course in a grid or list. |
| `VideoCard` | Server/Client | Represents an individual video within a course. |
