import { create } from "zustand";
import { persist } from "zustand/middleware";

/**
 * Admin Store using Zustand
 * 
 * Centralized state management for admin panel functionality including:
 * - Workspace approval management
 * - User management state
 * - System settings state
 * - UI state (sidebar, modals, etc.)
 * - Admin notifications and alerts
 * 
 * This store follows the existing Zustand patterns in the application
 * and provides admin-specific state management separate from user state.
 */
const useAdminStore = create(
  persist(
    (set, get) => ({
      // ===== WORKSPACE MANAGEMENT STATE =====
      workspaces: {
        pending: [],
        approved: [],
        rejected: [],
        loading: false,
        error: null,
      },

      // ===== USER MANAGEMENT STATE =====
      users: {
        all: [],
        admins: [],
        loading: false,
        error: null,
      },

      // ===== UI STATE =====
      ui: {
        sidebarCollapsed: false,
        activeSection: "dashboard",
        activeItem: "",
        modals: {
          workspaceApproval: false,
          userManagement: false,
          systemSettings: false,
        },
        notifications: [],
      },

      // ===== SYSTEM STATE =====
      system: {
        stats: {
          totalUsers: 0,
          pendingWorkspaces: 0,
          activeWorkspaces: 0,
          systemHealth: "healthy",
        },
        settings: {},
        loading: false,
        error: null,
      },

      // ===== WORKSPACE ACTIONS =====
      setWorkspaces: (workspaces) =>
        set((state) => ({
          workspaces: { ...state.workspaces, ...workspaces },
        })),

      addPendingWorkspace: (workspace) =>
        set((state) => ({
          workspaces: {
            ...state.workspaces,
            pending: [...state.workspaces.pending, workspace],
          },
        })),

      approveWorkspace: (workspaceId) =>
        set((state) => {
          const workspace = state.workspaces.pending.find(w => w.id === workspaceId);
          if (!workspace) return state;

          return {
            workspaces: {
              ...state.workspaces,
              pending: state.workspaces.pending.filter(w => w.id !== workspaceId),
              approved: [...state.workspaces.approved, { ...workspace, status: "approved" }],
            },
          };
        }),

      rejectWorkspace: (workspaceId) =>
        set((state) => {
          const workspace = state.workspaces.pending.find(w => w.id === workspaceId);
          if (!workspace) return state;

          return {
            workspaces: {
              ...state.workspaces,
              pending: state.workspaces.pending.filter(w => w.id !== workspaceId),
              rejected: [...state.workspaces.rejected, { ...workspace, status: "rejected" }],
            },
          };
        }),

      setWorkspaceLoading: (loading) =>
        set((state) => ({
          workspaces: { ...state.workspaces, loading },
        })),

      setWorkspaceError: (error) =>
        set((state) => ({
          workspaces: { ...state.workspaces, error },
        })),

      // ===== USER ACTIONS =====
      setUsers: (users) =>
        set((state) => ({
          users: { ...state.users, ...users },
        })),

      setUserLoading: (loading) =>
        set((state) => ({
          users: { ...state.users, loading },
        })),

      setUserError: (error) =>
        set((state) => ({
          users: { ...state.users, error },
        })),

      // ===== UI ACTIONS =====
      setSidebarCollapsed: (collapsed) =>
        set((state) => ({
          ui: { ...state.ui, sidebarCollapsed: collapsed },
        })),

      setActiveSection: (section, item = "") =>
        set((state) => ({
          ui: { ...state.ui, activeSection: section, activeItem: item },
        })),

      toggleModal: (modalName) =>
        set((state) => ({
          ui: {
            ...state.ui,
            modals: {
              ...state.ui.modals,
              [modalName]: !state.ui.modals[modalName],
            },
          },
        })),

      addNotification: (notification) =>
        set((state) => ({
          ui: {
            ...state.ui,
            notifications: [...state.ui.notifications, {
              id: Date.now(),
              timestamp: new Date().toISOString(),
              ...notification,
            }],
          },
        })),

      removeNotification: (notificationId) =>
        set((state) => ({
          ui: {
            ...state.ui,
            notifications: state.ui.notifications.filter(n => n.id !== notificationId),
          },
        })),

      clearNotifications: () =>
        set((state) => ({
          ui: { ...state.ui, notifications: [] },
        })),

      // ===== SYSTEM ACTIONS =====
      setSystemStats: (stats) =>
        set((state) => ({
          system: { ...state.system, stats: { ...state.system.stats, ...stats } },
        })),

      setSystemSettings: (settings) =>
        set((state) => ({
          system: { ...state.system, settings: { ...state.system.settings, ...settings } },
        })),

      setSystemLoading: (loading) =>
        set((state) => ({
          system: { ...state.system, loading },
        })),

      setSystemError: (error) =>
        set((state) => ({
          system: { ...state.system, error },
        })),

      // ===== UTILITY ACTIONS =====
      resetStore: () =>
        set(() => ({
          workspaces: { pending: [], approved: [], rejected: [], loading: false, error: null },
          users: { all: [], admins: [], loading: false, error: null },
          ui: {
            sidebarCollapsed: false,
            activeSection: "dashboard",
            activeItem: "",
            modals: { workspaceApproval: false, userManagement: false, systemSettings: false },
            notifications: [],
          },
          system: {
            stats: { totalUsers: 0, pendingWorkspaces: 0, activeWorkspaces: 0, systemHealth: "healthy" },
            settings: {},
            loading: false,
            error: null,
          },
        })),
    }),
    {
      name: "admin-store",
      partialize: (state) => ({
        ui: {
          sidebarCollapsed: state.ui.sidebarCollapsed,
          activeSection: state.ui.activeSection,
          activeItem: state.ui.activeItem,
        },
        system: {
          settings: state.system.settings,
        },
      }),
    }
  )
);

export default useAdminStore;
