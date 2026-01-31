import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEY = "kanflow_integrations";

export const integrationService = {
  getIntegrations: async () => {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEY);
      return data
        ? JSON.parse(data)
        : {
            github: { connected: false, config: {} },
            gitlab: { connected: false, config: {} },
            figma: { connected: false, config: {} },
            sentry: { connected: false, config: {} },
            slack: { connected: false, config: {} },
            discord: { connected: false, config: {} },
            zoom: { connected: false, config: {} },
          };
    } catch (error) {
      console.error("Failed to load integrations", error);
      return {};
    }
  },

  saveIntegrations: async (integrations) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(integrations));
    } catch (error) {
      console.error("Failed to save integrations", error);
    }
  },

  connectIntegration: async (key, config) => {
    try {
      const current = await integrationService.getIntegrations();
      const updated = {
        ...current,
        [key]: {
          connected: true,
          config: config,
        },
      };
      await integrationService.saveIntegrations(updated);

      // When reconnecting, clear the "deleted" blacklist for this provider
      // so tasks reappear.
      try {
        const stored = await AsyncStorage.getItem("deleted_external_tasks");
        if (stored) {
          const deletedTasks = JSON.parse(stored);
          const prefixMap = {
            github: "gh-",
            gitlab: "gl-",
            sentry: "sen-",
            figma: "fig-",
            zoom: "zoom-",
            slack: "slack-",
            discord: "disc-",
          };
          const prefix = prefixMap[key];
          if (prefix) {
            const newDeletedTasks = deletedTasks.filter(
              (id) => !id.startsWith(prefix),
            );
            await AsyncStorage.setItem(
              "deleted_external_tasks",
              JSON.stringify(newDeletedTasks),
            );
          }
        }
      } catch (e) {
        console.error("Failed to clear deleted tasks on connect", e);
      }

      return updated;
    } catch (error) {
      console.error("Failed to connect integration", error);
      throw error;
    }
  },

  disconnectIntegration: async (key) => {
    try {
      const current = await integrationService.getIntegrations();
      const updated = {
        ...current,
        [key]: {
          connected: false,
          config: {},
        },
      };
      await integrationService.saveIntegrations(updated);
      return updated;
    } catch (error) {
      console.error("Failed to disconnect integration", error);
      throw error;
    }
  },

  // Deprecated: kept for backward compatibility if needed, but should use connect/disconnect
  toggleIntegration: async (key) => {
    try {
      const current = await integrationService.getIntegrations();
      // Handle legacy boolean format if it exists
      const isConnected =
        typeof current[key] === "object"
          ? current[key].connected
          : current[key];

      if (isConnected) {
        return await integrationService.disconnectIntegration(key);
      } else {
        // If connecting without config, we can't really do much, so we just set connected=true (legacy behavior)
        // But the UI should now force connectIntegration with config.
        return await integrationService.connectIntegration(key, {});
      }
    } catch (error) {
      console.error("Failed to toggle integration", error);
      return null;
    }
  },
};
