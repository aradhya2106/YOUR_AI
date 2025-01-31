// src/config/webContainer.js
import { WebContainer } from '@webcontainer/api';


let webContainerInstance;

export const getWebContainer = async () => {
  if (!webContainerInstance) {
    try {
      webContainerInstance = await WebContainer.boot();
      console.log('✅ WebContainer initialized');
    } catch (error) {
      console.error('❌ Failed to initialize WebContainer:', error);
      throw error; // Re-throw to handle in components
    }
  }
  return webContainerInstance;
};